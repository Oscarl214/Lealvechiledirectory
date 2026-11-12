import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireGarageSession } from "@/lib/garage-session"
import { parseRecallStatuses, recallsFromNhtsa, type RecallStatus } from "@/lib/recalls"

function isK5(vehicle: { make: string; model: string }) {
  return (
    vehicle.make.trim().toLowerCase() === "kia" &&
    vehicle.model.trim().toLowerCase().replace(/\s+/g, "") === "k5"
  )
}

async function k5() {
  const vehicles = await prisma.vehicle.findMany()
  return vehicles.find(isK5) ?? null
}

async function officialRecalls(vehicle: { year: number; make: string; model: string; recalls: unknown }) {
  const url = new URL("https://api.nhtsa.gov/recalls/recallsByVehicle")
  url.searchParams.set("make", vehicle.make)
  url.searchParams.set("model", vehicle.model)
  url.searchParams.set("modelYear", String(vehicle.year))
  const response = await fetch(url, { signal: AbortSignal.timeout(8000), next: { revalidate: 60 * 60 * 24 } })
  if (!response.ok) throw new Error("NHTSA recall lookup failed")
  return recallsFromNhtsa(await response.json(), parseRecallStatuses(vehicle.recalls))
}

export async function GET() {
  const auth = await requireGarageSession()
  if (auth.response) return auth.response
  try {
    const vehicle = await k5()
    if (!vehicle) return NextResponse.json({ error: "K5 not found" }, { status: 404 })
    const recalls = await officialRecalls(vehicle)
    return NextResponse.json({ recalls })
  } catch (error) {
    console.error("Error loading recalls", error instanceof Error ? error.message : "unknown")
    return NextResponse.json({ error: "Could not load recalls" }, { status: 502 })
  }
}

export async function PATCH(request: Request) {
  const auth = await requireGarageSession()
  if (auth.response) return auth.response
  try {
    const body = await request.json()
    const campaign = typeof body.campaign === "string" ? body.campaign.trim() : ""
    const status = body.status as RecallStatus
    if (!campaign || !["open", "done", "skip"].includes(status)) {
      return NextResponse.json({ error: "Choose what to do with that recall" }, { status: 400 })
    }
    const vehicle = await k5()
    if (!vehicle || vehicle.id !== body.vehicleId) {
      return NextResponse.json({ error: "K5 not found" }, { status: 404 })
    }
    const saved = parseRecallStatuses(vehicle.recalls)
    saved[campaign] = status
    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { recalls: saved as unknown as Prisma.InputJsonValue },
    })
    const recalls = await officialRecalls({ ...vehicle, recalls: saved })
    return NextResponse.json({ recalls })
  } catch (error) {
    console.error("Error saving recall", error instanceof Error ? error.message : "unknown")
    return NextResponse.json({ error: "Could not save that recall" }, { status: 500 })
  }
}

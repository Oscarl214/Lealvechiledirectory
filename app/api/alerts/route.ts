import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"
import { requireGarageSession } from "@/lib/garage-session"
import { parsePush, parsePushList, pushConfigured, sendPush } from "@/lib/push"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

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

export async function GET() {
  const auth = await requireGarageSession()
  if (auth.response) return auth.response
  const vehicle = await k5()
  if (!vehicle) return NextResponse.json({ error: "K5 not found" }, { status: 404 })
  return NextResponse.json({
    configured: pushConfigured(),
    phones: parsePushList(vehicle.alerts).length,
  })
}

export async function PUT(request: Request) {
  const auth = await requireGarageSession()
  if (auth.response) return auth.response
  const vehicle = await k5()
  if (!vehicle) return NextResponse.json({ error: "K5 not found" }, { status: 404 })
  const subscription = parsePush(await request.json().catch(() => null))
  if (!subscription) {
    return NextResponse.json({ error: "This phone did not send a usable alert subscription" }, { status: 400 })
  }
  const next = parsePushList(vehicle.alerts).filter((item) => item.endpoint !== subscription.endpoint)
  next.push(subscription)
  await prisma.vehicle.update({
    where: { id: vehicle.id },
    data: { alerts: next as unknown as Prisma.InputJsonValue },
  })
  return NextResponse.json({ phones: next.length })
}

export async function POST() {
  const auth = await requireGarageSession()
  if (auth.response) return auth.response
  if (!pushConfigured()) {
    return NextResponse.json(
      { error: "Alert sending is not turned on yet. Add the alert key on Vercel and redeploy." },
      { status: 503 }
    )
  }
  const vehicle = await k5()
  if (!vehicle) return NextResponse.json({ error: "K5 not found" }, { status: 404 })
  const list = parsePushList(vehicle.alerts)
  if (!list.length) {
    return NextResponse.json({ error: "Allow alerts on this phone first" }, { status: 400 })
  }
  try {
    const gone = await sendPush(list, {
      title: "K5 Garage",
      body: "Alerts are on. This is a test from the garage.",
    })
    if (gone.length) {
      const kept = list.filter((item) => !gone.includes(item.endpoint))
      await prisma.vehicle.update({
        where: { id: vehicle.id },
        data: { alerts: kept as unknown as Prisma.InputJsonValue },
      })
    }
    const sent = list.length - gone.length
    if (!sent) {
      return NextResponse.json({ error: "This phone’s alert permission expired. Allow alerts again." }, { status: 410 })
    }
    return NextResponse.json({ sent })
  } catch (error) {
    console.error("alert send", error instanceof Error ? error.message : "unknown")
    return NextResponse.json({ error: "The test alert could not be sent" }, { status: 500 })
  }
}

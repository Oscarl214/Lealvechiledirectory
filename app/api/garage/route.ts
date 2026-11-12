import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireGarageSession } from "@/lib/garage-session"
import { parseLoan, starterLoan } from "@/lib/loan"

function isK5(vehicle: { make: string; model: string }) {
  return (
    vehicle.make.trim().toLowerCase() === "kia" &&
    vehicle.model.trim().toLowerCase().replace(/\s+/g, "") === "k5"
  )
}

export async function GET() {
  const auth = await requireGarageSession()
  if (auth.response) return auth.response
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: { maintenances: true },
    })
    const vehicle = vehicles.find(isK5)
    if (!vehicle) {
      return NextResponse.json({ error: "K5 not found" }, { status: 404 })
    }
    let loan = parseLoan(vehicle.loan)
    if (!loan) {
      loan = starterLoan
      await prisma.vehicle.update({
        where: { id: vehicle.id },
        data: { loan: loan as unknown as Prisma.InputJsonValue },
      })
    }

    return NextResponse.json({
      vehicle: {
        id: vehicle.id,
        year: vehicle.year,
        odometer: vehicle.odometer,
        drive: vehicle.drive,
        transmission: vehicle.transmission,
        displacement: vehicle.displacement,
        city_mpg: vehicle.city_mpg,
        highway_mpg: vehicle.highway_mpg,
        loan,
        maintenances: vehicle.maintenances.map((entry) => ({
          id: entry.id,
          type: entry.type,
          description: entry.description,
          datedone: entry.datedone,
          date: entry.date,
          mileage: entry.mileage,
          cost: entry.cost,
          products: Array.isArray(entry.products)
            ? entry.products.filter((item): item is string => typeof item === "string")
            : [],
          tireHealth: entry.tireHealth,
          batteryHealth: entry.batteryHealth,
          tiresReplaced: entry.tiresReplaced,
          batteryReplaced: entry.batteryReplaced,
        })),
      },
    })
  } catch (error) {
    console.error("Error loading garage", error instanceof Error ? error.message : "unknown")
    return NextResponse.json({ error: "Could not load the garage" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const auth = await requireGarageSession()
  if (auth.response) return auth.response
  try {
    const { vehicleId, odometer } = await request.json()
    const miles = Number(odometer)
    if (!vehicleId || !Number.isInteger(miles) || miles < 0) {
      return NextResponse.json({ error: "Enter mileage as a whole number" }, { status: 400 })
    }

    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { odometer: miles },
      select: { id: true, odometer: true },
    })
    return NextResponse.json({ vehicle })
  } catch (error) {
    console.error("Error saving mileage", error instanceof Error ? error.message : "unknown")
    return NextResponse.json({ error: "Could not save mileage" }, { status: 500 })
  }
}

import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireGarageSession } from "@/lib/garage-session"
import { cappedPayment, parseLoan, starterLoan, type CarLoan } from "@/lib/loan"

function isK5(vehicle: { make: string; model: string }) {
  return (
    vehicle.make.trim().toLowerCase() === "kia" &&
    vehicle.model.trim().toLowerCase().replace(/\s+/g, "") === "k5"
  )
}

function money(value: unknown) {
  if (typeof value === "string" && value.trim() === "") return null
  const amount = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN
  if (!Number.isFinite(amount) || amount < 0) return null
  return Math.round(amount * 100) / 100
}

function sameTerms(current: CarLoan, next: CarLoan) {
  return (
    Math.round(current.balance * 100) === Math.round(next.balance * 100) &&
    Math.round(current.apr * 100) === Math.round(next.apr * 100) &&
    Math.round(current.monthlyPayment * 100) === Math.round(next.monthlyPayment * 100) &&
    current.asOf === next.asOf
  )
}

async function saveLoan(vehicleId: string, loan: CarLoan) {
  await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { loan: loan as unknown as Prisma.InputJsonValue },
  })
  return loan
}

export async function PUT(request: Request) {
  const auth = await requireGarageSession()
  if (auth.response) return auth.response
  try {
    const body = await request.json()
    const vehicles = await prisma.vehicle.findMany()
    const vehicle = vehicles.find(isK5)
    if (!vehicle || vehicle.id !== body.vehicleId) {
      return NextResponse.json({ error: "K5 not found" }, { status: 404 })
    }
    const next = parseLoan({ ...body, payments: [] })
    if (!next) {
      return NextResponse.json({ error: "Enter the balance, payment, price, and rate" }, { status: 400 })
    }
    const current = parseLoan(vehicle.loan) ?? starterLoan
    const keepPayments = sameTerms(current, next)
    const loan = await saveLoan(vehicle.id, { ...next, payments: keepPayments ? current.payments : [] })
    return NextResponse.json({ loan, clearedPayments: !keepPayments && current.payments.length > 0 })
  } catch (error) {
    console.error("Error saving loan", error instanceof Error ? error.message : "unknown")
    return NextResponse.json({ error: "Could not save the loan" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await requireGarageSession()
  if (auth.response) return auth.response
  try {
    const body = await request.json()
    const vehicles = await prisma.vehicle.findMany()
    const vehicle = vehicles.find(isK5)
    if (!vehicle || vehicle.id !== body.vehicleId) {
      return NextResponse.json({ error: "K5 not found" }, { status: 404 })
    }
    const amount = money(body.amount)
    const paidOn = typeof body.paidOn === "string" ? body.paidOn : ""
    if (amount == null || amount <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(paidOn)) {
      return NextResponse.json({ error: "Enter the payment amount and date" }, { status: 400 })
    }
    const current = parseLoan(vehicle.loan) ?? starterLoan
    const applied = cappedPayment(current, amount)
    if (applied == null) {
      return NextResponse.json({ error: "The loan is already paid off" }, { status: 400 })
    }
    const loan = await saveLoan(vehicle.id, {
      ...current,
      payments: [...current.payments, { id: crypto.randomUUID(), paidOn, amount: applied }],
    })
    return NextResponse.json({ loan })
  } catch (error) {
    console.error("Error saving payment", error instanceof Error ? error.message : "unknown")
    return NextResponse.json({ error: "Could not save that payment" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const auth = await requireGarageSession()
  if (auth.response) return auth.response
  try {
    const body = await request.json()
    const vehicles = await prisma.vehicle.findMany()
    const vehicle = vehicles.find(isK5)
    if (!vehicle || vehicle.id !== body.vehicleId) {
      return NextResponse.json({ error: "K5 not found" }, { status: 404 })
    }
    const current = parseLoan(vehicle.loan) ?? starterLoan
    if (typeof body.paymentId !== "string" || !current.payments.some((payment) => payment.id === body.paymentId)) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }
    const loan = await saveLoan(vehicle.id, {
      ...current,
      payments: current.payments.filter((payment) => payment.id !== body.paymentId),
    })
    return NextResponse.json({ loan })
  } catch (error) {
    console.error("Error removing payment", error instanceof Error ? error.message : "unknown")
    return NextResponse.json({ error: "Could not remove that payment" }, { status: 500 })
  }
}

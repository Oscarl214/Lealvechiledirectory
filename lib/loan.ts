import dayjs from "dayjs"

export type LoanPayment = {
  id: string
  paidOn: string
  amount: number
}

export type CarLoan = {
  purchasePrice: number
  apr: number
  monthlyPayment: number
  balance: number
  asOf: string
  payments: LoanPayment[]
}

export type LoanEvent = {
  id?: string
  due: string
  amount: number
  interest: number
  principal: number
  balance: number
  kind: "estimated" | "paid" | "upcoming"
}

export type LoanView = {
  balance: number
  principalPaid: number
  interestRemaining: number
  interestPaid: number
  payoffOn: string | null
  paymentsLeft: number
  history: LoanEvent[]
  paid: LoanEvent[]
  upcoming: LoanEvent[]
}

export const starterLoan: CarLoan = {
  purchasePrice: 25431.56,
  apr: 6.55,
  monthlyPayment: 453.84,
  balance: 16396.16,
  asOf: "2026-11-11",
  payments: [],
}

function cents(amount: number) {
  return Math.round(amount * 100)
}

function dollars(amount: number) {
  return Math.round(amount) / 100
}

function interestDue(balanceCents: number, apr: number) {
  return Math.round((balanceCents * Math.round(apr * 100)) / 120000)
}

function apply(balanceCents: number, apr: number, amountCents: number) {
  if (balanceCents <= 0) return { amount: 0, interest: 0, principal: 0, balance: 0 }
  const interest = interestDue(balanceCents, apr)
  const payoff = balanceCents + interest
  const amount = Math.min(Math.max(0, amountCents), payoff)
  return {
    amount,
    interest,
    principal: amount - interest,
    balance: balanceCents - (amount - interest),
  }
}

function money(value: unknown) {
  if (typeof value === "string" && value.trim() === "") return null
  const amount = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN
  if (!Number.isFinite(amount) || amount < 0) return null
  return dollars(cents(amount))
}

export function parseLoan(value: unknown): CarLoan | null {
  if (!value || typeof value !== "object") return null
  const raw = value as Record<string, unknown>
  const purchasePrice = money(raw.purchasePrice)
  const monthlyPayment = money(raw.monthlyPayment)
  const balance = money(raw.balance)
  const apr = typeof raw.apr === "number" ? raw.apr : typeof raw.apr === "string" && raw.apr.trim() !== "" ? Number(raw.apr) : NaN
  const asOf = typeof raw.asOf === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.asOf) ? raw.asOf : null
  if (purchasePrice == null || monthlyPayment == null || monthlyPayment <= 0 || balance == null || asOf == null) return null
  if (!Number.isFinite(apr) || apr < 0 || apr > 100) return null
  const payments = Array.isArray(raw.payments)
    ? raw.payments.flatMap((entry) => {
        if (!entry || typeof entry !== "object") return []
        const payment = entry as Record<string, unknown>
        const amount = money(payment.amount)
        if (typeof payment.id !== "string" || typeof payment.paidOn !== "string" || amount == null || amount <= 0) return []
        if (!/^\d{4}-\d{2}-\d{2}$/.test(payment.paidOn)) return []
        return [{ id: payment.id, paidOn: payment.paidOn, amount }]
      })
    : []
  return {
    purchasePrice,
    apr: dollars(Math.round(apr * 100)),
    monthlyPayment,
    balance,
    asOf,
    payments,
  }
}

function project(balanceCents: number, apr: number, paymentCents: number, firstDue: string, kind: LoanEvent["kind"]) {
  const rows: LoanEvent[] = []
  let balance = balanceCents
  let due = dayjs(firstDue)
  for (let index = 0; index < 480 && balance > 0; index += 1) {
    const applied = apply(balance, apr, paymentCents)
    if (applied.principal <= 0) break
    balance = applied.balance
    rows.push({
      due: due.format("YYYY-MM-DD"),
      amount: dollars(applied.amount),
      interest: dollars(applied.interest),
      principal: dollars(applied.principal),
      balance: dollars(balance),
      kind,
    })
    due = due.add(1, "month")
  }
  return rows
}

function estimatedHistory(loan: CarLoan) {
  const target = cents(loan.balance)
  const payment = cents(loan.monthlyPayment)
  let walked = cents(loan.purchasePrice)
  const rows: LoanEvent[] = []
  if (walked <= target) return rows
  while (rows.length < 480) {
    const applied = apply(walked, loan.apr, payment)
    if (applied.principal <= 0) break
    const closer = Math.abs(applied.balance - target) < Math.abs(walked - target)
    if (!closer) break
    walked = applied.balance
    rows.push({
      due: "",
      amount: dollars(applied.amount),
      interest: dollars(applied.interest),
      principal: dollars(applied.principal),
      balance: dollars(walked),
      kind: "estimated",
    })
    if (walked <= target) break
  }
  if (rows.length === 0) return rows
  const lastDue = dayjs(loan.asOf).subtract(1, "month")
  const firstDue = lastDue.subtract(rows.length - 1, "month")
  return rows.map((row, index) => ({
    ...row,
    due: firstDue.add(index, "month").format("YYYY-MM-DD"),
  }))
}

export function cappedPayment(loan: CarLoan, amount: number) {
  const view = loanView(loan)
  const balance = cents(view.balance)
  if (balance <= 0) return null
  const applied = apply(balance, loan.apr, cents(amount))
  if (applied.amount <= 0) return null
  return dollars(applied.amount)
}

export function loanView(loan: CarLoan): LoanView {
  const ordered = [...loan.payments].sort((a, b) => a.paidOn.localeCompare(b.paidOn) || a.id.localeCompare(b.id))
  let balance = cents(loan.balance)
  const paid: LoanEvent[] = []
  for (const payment of ordered) {
    const applied = apply(balance, loan.apr, cents(payment.amount))
    balance = applied.balance
    paid.push({
      id: payment.id,
      due: payment.paidOn,
      amount: dollars(applied.amount),
      interest: dollars(applied.interest),
      principal: dollars(applied.principal),
      balance: dollars(balance),
      kind: "paid",
    })
  }
  const anchor = paid[paid.length - 1]?.due ?? loan.asOf
  const upcoming = project(balance, loan.apr, cents(loan.monthlyPayment), dayjs(anchor).add(1, "month").format("YYYY-MM-DD"), "upcoming")
  const interestRemaining = upcoming.reduce((sum, row) => sum + cents(row.interest), 0)
  const interestPaid = paid.reduce((sum, row) => sum + cents(row.interest), 0)
  return {
    balance: dollars(balance),
    principalPaid: dollars(cents(loan.purchasePrice) - balance),
    interestRemaining: dollars(interestRemaining),
    interestPaid: dollars(interestPaid),
    payoffOn: balance === 0 ? (paid[paid.length - 1]?.due ?? loan.asOf) : (upcoming.at(-1)?.due ?? null),
    paymentsLeft: upcoming.length,
    history: estimatedHistory(loan),
    paid,
    upcoming,
  }
}

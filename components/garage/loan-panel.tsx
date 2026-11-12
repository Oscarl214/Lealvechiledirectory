"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LifeFill, useReveal } from "@/components/garage/motion"
import { formatMoney } from "@/lib/garage-logs"
import { loanView, payoffQuote, type CarLoan, type LoanEvent, type LoanView } from "@/lib/loan"

export function LoanCard({ loan, onOpen }: { loan: CarLoan; onOpen: () => void }) {
  const view = useMemo(() => loanView(loan), [loan])
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-[8.75rem] shrink-0 rounded-lg border border-white/15 bg-black/80 p-2.5 text-left landscape:w-32 landscape:p-2 min-[1000px]:w-40 min-[1000px]:bg-black/70 min-[1000px]:p-3 min-[1000px]:backdrop-blur-sm"
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">Loan</p>
      <p className="mt-1 text-lg font-medium">{formatMoney(view.balance)}</p>
      <p className="mt-1 text-[11px] leading-snug text-white/45">
        {view.paymentsLeft === 0 ? "Paid off" : `${view.paymentsLeft} left · ${loan.apr.toFixed(2)}%`}
      </p>
    </button>
  )
}

export function LoanSheet({
  loan,
  onOpen,
  ready = true,
  immediate = false,
}: {
  loan: CarLoan
  onOpen: () => void
  ready?: boolean
  immediate?: boolean
}) {
  const view = useMemo(() => loanView(loan), [loan])
  const reveal = useReveal<HTMLElement>(80, ready, immediate)
  const paidOff = loan.purchasePrice > 0 ? Math.max(0, Math.min(100, (view.principalPaid / loan.purchasePrice) * 100)) : 0
  return (
    <section ref={reveal.ref} className={`mt-5 ${reveal.className}`} style={reveal.style}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/45">Loan</p>
          <p className="mt-1 text-2xl font-medium">{formatMoney(view.balance)}</p>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/90"
        >
          Payment
        </button>
      </div>
      <p className="mt-1 text-xs text-white/50">
        {formatMoney(loan.monthlyPayment)}/mo · {loan.apr.toFixed(2)}% · bought {formatMoney(loan.purchasePrice)}
      </p>
      <LifeFill value={paidOff} play={reveal.shown} />
      <p className="mt-2 text-xs text-white/55">
        {formatMoney(view.principalPaid)} principal paid
        {view.payoffOn ? ` · paid off ${dayjs(view.payoffOn).format("MMM YYYY")}` : ""}
        {view.interestRemaining > 0 ? ` · ${formatMoney(view.interestRemaining)} interest left` : ""}
      </p>
      <DoublePayment loan={loan} view={view} />
      <TimelineDisclosure events={[...view.paid, ...view.upcoming]} />
    </section>
  )
}

export function LoanPanel({
  loan,
  vehicleId,
  onChange,
  onClose,
}: {
  loan: CarLoan
  vehicleId: string
  onChange: (loan: CarLoan) => void
  onClose: () => void
}) {
  const view = useMemo(() => loanView(loan), [loan])
  const [balance, setBalance] = useState(String(loan.balance))
  const [asOf, setAsOf] = useState(loan.asOf)
  const [payment, setPayment] = useState(String(loan.monthlyPayment))
  const [price, setPrice] = useState(String(loan.purchasePrice))
  const [apr, setApr] = useState(String(loan.apr))
  const [amount, setAmount] = useState(String(loan.monthlyPayment))
  const [paidOn, setPaidOn] = useState(() => dayjs().format("YYYY-MM-DD"))
  const [savingTerms, setSavingTerms] = useState(false)
  const [savingPayment, setSavingPayment] = useState(false)
  const historyEnd = view.history.at(-1)?.balance
  const gap = historyEnd == null ? 0 : Math.abs(Math.round((historyEnd - loan.balance) * 100) / 100)

  useEffect(() => {
    setBalance(String(loan.balance))
    setAsOf(loan.asOf)
    setPayment(String(loan.monthlyPayment))
    setPrice(String(loan.purchasePrice))
    setApr(String(loan.apr))
    setAmount(String(loan.monthlyPayment))
  }, [loan])

  async function saveTerms(event: FormEvent) {
    event.preventDefault()
    setSavingTerms(true)
    const response = await fetch("/api/loan", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicleId,
        balance,
        asOf,
        monthlyPayment: payment,
        purchasePrice: price,
        apr,
      }),
    })
    const body = await response.json().catch(() => null)
    setSavingTerms(false)
    if (!response.ok || !body?.loan) {
      toast.error(body?.error || "Could not save the loan")
      return
    }
    onChange(body.loan)
    toast.success(body.clearedPayments ? "Balance saved. Logged payments were cleared." : "Loan saved")
  }

  async function addPayment(event: FormEvent) {
    event.preventDefault()
    setSavingPayment(true)
    const response = await fetch("/api/loan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleId, amount, paidOn }),
    })
    const body = await response.json().catch(() => null)
    setSavingPayment(false)
    if (!response.ok || !body?.loan) {
      toast.error(body?.error || "Could not save that payment")
      return
    }
    onChange(body.loan)
    toast.success("Payment logged")
  }

  async function removePayment(paymentId: string) {
    const response = await fetch("/api/loan", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleId, paymentId }),
    })
    const body = await response.json().catch(() => null)
    if (!response.ok || !body?.loan) {
      toast.error(body?.error || "Could not remove that payment")
      return
    }
    onChange(body.loan)
  }

  return (
    <div className="fixed inset-0 z-30 flex justify-end overflow-x-hidden bg-black/40">
      <button
        type="button"
        aria-label="Close loan"
        className="hidden h-full min-w-0 flex-1 max-[999px]:landscape:block min-[1000px]:block"
        onClick={onClose}
      />
      <aside className="h-dvh w-full min-w-0 max-w-full overflow-x-hidden overflow-y-auto border-white/10 bg-zinc-950 p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] max-[999px]:landscape:max-w-[min(24rem,62vw)] max-[999px]:landscape:border-l min-[1000px]:max-w-md min-[1000px]:border-l min-[1000px]:p-5">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">Loan</p>
            <h2 className="text-lg font-semibold">{formatMoney(view.balance)} owed</h2>
            <p className="break-words text-xs text-white/50">
              {view.payoffOn ? `Paid off ${dayjs(view.payoffOn).format("MMM YYYY")}` : "Payment does not cover the interest"}
              {view.interestRemaining > 0 ? ` · ${formatMoney(view.interestRemaining)} interest left` : ""}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={saveTerms}>
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="loan-balance">Current balance</Label>
              <Input id="loan-balance" inputMode="decimal" value={balance} onChange={(event) => setBalance(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loan-as-of">Balance as of</Label>
              <Input id="loan-as-of" type="date" value={asOf} onChange={(event) => setAsOf(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loan-payment">Monthly payment</Label>
              <Input id="loan-payment" inputMode="decimal" value={payment} onChange={(event) => setPayment(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loan-apr">Interest %</Label>
              <Input id="loan-apr" inputMode="decimal" value={apr} onChange={(event) => setApr(event.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="loan-price">Price</Label>
            <Input id="loan-price" inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} />
          </div>
          <Button type="submit" className="max-w-full" disabled={savingTerms || vehicleId === "local"}>
            {savingTerms ? "Saving" : "Save loan"}
          </Button>
        </form>

        <form className="mt-6 space-y-4 border-t border-white/10 pt-4" onSubmit={addPayment}>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">Payment</p>
          <p className="text-xs text-white/50">
            Each payment takes one month of {loan.apr.toFixed(2)}% interest off the balance first. The rest lowers what you owe.
          </p>
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="payment-amount">Amount</Label>
              <Input id="payment-amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-date">Date</Label>
              <Input id="payment-date" type="date" value={paidOn} onChange={(event) => setPaidOn(event.target.value)} required />
            </div>
          </div>
          <Button type="submit" className="max-w-full" disabled={savingPayment || view.balance <= 0 || vehicleId === "local"}>
            {savingPayment ? "Saving" : "Log payment"}
          </Button>
        </form>

        <div className="mt-8 border-t border-white/10 pt-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">Timeline</p>
          <p className="mt-2 text-xs text-white/50">
            {formatMoney(view.principalPaid)} of the {formatMoney(loan.purchasePrice)} price is paid off.
          </p>
          <DoublePayment loan={loan} view={view} />
          {view.history.length > 0 ? (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-white/70">
                {view.history.length} earlier payments from the price
              </summary>
              {gap > 1 ? (
                <p className="mt-2 text-xs text-white/45">
                  That path lands {formatMoney(gap)} from the balance you set, so the months ahead use {formatMoney(loan.balance)}.
                </p>
              ) : null}
              <LoanTimeline events={view.history} />
            </details>
          ) : null}
          <TimelineDisclosure events={[...view.paid, ...view.upcoming]} onRemove={removePayment} />
        </div>
      </aside>
    </div>
  )
}

function DoublePayment({ loan, view }: { loan: CarLoan; view: LoanView }) {
  const quote = useMemo(() => payoffQuote(loan, loan.monthlyPayment * 2), [loan])
  if (!quote?.payoffOn) return null
  const saved = Math.max(0, Math.round((view.interestRemaining - quote.interestRemaining) * 100) / 100)
  const sooner = Math.max(0, view.paymentsLeft - quote.paymentsLeft)
  return (
    <div className="mt-2 space-y-0.5 text-xs text-white/55">
      <p>At {formatMoney(quote.payment)} a month, double the payment</p>
      <p>
        Paid off {dayjs(quote.payoffOn).format("MMM YYYY")}
        {sooner > 0 ? ` · ${sooner} months sooner` : ""}
      </p>
      <p>
        {formatMoney(quote.interestRemaining)} interest
        {saved > 0 ? ` · ${formatMoney(saved)} less` : ""}
      </p>
    </div>
  )
}

function TimelineDisclosure({ events, onRemove }: { events: LoanEvent[]; onRemove?: (id: string) => void }) {
  if (events.length === 0) return null
  const last = events[events.length - 1]
  return (
    <details className="mt-4">
      <summary className="cursor-pointer text-sm text-white/70">
        Timeline · {events.length} payments through {dayjs(last.due).format("MMM YYYY")}
      </summary>
      <LoanTimeline events={events} onRemove={onRemove} />
    </details>
  )
}

function LoanTimeline({ events, onRemove }: { events: LoanEvent[]; onRemove?: (id: string) => void }) {
  if (events.length === 0) return null
  return (
    <ol className="mt-3 space-y-3 border-l border-white/15 pl-4">
      {events.map((event, index) => (
        <li key={`${event.kind}-${event.due}-${event.id ?? index}`} className="relative">
          <span
            className={`absolute -left-[1.22rem] top-1.5 h-2 w-2 rounded-full ${
              event.kind === "upcoming" ? "bg-white" : "bg-white/35"
            }`}
          />
          <div className="flex min-w-0 items-baseline justify-between gap-3">
            <p className="min-w-0 text-sm">{dayjs(event.due).format("MMM D, YYYY")}</p>
            <p className="shrink-0 text-sm">{formatMoney(event.balance)} left</p>
          </div>
          <p className="break-words text-xs text-white/50">
            {formatMoney(event.amount)} · {formatMoney(event.interest)} interest · {formatMoney(event.principal)} principal
            {event.kind === "estimated" ? " · estimated" : ""}
          </p>
          {event.kind === "paid" && event.id && onRemove ? (
            <button type="button" onClick={() => onRemove(event.id!)} className="mt-1 text-xs text-white/45">
              Remove
            </button>
          ) : null}
        </li>
      ))}
    </ol>
  )
}

"use client"

import { useMemo } from "react"
import dayjs from "dayjs"
import { formatMoney } from "@/lib/garage-logs"
import { loanView, type CarLoan } from "@/lib/loan"

const samples = [
  {
    title: "Recall still open",
    body: "SC356 is unfinished. The fuel-tank check valve can be replaced free. Call Kia at 800-333-4542.",
  },
  {
    title: "Oil change",
    body: "The engine oil interval is the one to watch on this K5.",
  },
]

export function AlertsPanel({ loan, onClose }: { loan: CarLoan; onClose: () => void }) {
  const payment = useMemo(() => {
    const view = loanView(loan)
    const due = view.upcoming[0]?.due
    const when = due ? dayjs(due).format("MMM D") : "the 11th"
    return `${formatMoney(loan.monthlyPayment)} is due ${when}.`
  }, [loan])
  const now = dayjs()

  return (
    <div className="fixed inset-0 z-30 flex justify-end overflow-x-hidden bg-black/40">
      <button
        type="button"
        aria-label="Close alerts"
        className="hidden h-full min-w-0 flex-1 max-[999px]:landscape:block min-[1000px]:block"
        onClick={onClose}
      />
      <aside className="h-dvh w-full min-w-0 max-w-full overflow-x-hidden overflow-y-auto border-white/10 bg-zinc-950 p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] max-[999px]:landscape:max-w-[min(24rem,62vw)] max-[999px]:landscape:border-l min-[1000px]:max-w-md min-[1000px]:border-l min-[1000px]:p-5">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">Alerts</p>
            <h2 className="text-lg font-semibold">iPhone notifications</h2>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-white/70">
            Close
          </button>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-white/55">
          These show on the lock screen and as a banner. They are not text messages. The live ones turn on after the garage is added to your Home Screen.
        </p>
        <div className="mt-5 rounded-[1.75rem] bg-black px-3 pb-4 pt-8 shadow-inner ring-1 ring-white/10">
          <p className="text-center text-5xl font-light tracking-tight">{now.format("h:mm")}</p>
          <p className="mt-1 text-center text-sm text-white/70">{now.format("dddd, MMMM D")}</p>
          <div className="mt-6 space-y-2">
            <IphoneNote title="Loan payment" body={payment} />
            {samples.map((item) => (
              <IphoneNote key={item.title} title={item.title} body={item.body} />
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}

function IphoneNote({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-2xl bg-white/15 px-3 py-2.5 backdrop-blur-sm">
      <div className="flex items-center gap-1.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-zinc-800 text-[8px] font-semibold tracking-tight text-white">
          K5
        </span>
        <p className="text-[11px] font-medium uppercase tracking-wide text-white/70">K5 Garage</p>
        <p className="ml-auto text-[11px] text-white/45">now</p>
      </div>
      <p className="mt-1 text-[15px] font-semibold leading-tight">{title}</p>
      <p className="mt-0.5 text-[15px] leading-snug text-white/80">{body}</p>
    </article>
  )
}

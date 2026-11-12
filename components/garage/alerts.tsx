"use client"

import { useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
import { getMessaging, getToken, isSupported } from "firebase/messaging"
import { formatMoney } from "@/lib/garage-logs"
import { clientApp } from "@/lib/firebase"
import { loanView, type CarLoan } from "@/lib/loan"
import { vapidPublicKey } from "@/lib/vapid-public"

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
          These show on the lock screen and as a banner. They are not text messages.
        </p>
        <AlertSetup />
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

type AlertState = "checking" | "needs-home" | "ready" | "on" | "blocked" | "unsupported"

function installedApp() {
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent)
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  return { ios, standalone }
}

function AlertSetup() {
  const [state, setState] = useState<AlertState>("checking")
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const { ios, standalone } = installedApp()
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState(ios && !standalone ? "needs-home" : "unsupported")
      return
    }
    if (ios && !standalone) {
      setState("needs-home")
      return
    }
    if (Notification.permission === "granted") setState("on")
    else if (Notification.permission === "denied") setState("blocked")
    else setState("ready")
  }, [])

  async function allow() {
    setBusy(true)
    setMessage("")
    try {
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        setState(permission === "denied" ? "blocked" : "ready")
        return
      }
      if (!(await isSupported())) throw new Error("This phone cannot turn on alerts yet")
      const registration = await navigator.serviceWorker.register(
        `/sw.js?authDomain=${encodeURIComponent(String(clientApp().options.authDomain || ""))}`,
        { scope: "/" }
      )
      await navigator.serviceWorker.ready
      const token = await getToken(getMessaging(clientApp()), {
        vapidKey: vapidPublicKey,
        serviceWorkerRegistration: registration,
      })
      if (!token) throw new Error("This phone did not accept alerts")
      const saved = await fetch("/api/alerts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      const body = await saved.json().catch(() => ({}))
      if (!saved.ok) throw new Error(body.error || "Could not save this phone")
      setState("on")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not turn alerts on")
    } finally {
      setBusy(false)
    }
  }

  async function sendTest() {
    setBusy(true)
    setMessage("")
    try {
      const saved = await fetch("/api/alerts", { method: "POST" })
      const body = await saved.json().catch(() => ({}))
      if (!saved.ok) throw new Error(body.error || "The test alert could not be sent")
      setMessage("Sent. Lock the phone or leave the garage to see it.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The test alert could not be sent")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-4 rounded-2xl border border-white/10 p-3">
      <ol className="list-decimal space-y-1 pl-4 text-sm leading-relaxed text-white/80">
        <li>On the iPhone, open the garage in Safari.</li>
        <li>Tap Share, then Add to Home Screen.</li>
        <li>Open the new K5 Garage icon. Safari itself cannot turn alerts on.</li>
        <li>Tap Allow alerts, then Allow.</li>
        <li>Tap Send a test, then lock the phone.</li>
      </ol>
      {state === "ready" && (
        <button
          type="button"
          onClick={allow}
          disabled={busy}
          className="mt-3 rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/90 disabled:opacity-50"
        >
          {busy ? "Turning on" : "Allow alerts"}
        </button>
      )}
      {state === "on" && (
        <button
          type="button"
          onClick={sendTest}
          disabled={busy}
          className="mt-3 rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/90 disabled:opacity-50"
        >
          {busy ? "Sending" : "Send a test"}
        </button>
      )}
      {state === "blocked" && (
        <p className="mt-3 text-xs leading-relaxed text-white/55">
          Alerts are off for K5 Garage. Turn them on in iPhone Settings, under Notifications.
        </p>
      )}
      {state === "unsupported" && (
        <p className="mt-3 text-xs leading-relaxed text-white/55">
          This browser cannot deliver the alerts. Use the K5 Garage icon on the iPhone home screen.
        </p>
      )}
      {message && <p className="mt-3 text-xs leading-relaxed text-white/70">{message}</p>}
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

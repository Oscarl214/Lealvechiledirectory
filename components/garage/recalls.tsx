"use client"

import { useState } from "react"
import dayjs from "dayjs"
import { openRecallCount, type GarageRecall, type RecallStatus } from "@/lib/recalls"

function componentLabel(component: string) {
  const part = component.split(":").pop()?.trim() || "Recall"
  return part.toLowerCase().replace(/(^|\s|\/)\w/g, (letter) => letter.toUpperCase())
}

export function RecallCard({
  recalls,
  loaded,
  failed,
  onOpen,
}: {
  recalls: GarageRecall[]
  loaded: boolean
  failed: boolean
  onOpen: () => void
}) {
  const open = openRecallCount(recalls)
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-[8.75rem] shrink-0 rounded-lg border border-white/15 bg-black/80 p-2.5 text-left landscape:w-32 landscape:p-2 min-[1000px]:w-40 min-[1000px]:bg-black/70 min-[1000px]:p-3 min-[1000px]:backdrop-blur-sm"
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">Recalls</p>
      <p className="mt-1 text-lg font-medium">{failed ? "—" : loaded ? open : "…"}</p>
      <p className="mt-1 text-[11px] leading-snug text-white/45">
        {failed ? "Unavailable" : !loaded ? "Checking" : open === 0 ? "None open" : "Still open"}
      </p>
    </button>
  )
}

export function RecallSheet({
  recalls,
  loaded,
  failed,
  pending,
  onStatus,
}: {
  recalls: GarageRecall[]
  loaded: boolean
  failed: boolean
  pending: string | null
  onStatus: (campaign: string, status: RecallStatus) => void
}) {
  return (
    <section className="mt-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/45">Recalls</p>
      <p className="mt-1 text-xs text-white/50">Official campaigns for this model year. A 2.5 turbo listing may not be this 1.6.</p>
      <RecallList recalls={recalls} loaded={loaded} failed={failed} pending={pending} onStatus={onStatus} />
    </section>
  )
}

export function RecallPanel({
  recalls,
  loaded,
  failed,
  pending,
  onStatus,
  onClose,
}: {
  recalls: GarageRecall[]
  loaded: boolean
  failed: boolean
  pending: string | null
  onStatus: (campaign: string, status: RecallStatus) => void
  onClose: () => void
}) {
  const open = openRecallCount(recalls)
  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-black/40">
      <button
        type="button"
        aria-label="Close recalls"
        className="hidden h-full min-w-0 flex-1 max-[999px]:landscape:block min-[1000px]:block"
        onClick={onClose}
      />
      <aside className="h-dvh w-full overflow-auto border-white/10 bg-zinc-950 p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] max-[999px]:landscape:max-w-[min(24rem,62vw)] max-[999px]:landscape:border-l min-[1000px]:max-w-md min-[1000px]:border-l min-[1000px]:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">Recalls</p>
            <h2 className="text-lg font-semibold">{failed ? "Could not load" : `${open} open`}</h2>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-white/70">
            Close
          </button>
        </div>
        <RecallList recalls={recalls} loaded={loaded} failed={failed} pending={pending} onStatus={onStatus} />
      </aside>
    </div>
  )
}

function RecallList({
  recalls,
  loaded,
  failed,
  pending,
  onStatus,
}: {
  recalls: GarageRecall[]
  loaded: boolean
  failed: boolean
  pending: string | null
  onStatus: (campaign: string, status: RecallStatus) => void
}) {
  if (failed) return <p className="mt-3 text-sm text-white/55">The recall list could not be loaded.</p>
  if (!loaded) return <p className="mt-3 text-sm text-white/55">Checking official recalls.</p>
  if (recalls.length === 0) return <p className="mt-3 text-sm text-white/55">No campaigns are on file for this model year.</p>
  return (
    <ul className="mt-3 space-y-3">
      {recalls.map((recall) => (
        <RecallRow key={recall.campaign} recall={recall} pending={pending === recall.campaign} onStatus={onStatus} />
      ))}
    </ul>
  )
}

function RecallRow({
  recall,
  pending,
  onStatus,
}: {
  recall: GarageRecall
  pending: boolean
  onStatus: (campaign: string, status: RecallStatus) => void
}) {
  const [open, setOpen] = useState(false)
  const quiet = recall.status !== "open"
  return (
    <li className={`rounded-2xl border border-white/10 p-3 ${quiet ? "bg-white/[0.03]" : "bg-white/5"}`}>
      <div className="flex items-baseline justify-between gap-3">
        <p className={`text-sm ${quiet ? "text-white/55" : ""}`}>{componentLabel(recall.component)}</p>
        <p className="shrink-0 text-[11px] text-white/40">{dayjs(recall.reported).format("MMM D, YYYY")}</p>
      </div>
      <p className={`mt-1 text-xs leading-relaxed ${quiet ? "text-white/40" : "text-white/60"}`}>
        {open ? recall.summary : recall.summary.slice(0, 180)}
        {!open && recall.summary.length > 180 ? "…" : ""}
      </p>
      {recall.turboOnly ? <p className="mt-1 text-[11px] text-white/45">Listed for the 2.5 turbo</p> : null}
      {recall.parkOutside ? <p className="mt-1 text-[11px] text-white/70">Park outside until this is fixed</p> : null}
      <button type="button" onClick={() => setOpen((value) => !value)} className="mt-2 text-[11px] text-white/45">
        {open ? "Hide details" : "Details"}
      </button>
      {open ? (
        <div className="mt-2 space-y-2 text-xs leading-relaxed text-white/55">
          {recall.consequence ? <p>{recall.consequence}</p> : null}
          {recall.remedy ? <p>{recall.remedy}</p> : null}
          <p className="text-white/35">{recall.campaign}</p>
        </div>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <StatusButton
          label="Open"
          selected={recall.status === "open"}
          disabled={pending}
          onClick={() => onStatus(recall.campaign, "open")}
        />
        <StatusButton
          label="Done"
          selected={recall.status === "done"}
          disabled={pending}
          onClick={() => onStatus(recall.campaign, "done")}
        />
        <StatusButton
          label="Not this car"
          selected={recall.status === "skip"}
          disabled={pending}
          onClick={() => onStatus(recall.campaign, "skip")}
        />
      </div>
    </li>
  )
}

function StatusButton({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string
  selected: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-[11px] disabled:opacity-50 ${
        selected ? "border-white bg-white text-black" : "border-white/20 text-white/70"
      }`}
    >
      {label}
    </button>
  )
}

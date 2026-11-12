"use client"

import dayjs from "dayjs"
import { insurance, type RegistrationView } from "@/lib/coverage"
import { formatMoney } from "@/lib/garage-logs"

const chip =
  "w-[8.75rem] shrink-0 rounded-lg border border-white/15 bg-black/80 p-2.5 text-left landscape:w-32 landscape:p-2 min-[1000px]:w-40 min-[1000px]:bg-black/70 min-[1000px]:p-3 min-[1000px]:backdrop-blur-sm"

function CardOption() {
  return (
    <a
      href="/api/insurance-card"
      target="_blank"
      rel="noopener"
      className="mt-3 inline-block rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/90"
    >
      View card
    </a>
  )
}

export function InsuranceCard({ onOpen }: { onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className={chip}>
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">Insurance</p>
      <p className="mt-1 text-lg font-medium">{formatMoney(insurance.monthlyPayment)}</p>
      <p className="mt-1 text-[11px] leading-snug text-white/45">
        Through {dayjs(insurance.expires).format("MMM YYYY")}
      </p>
    </button>
  )
}

export function InsuranceSheet() {
  return (
    <section className="mt-5">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/45">Insurance</p>
        <p className="mt-1 text-2xl font-medium">{formatMoney(insurance.monthlyPayment)}</p>
      </div>
      <p className="mt-1 text-xs text-white/50">
        {insurance.carrier} · {insurance.policyNumber}
      </p>
      <p className="mt-1 text-xs text-white/50">
        {dayjs(insurance.effective).format("MMM D, YYYY")} – {dayjs(insurance.expires).format("MMM D, YYYY")} · every month
      </p>
      <p className="mt-1 text-xs text-white/45">Claims {insurance.claimsPhone}</p>
      <CardOption />
    </section>
  )
}

export function InsurancePanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-black/40">
      <button
        type="button"
        aria-label="Close insurance"
        className="hidden h-full min-w-0 flex-1 max-[999px]:landscape:block min-[1000px]:block"
        onClick={onClose}
      />
      <aside className="h-dvh w-full overflow-auto border-white/10 bg-zinc-950 p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] max-[999px]:landscape:max-w-[min(24rem,62vw)] max-[999px]:landscape:border-l min-[1000px]:max-w-md min-[1000px]:border-l min-[1000px]:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">Insurance</p>
            <h2 className="text-lg font-semibold">{formatMoney(insurance.monthlyPayment)} / month</h2>
            <p className="text-xs text-white/50">{insurance.carrier}</p>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-white/70">
            Close
          </button>
        </div>
        <dl className="mt-6 space-y-3 text-sm">
          <Fact label="Policy" value={insurance.policyNumber} />
          <Fact label="Insured" value={insurance.insured} />
          <Fact label="Address" value={insurance.address} />
          <Fact label="Vehicle" value={`${insurance.vehicle} · ${insurance.vin}`} />
          <Fact
            label="In force"
            value={`${dayjs(insurance.effective).format("MMM D, YYYY")} – ${dayjs(insurance.expires).format("MMM D, YYYY")}`}
          />
          <Fact label="Company" value={insurance.phone} />
          <Fact label="Claims" value={insurance.claimsPhone} />
        </dl>
        <CardOption />
        <a
          href={insurance.claimsUrl}
          target="_blank"
          rel="noopener"
          className="mt-4 inline-block text-xs text-white/45"
        >
          File a claim
        </a>
      </aside>
    </div>
  )
}

export function RegistrationCard({
  registration,
  onOpen,
}: {
  registration: RegistrationView | null
  onOpen: () => void
}) {
  return (
    <button type="button" onClick={onOpen} className={chip}>
      <RegistrationLabel registration={registration} />
    </button>
  )
}

export function RegistrationLabel({ registration }: { registration: RegistrationView | null }) {
  return (
    <>
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">Registration</p>
      <p className="mt-1 text-sm leading-snug">
        {registration?.due ? dayjs(registration.due).format("MMM D, YYYY") : "Not logged"}
      </p>
      <p className="mt-1 text-[11px] text-white/45">
        {registration?.stickerYear ? `${registration.stickerYear} sticker` : registration ? "Renewed" : "No sticker"}
      </p>
    </>
  )
}

export function RegistrationPanel({
  registration,
  onClose,
}: {
  registration: RegistrationView | null
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-black/40">
      <button
        type="button"
        aria-label="Close registration"
        className="hidden h-full min-w-0 flex-1 max-[999px]:landscape:block min-[1000px]:block"
        onClick={onClose}
      />
      <aside className="h-dvh w-full overflow-auto border-white/10 bg-zinc-950 p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] max-[999px]:landscape:max-w-[min(24rem,62vw)] max-[999px]:landscape:border-l min-[1000px]:max-w-md min-[1000px]:border-l min-[1000px]:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">Registration</p>
            <h2 className="text-lg font-semibold">
              {registration?.due ? `Due ${dayjs(registration.due).format("MMM D, YYYY")}` : "Not logged"}
            </h2>
            <p className="text-xs text-white/50">
              {registration?.stickerYear ? `${registration.stickerYear} sticker` : "Texas sticker"}
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-white/70">
            Close
          </button>
        </div>
        {registration ? (
          <dl className="mt-6 space-y-3 text-sm">
            <Fact label="Renewed" value={dayjs(registration.renewed).format("MMM D, YYYY")} />
            {registration.mileage != null ? (
              <Fact label="Miles" value={registration.mileage.toLocaleString()} />
            ) : null}
            {registration.note ? <Fact label="Log" value={registration.note} /> : null}
          </dl>
        ) : (
          <p className="mt-6 text-sm text-white/55">Log a registration to keep the sticker date here.</p>
        )}
        <p className="mt-6 text-xs leading-relaxed text-white/40">
          Texas stickers run through the last day of the renewal month. This date follows the latest registration log.
        </p>
      </aside>
    </div>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">{label}</dt>
      <dd className="mt-1 text-white/80">{value}</dd>
    </div>
  )
}

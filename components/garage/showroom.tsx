"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, useProgress } from "@react-three/drei"
import dayjs from "dayjs"
import { ChevronDown, CircleDot, Cog, Disc, LayoutGrid, Wind } from "lucide-react"
import { K5Model } from "@/components/garage/k5-model"
import {
  evaluateSchedule,
  formatMiles,
  intervalLabel,
  parseServiceDate,
  type MaintenanceLog,
  type ScheduleMode,
  type ServiceEvaluation,
} from "@/lib/k5"
import { LoanCard, LoanSheet } from "@/components/garage/loan-panel"
import { LifeFill, Reveal, useReveal } from "@/components/garage/motion"
import { batteryStatus, formatMoney, lastRegistration, recordedMiles, tireStatus, totalSpend } from "@/lib/garage-logs"
import type { CarLoan } from "@/lib/loan"

type GarageZone = "all" | "engine" | "wheels" | "brakes" | "cabin"

const zones: { id: GarageZone; label: string; icon: typeof Cog; place: string }[] = [
  { id: "all", label: "Overview", icon: LayoutGrid, place: "left-3 min-[1000px]:left-4 min-[1000px]:top-16" },
  { id: "engine", label: "Engine", icon: Cog, place: "left-3 min-[1000px]:left-4 min-[1000px]:top-16" },
  {
    id: "wheels",
    label: "Tires",
    icon: CircleDot,
    place: "left-3 min-[1000px]:bottom-20 min-[1000px]:left-4 min-[1000px]:top-auto",
  },
  {
    id: "brakes",
    label: "Brakes",
    icon: Disc,
    place: "left-3 min-[1000px]:bottom-20 min-[1000px]:left-auto min-[1000px]:right-4 min-[1000px]:top-auto",
  },
  {
    id: "cabin",
    label: "Cabin",
    icon: Wind,
    place: "left-3 min-[1000px]:left-auto min-[1000px]:right-4 min-[1000px]:top-16",
  },
]

const statusCopy = {
  overdue: "Overdue",
  due: "Due soon",
  ok: "On track",
  unlogged: "Not logged",
}

function zoneFor(type: string): GarageZone {
  if (
    type === "Engine oil and filter" ||
    type === "Engine air filter" ||
    type === "Spark plugs" ||
    type === "Engine coolant"
  ) {
    return "engine"
  }
  if (type === "Tire rotation") return "wheels"
  if (type === "Brake fluid") return "brakes"
  if (type === "Cabin air filter") return "cabin"
  return "all"
}

function readout(item: ServiceEvaluation) {
  if (item.status === "unlogged") {
    return `Every ${intervalLabel(item.intervalMiles, item.intervalMonths)}`
  }
  const parts: string[] = []
  if (item.milesLeft != null) {
    parts.push(item.milesLeft < 0 ? `${formatMiles(item.milesLeft)} past` : `${formatMiles(item.milesLeft)} left`)
  }
  if (item.daysLeft != null) {
    parts.push(item.daysLeft < 0 ? `${Math.abs(item.daysLeft)} days past` : `${item.daysLeft} days left`)
  }
  return parts.join(" · ") || "Logged"
}

function FitCamera() {
  const camera = useThree((state) => state.camera)
  const controls = useThree((state) => state.controls)
  const gl = useThree((state) => state.gl)
  useEffect(() => {
    const fit = () => {
      const narrow = window.innerWidth < 1000
      const portrait = narrow && window.innerHeight > window.innerWidth
      const short = narrow && window.innerHeight < 520
      camera.position.set(
        portrait ? 0.1 : short ? 6.2 : 5.6,
        portrait ? 1.75 : short ? 2.05 : 1.9,
        portrait ? 8.1 : short ? 8.4 : 6.8
      )
      if ("fov" in camera) {
        camera.fov = portrait ? 37 : short ? 38 : 34
        camera.updateProjectionMatrix()
      }
      const orbit = controls as {
        target?: { set?: (x: number, y: number, z: number) => void }
        enabled?: boolean
        update?: () => void
      } | null
      if (orbit?.target?.set) {
        orbit.target.set(0, portrait ? 0.5 : 0.65, 0)
        orbit.enabled = !portrait
        orbit.update?.()
      }
      gl.domElement.style.touchAction = portrait ? "pan-y" : "none"
      gl.domElement.style.pointerEvents = portrait ? "none" : "auto"
    }
    fit()
    window.addEventListener("resize", fit)
    return () => window.removeEventListener("resize", fit)
  }, [camera, controls, gl])
  return null
}

function GarageRoom() {
  return (
    <>
      <color attach="background" args={["#07080c"]} />
      <fog attach="fog" args={["#07080c", 9, 18]} />
      <hemisphereLight args={["#f7f8ff", "#2a2d33", 1.6]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 6]} intensity={4.5} />
      <directionalLight position={[-5, 4, -3]} intensity={2} color="#c9d6ff" />
      <spotLight position={[0, 5.5, 2]} angle={0.6} penumbra={0.65} intensity={120} color="#fff6e8" />

      <Suspense fallback={null}>
        <K5Model />
      </Suspense>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#14161b" roughness={0.95} metalness={0.04} />
      </mesh>
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={5}
        maxDistance={12}
        minPolarAngle={0.85}
        maxPolarAngle={1.45}
        target={[0, 0.65, 0]}
      />
    </>
  )
}

export default function Showroom({
  logs,
  records,
  odometer,
  mode,
  loan,
  onLog,
  onLoan,
}: {
  logs: MaintenanceLog[]
  records: MaintenanceLog[]
  odometer: number | null
  mode: ScheduleMode
  loan: CarLoan
  onLog: () => void
  onLoan: () => void
}) {
  const [zone, setZone] = useState<GarageZone>("all")
  const { active, progress, errors } = useProgress()
  const modelReady = (!active && progress >= 100) || errors.length > 0
  const schedule = useMemo(
    () => evaluateSchedule(logs, odometer, mode),
    [logs, odometer, mode]
  )
  const selected = zones.find((item) => item.id === zone) ?? zones[0]
  const items = schedule.filter((entry) => zone === "all" || zoneFor(entry.item.name) === zone)
  const spent = totalSpend(records)
  const tires = tireStatus(records)
  const battery = batteryStatus(records)
  const registration = lastRegistration(records)
  const registrationDate = registration
    ? (parseServiceDate(registration.when) ?? dayjs(registration.when)).format("MMM D, YYYY")
    : null
  const recent = useMemo(() => {
    return [...records]
      .sort((a, b) => {
        const aTime = parseServiceDate(a.datedone)?.valueOf() ?? dayjs(a.date).valueOf()
        const bTime = parseServiceDate(b.datedone)?.valueOf() ?? dayjs(b.date).valueOf()
        return bTime - aTime
      })
      .slice(0, 4)
  }, [records])
  const scrollerRef = useRef<HTMLElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scroller = scrollerRef.current
    const sheet = sheetRef.current
    const hint = hintRef.current
    if (!scroller || !sheet || !hint) return
    let frame = 0
    const update = () => {
      frame = 0
      const portrait = window.innerWidth < 1000 && window.innerHeight > window.innerWidth
      if (!portrait) {
        sheet.style.transform = ""
        sheet.style.opacity = ""
        hint.style.opacity = ""
        return
      }
      const distance = Math.max(scroller.clientHeight * 0.2, 1)
      const progress = Math.min(1, Math.max(0, scroller.scrollTop / distance))
      const eased = 1 - Math.pow(1 - progress, 3)
      sheet.style.transform = `translate3d(0, ${(1 - eased) * 16}px, 0)`
      sheet.style.opacity = "1"
      hint.style.opacity = String(1 - eased)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    scroller.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      scroller.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <section
      ref={scrollerRef}
      className="garage-scroll relative h-svh overflow-hidden bg-black text-white max-[999px]:portrait:overflow-y-auto max-[999px]:portrait:overscroll-y-contain"
    >
      <div className="garage-hero relative z-0 h-full max-[999px]:portrait:sticky max-[999px]:portrait:top-0 max-[999px]:portrait:h-svh">
      <Canvas
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: modelReady ? 1 : 0.22,
          transition: "opacity 0.9s ease",
        }}
        dpr={1}
        camera={{ position: [5.6, 1.9, 6.8], fov: 34 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.45
          gl.domElement.setAttribute("aria-hidden", "true")
          gl.domElement.setAttribute("role", "presentation")
        }}
      >
        <GarageRoom />
        <FitCamera />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 bg-gradient-to-b from-black via-black/80 to-transparent p-3 pb-4 pt-[max(0.75rem,env(safe-area-inset-top))] min-[1000px]:p-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">Garage</p>
          <p className="text-sm text-white/80">
            {modelReady ? "Kia K5 · Wolf Gray" : "Opening the K5"}
          </p>
        </div>
        <button
          type="button"
          onClick={onLog}
          className="pointer-events-auto rounded-full border border-white/20 bg-black/50 px-4 py-1.5 text-xs text-white/90"
        >
          Log service
        </button>
      </div>

      <ModelLoader active={active} progress={progress} hold={!modelReady} />

      <div
        ref={hintRef}
        className="pointer-events-none absolute inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 hidden flex-col items-center gap-1 max-[999px]:portrait:flex"
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/55">Overview</p>
        <ChevronDown className="h-4 w-4 text-white/70" />
      </div>

      <div
        className={`pointer-events-auto absolute z-10 flex flex-col gap-2 overflow-y-auto overscroll-contain pr-1 max-[999px]:portrait:hidden max-[999px]:bottom-[calc(14.75rem+env(safe-area-inset-bottom))] max-[999px]:left-3 max-[999px]:right-3 max-[999px]:top-auto max-[999px]:max-h-[min(13.25rem,32svh)] max-[999px]:w-auto max-[999px]:landscape:bottom-auto max-[999px]:landscape:right-auto max-[999px]:landscape:top-[calc(4.15rem+env(safe-area-inset-top))] max-[999px]:landscape:w-52 max-[999px]:landscape:max-h-[calc(100svh-13.75rem-env(safe-area-inset-bottom))] min-[1000px]:max-h-none min-[1000px]:w-64 min-[1000px]:gap-5 min-[1000px]:overflow-visible ${selected.place}`}
      >
        <Reveal ready={modelReady} delay={40} className="shrink-0">
        <aside className="pointer-events-auto shrink-0 overflow-x-hidden overflow-y-auto rounded-lg border border-white/15 bg-black/85 p-3 max-[999px]:max-h-[5rem] max-[999px]:landscape:max-h-[4.5rem] min-[1000px]:max-h-[46vh] min-[1000px]:bg-black/70 min-[1000px]:p-4 min-[1000px]:backdrop-blur-sm">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">{selected.label}</p>
          <p className="mt-1 text-xs text-white/55">
            {odometer == null ? "Mileage not set" : `${odometer.toLocaleString()} mi`}
          </p>
          <ul className="mt-3 space-y-3">
            {items.length === 0 ? (
              <li className="text-sm text-white/50">Nothing logged for this area yet.</li>
            ) : (
              items.map((entry) => (
                <li key={entry.item.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm">{entry.item.name}</p>
                    <p className="shrink-0 text-[11px] uppercase tracking-wide text-white/45">
                      {statusCopy[entry.status]}
                    </p>
                  </div>
                  <p className="text-xs text-white/55">{readout(entry)}</p>
                  {entry.last ? (
                    <p className="text-xs text-white/40">
                      Last {(parseServiceDate(entry.last.datedone) ?? dayjs(entry.last.date)).format("MMM D, YYYY")}
                      {entry.last.mileage != null ? ` · ${entry.last.mileage.toLocaleString()} mi` : ""}
                    </p>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </aside>
        </Reveal>
        {zone === "all" && recent.length > 0 ? (
          <Reveal ready={modelReady} delay={140}>
          <div className="pointer-events-none [text-shadow:0_1px_3px_rgba(0,0,0,0.95)]">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">Last logs</p>
            <ul className="mt-1.5 space-y-1.5 min-[1000px]:mt-2 min-[1000px]:space-y-2">
              {recent.map((entry) => {
                const miles = recordedMiles(entry)
                return (
                  <li
                    key={entry.id}
                    className="max-[999px]:portrait:flex max-[999px]:portrait:items-baseline max-[999px]:portrait:justify-between max-[999px]:portrait:gap-3"
                  >
                    <p className="text-sm text-white/90 max-[999px]:portrait:truncate">{entry.type.trim()}</p>
                    <p className="text-xs text-white/70 max-[999px]:portrait:shrink-0">
                      {(parseServiceDate(entry.datedone) ?? dayjs(entry.date)).format("MMM D, YYYY")}
                      {miles != null ? ` · ${miles.toLocaleString()} mi` : ""}
                    </p>
                  </li>
                )
              })}
            </ul>
          </div>
          </Reveal>
        ) : null}
      </div>

      <div className="pointer-events-auto absolute inset-x-0 bottom-[calc(2.9rem+env(safe-area-inset-bottom))] z-10 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] max-[999px]:portrait:hidden min-[1000px]:justify-center [&::-webkit-scrollbar]:hidden">
        <Reveal ready={modelReady} className="shrink-0">
        <div className="w-[8.75rem] shrink-0 rounded-lg border border-white/15 bg-black/80 p-2.5 landscape:w-32 landscape:p-2 max-[999px]:portrait:w-auto max-[999px]:portrait:min-w-0 max-[999px]:portrait:p-2 min-[1000px]:w-36 min-[1000px]:bg-black/70 min-[1000px]:p-3 min-[1000px]:backdrop-blur-sm">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">Spent</p>
          <p className="mt-1 text-lg font-medium">{formatMoney(spent)}</p>
        </div>
        </Reveal>
        <Reveal ready={modelReady} delay={70} className="shrink-0">
          <LoanCard loan={loan} onOpen={onLoan} />
        </Reveal>
        <WearCard part={tires} delay={140} ready={modelReady} />
        <WearCard part={battery} delay={210} ready={modelReady} />
        <Reveal ready={modelReady} delay={280} className="shrink-0">
        <div className="w-[8.75rem] shrink-0 rounded-lg border border-white/15 bg-black/80 p-2.5 landscape:w-32 landscape:p-2 max-[999px]:portrait:w-auto max-[999px]:portrait:min-w-0 max-[999px]:portrait:p-2 min-[1000px]:w-40 min-[1000px]:bg-black/70 min-[1000px]:p-3 min-[1000px]:backdrop-blur-sm">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">Registration</p>
          <p className="mt-1 text-sm leading-snug">{registrationDate ?? "Not logged"}</p>
          {registration?.mileage != null ? (
            <p className="mt-1 text-[11px] text-white/45">{registration.mileage.toLocaleString()} mi</p>
          ) : null}
        </div>
        </Reveal>
      </div>

      <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 flex gap-1.5 overflow-x-auto px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-1 [scrollbar-width:none] max-[999px]:portrait:hidden min-[1000px]:justify-center min-[1000px]:pb-4 [&::-webkit-scrollbar]:hidden">
        {zones.map((item) => {
          const Icon = item.icon
          const activeZone = zone === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setZone(item.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] max-[999px]:portrait:w-full max-[999px]:portrait:flex-col max-[999px]:portrait:gap-0.5 max-[999px]:portrait:px-0.5 max-[999px]:portrait:py-1.5 max-[999px]:portrait:text-[10px] min-[1000px]:px-3 min-[1000px]:py-1.5 min-[1000px]:text-xs ${
                activeZone
                  ? "border-white bg-white text-black"
                  : "border-white/20 bg-black/50 text-white/80"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          )
        })}
      </div>
      </div>

      <div className="relative z-20 hidden max-[999px]:portrait:block">
        <div
          ref={sheetRef}
          className="rounded-t-[1.75rem] border border-b-0 border-white/10 bg-zinc-950 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-28px_50px_rgba(0,0,0,0.55)]"
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/25" />
          <div className="grid grid-cols-5 gap-1">
            {zones.map((item) => {
              const Icon = item.icon
              const activeZone = zone === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setZone(item.id)}
                  className={`flex flex-col items-center gap-0.5 rounded-2xl border px-1 py-2 text-[10px] ${
                    activeZone ? "border-white bg-white text-black" : "border-white/15 bg-white/5 text-white/80"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              )
            })}
          </div>

          <Reveal ready={modelReady} delay={40} immediate>
          <aside className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">{selected.label}</p>
            <p className="mt-1 text-xs text-white/55">
              {odometer == null ? "Mileage not set" : `${odometer.toLocaleString()} mi`}
            </p>
            <ul className="mt-3 space-y-3">
              {items.length === 0 ? (
                <li className="text-sm text-white/50">Nothing logged for this area yet.</li>
              ) : (
                items.map((entry) => (
                  <li key={entry.item.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm">{entry.item.name}</p>
                      <p className="shrink-0 text-[11px] uppercase tracking-wide text-white/45">
                        {statusCopy[entry.status]}
                      </p>
                    </div>
                    <p className="text-xs text-white/55">{readout(entry)}</p>
                    {entry.last ? (
                      <p className="text-xs text-white/40">
                        Last {(parseServiceDate(entry.last.datedone) ?? dayjs(entry.last.date)).format("MMM D, YYYY")}
                        {entry.last.mileage != null ? ` · ${entry.last.mileage.toLocaleString()} mi` : ""}
                      </p>
                    ) : null}
                  </li>
                ))
              )}
            </ul>
          </aside>
          </Reveal>

          {zone === "all" && recent.length > 0 ? (
            <Reveal ready={modelReady} delay={120} immediate>
            <div className="mt-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/45">Last logs</p>
              <ul className="mt-2 space-y-2">
                {recent.map((entry) => {
                  const miles = recordedMiles(entry)
                  return (
                    <li key={entry.id}>
                      <p className="text-sm text-white/90">{entry.type.trim()}</p>
                      <p className="text-xs text-white/45">
                        {(parseServiceDate(entry.datedone) ?? dayjs(entry.date)).format("MMM D, YYYY")}
                        {miles != null ? ` · ${miles.toLocaleString()} mi` : ""}
                      </p>
                    </li>
                  )
                })}
              </ul>
            </div>
            </Reveal>
          ) : null}

          <div className="mt-5 grid grid-cols-2 gap-2">
            <Reveal ready={modelReady} immediate>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">Spent</p>
              <p className="mt-1 text-lg font-medium">{formatMoney(spent)}</p>
            </div>
            </Reveal>
            <WearCard part={tires} delay={80} ready={modelReady} immediate />
            <WearCard part={battery} delay={140} ready={modelReady} immediate />
            <Reveal ready={modelReady} delay={200} immediate>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">Registration</p>
              <p className="mt-1 text-sm leading-snug">{registrationDate ?? "Not logged"}</p>
              {registration?.mileage != null ? (
                <p className="mt-1 text-[11px] text-white/45">{registration.mileage.toLocaleString()} mi</p>
              ) : null}
            </div>
            </Reveal>
          </div>
          <LoanSheet loan={loan} onOpen={onLoan} ready={modelReady} immediate />
        </div>
      </div>
    </section>
  )
}

function ModelLoader({ active, progress, hold }: { active: boolean; progress: number; hold: boolean }) {
  const [visible, setVisible] = useState(hold)
  useEffect(() => {
    if (hold) {
      setVisible(true)
      return
    }
    const id = window.setTimeout(() => setVisible(false), 720)
    return () => window.clearTimeout(id)
  }, [hold])
  if (!visible) return null
  const radius = 46
  const length = 2 * Math.PI * radius
  const offset = length * (1 - Math.min(100, Math.max(0, progress)) / 100)
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[25] flex items-center justify-center transition-opacity duration-700 ${
        hold ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="relative h-28 w-28">
          <div
            className="absolute inset-3 animate-spin rounded-full border border-white/10 border-t-white/55 motion-reduce:animate-none"
            style={{ animationDuration: "1.8s" }}
          />
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={length}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.35s ease" }}
            />
          </svg>
          <p className="absolute inset-0 flex items-center justify-center text-sm tabular-nums text-white/90">
            {Math.round(progress)}%
          </p>
        </div>
        <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white/65">
          {active || progress < 100 ? "Opening the K5" : "Kia K5"}
        </p>
      </div>
    </div>
  )
}

function WearCard({
  part,
  delay = 0,
  ready = true,
  immediate = false,
}: {
  part: { name: string; life: number | null; replaced: boolean; when: string | null; mileage: number | null }
  delay?: number
  ready?: boolean
  immediate?: boolean
}) {
  const reveal = useReveal<HTMLDivElement>(delay, ready, immediate)
  const when = part.when ? (parseServiceDate(part.when) ?? dayjs(part.when)).format("MMM D, YYYY") : null
  const life = part.life ?? (part.replaced ? 100 : null)
  return (
    <div
      ref={reveal.ref}
      className={`w-[8.75rem] shrink-0 rounded-lg border border-white/15 bg-black/80 p-2.5 landscape:w-32 landscape:p-2 max-[999px]:portrait:w-full max-[999px]:portrait:min-w-0 max-[999px]:portrait:rounded-2xl max-[999px]:portrait:border-white/10 max-[999px]:portrait:bg-white/5 max-[999px]:portrait:p-3 min-[1000px]:w-40 min-[1000px]:bg-black/70 min-[1000px]:p-3 min-[1000px]:backdrop-blur-sm ${reveal.className}`}
      style={reveal.style}
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">{part.name}</p>
      {life == null && !part.replaced ? (
        <p className="mt-1 text-sm text-white/70">Not logged</p>
      ) : (
        <>
          <p className="mt-1 text-sm">
            {part.replaced ? "New" : "In service"}
            {life != null ? ` · ${life}% life` : ""}
          </p>
          {life != null ? <LifeFill value={life} play={reveal.shown} /> : null}
          {when ? (
            <p className="mt-1 text-[11px] leading-snug text-white/45">
              {when}
              {part.mileage != null ? ` · ${part.mileage.toLocaleString()} mi` : ""}
            </p>
          ) : null}
        </>
      )}
    </div>
  )
}

"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import dayjs from "dayjs"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { formatMoney, highestReading, productSuggestions, raisedOdometer, recordedMiles, scheduleLogs } from "@/lib/garage-logs"
import { GarageSignIn, resumeGoogleSignIn } from "@/components/garage/sign-in"
import { LoanPanel } from "@/components/garage/loan-panel"
import { AlertsPanel } from "@/components/garage/alerts"
import { InsurancePanel, RegistrationPanel } from "@/components/garage/coverage"
import { registrationView } from "@/lib/coverage"
import { RecallPanel } from "@/components/garage/recalls"
import { starterLoan, type CarLoan } from "@/lib/loan"
import type { GarageRecall, RecallStatus } from "@/lib/recalls"
import {
  k5,
  k5Schedule,
  parseServiceDate,
  type MaintenanceLog,
  type ScheduleMode,
} from "@/lib/k5"

const Showroom = dynamic(() => import("@/components/garage/showroom"), {
  ssr: false,
  loading: () => (
    <div className="garage-wait flex h-dvh items-center justify-center bg-black text-sm text-white/60">
      Opening garage
    </div>
  ),
})

type Vehicle = {
  id: string
  year: number
  odometer: number | null
  drive: string
  transmission: string
  displacement: number
  city_mpg: number | null
  highway_mpg: number | null
  loan: CarLoan
  maintenances: MaintenanceLog[]
}

function optionalLife(value: string) {
  if (value.trim() === "") return null
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 100) return undefined
  return parsed
}

const localVehicle: Vehicle = {
  id: "local",
  year: k5.year,
  odometer: null,
  drive: k5.drive,
  transmission: k5.transmission,
  displacement: k5.displacement,
  city_mpg: k5.city_mpg,
  highway_mpg: k5.highway_mpg,
  loan: starterLoan,
  maintenances: [],
}

export default function GaragePage() {
  const [vehicle, setVehicle] = useState<Vehicle>(localVehicle)
  const [mode, setMode] = useState<ScheduleMode>("normal")
  const [odometer, setOdometer] = useState("")
  const [savingMiles, setSavingMiles] = useState(false)
  const [task, setTask] = useState<string>()
  const [customTask, setCustomTask] = useState("")
  const [serviceDate, setServiceDate] = useState(() => dayjs().format("YYYY-MM-DD"))
  const [mileage, setMileage] = useState("")
  const [notes, setNotes] = useState("")
  const [cost, setCost] = useState("")
  const [products, setProducts] = useState<string[]>([])
  const [productDraft, setProductDraft] = useState("")
  const [tireHealth, setTireHealth] = useState("")
  const [batteryHealth, setBatteryHealth] = useState("")
  const [tiresReplaced, setTiresReplaced] = useState(false)
  const [batteryReplaced, setBatteryReplaced] = useState(false)
  const [savingLog, setSavingLog] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [panelOpen, setPanelOpen] = useState(false)
  const [loanOpen, setLoanOpen] = useState(false)
  const [recallsOpen, setRecallsOpen] = useState(false)
  const [insuranceOpen, setInsuranceOpen] = useState(false)
  const [registrationOpen, setRegistrationOpen] = useState(false)
  const [alertsOpen, setAlertsOpen] = useState(false)
  const [recalls, setRecalls] = useState<GarageRecall[]>([])
  const [recallsLoaded, setRecallsLoaded] = useState(false)
  const [recallsFailed, setRecallsFailed] = useState(false)
  const [recallPending, setRecallPending] = useState<string | null>(null)
  const [signedIn, setSignedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const stored = window.localStorage.getItem("k5-schedule-mode")
    if (stored === "severe" || stored === "normal") setMode(stored)
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch("/api/session").then((response) => {
      if (cancelled) return
      if (response.ok) setSignedIn(true)
      else setSignedIn(false)
    })
    resumeGoogleSignIn().then((ok) => {
      if (!cancelled && ok) setSignedIn(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (signedIn !== true) return
    let cancelled = false
    async function loadGarage() {
      try {
        const response = await fetch("/api/garage")
        if (response.status === 401) {
          if (!cancelled) setSignedIn(false)
          return
        }
        if (!response.ok) {
          toast.error("Could not load saved service records")
          return
        }
        const data = await response.json()
        if (cancelled || !data.vehicle) return
        const loaded = data.vehicle as Vehicle
        const miles = highestReading(loaded.maintenances, loaded.odometer)
        setVehicle({ ...loaded, odometer: miles })
        setOdometer(miles == null ? "" : String(miles))
      } catch {
        if (!cancelled) toast.error("Could not load saved service records")
      }
    }
    loadGarage()
    return () => {
      cancelled = true
    }
  }, [signedIn])

  useEffect(() => {
    if (signedIn !== true) return
    let cancelled = false
    async function loadRecalls() {
      try {
        const response = await fetch("/api/recalls")
        if (response.status === 401) {
          if (!cancelled) setSignedIn(false)
          return
        }
        if (!response.ok) {
          if (!cancelled) setRecallsFailed(true)
          return
        }
        const data = await response.json()
        if (cancelled) return
        setRecalls(Array.isArray(data.recalls) ? data.recalls : [])
        setRecallsLoaded(true)
        setRecallsFailed(false)
      } catch {
        if (!cancelled) setRecallsFailed(true)
      }
    }
    loadRecalls()
    return () => {
      cancelled = true
    }
  }, [signedIn])

  const history = useMemo(() => {
    return [...(vehicle?.maintenances ?? [])].sort((a, b) => {
      const aTime = parseServiceDate(a.datedone)?.valueOf() ?? dayjs(a.date).valueOf()
      const bTime = parseServiceDate(b.datedone)?.valueOf() ?? dayjs(b.date).valueOf()
      return bTime - aTime
    })
  }, [vehicle])

  function changeMode(next: ScheduleMode) {
    setMode(next)
    window.localStorage.setItem("k5-schedule-mode", next)
  }

  async function saveOdometer(event: FormEvent) {
    event.preventDefault()
    const miles = Number(odometer)
    if (odometer.trim() === "" || !Number.isInteger(miles) || miles < 0) {
      toast.error("Enter mileage as a whole number")
      return
    }
    setSavingMiles(true)
    if (vehicle.id !== "local") {
      const response = await fetch("/api/garage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId: vehicle.id, odometer: miles }),
      })
      if (!response.ok) {
        setSavingMiles(false)
        toast.error("Could not save mileage")
        return
      }
    }
    setVehicle((current) => ({ ...current, odometer: miles }))
    setSavingMiles(false)
    toast.success("Mileage saved")
  }

  async function logService(event: FormEvent) {
    event.preventDefault()
    if (!vehicle) return
    const type = task === "Other" ? customTask.trim() : task
    if (!type) {
      toast.error("Choose a service")
      return
    }
    const miles = Number(mileage)
    if (mileage.trim() === "" || !Number.isInteger(miles) || miles < 0) {
      toast.error("Enter the mileage as a whole number")
      return
    }
    let parsedCost: number | null = null
    if (cost.trim() !== "") {
      const amount = Number(cost)
      if (!Number.isFinite(amount) || amount < 0) {
        toast.error("Enter the cost as a dollar amount")
        return
      }
      parsedCost = Math.round(amount * 100) / 100
    }
    const tireLife = optionalLife(tireHealth)
    const batteryLife = optionalLife(batteryHealth)
    if (tireLife === undefined || batteryLife === undefined) {
      toast.error("Life must be a whole number from 0 to 100")
      return
    }
    const chosenProducts = productDraft.trim()
      ? [...products, productDraft.trim()]
      : products

    setSavingLog(true)
    let entryId = crypto.randomUUID()
    if (vehicle.id !== "local") {
      const response = await fetch("/api/addMaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          description: notes || null,
          datedone: serviceDate,
          vehicleId: vehicle.id,
          mileage: miles,
          cost: parsedCost,
          products: chosenProducts,
          tireHealth: tireLife,
          batteryHealth: batteryLife,
          tiresReplaced,
          batteryReplaced,
        }),
      })
      if (!response.ok) {
        setSavingLog(false)
        toast.error("Could not save that service")
        return
      }
      const saved = await response.json()
      if (saved.maintenance?.id) entryId = saved.maintenance.id
    }
    const entry: MaintenanceLog = {
      id: entryId,
      type,
      description: notes || null,
      datedone: serviceDate,
      date: new Date().toISOString(),
      mileage: miles,
      cost: parsedCost,
      products: chosenProducts,
      tireHealth: tireLife,
      batteryHealth: batteryLife,
      tiresReplaced,
      batteryReplaced,
    }
    const nextMiles = raisedOdometer(highestReading(vehicle.maintenances, vehicle.odometer), miles)
    setVehicle((current) => ({
      ...current,
      odometer: nextMiles,
      maintenances: [entry, ...current.maintenances],
    }))
    setOdometer(nextMiles == null ? "" : String(nextMiles))
    setFormKey((key) => key + 1)
    setTask(undefined)
    setCustomTask("")
    setNotes("")
    setMileage("")
    setCost("")
    setProducts([])
    setProductDraft("")
    setTireHealth("")
    setBatteryHealth("")
    setTiresReplaced(false)
    setBatteryReplaced(false)
    setSavingLog(false)
    setPanelOpen(false)
    toast.success("Service logged")
  }

  async function deleteLog(id: string) {
    if (vehicle.id !== "local") {
      const response = await fetch("/api/removeMaint", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maintenanceId: id }),
      })
      if (!response.ok) {
        toast.error("Could not remove that entry")
        return
      }
    }
    setVehicle((current) => ({
      ...current,
      maintenances: current.maintenances.filter((entry) => entry.id !== id),
    }))
    toast.success("Entry removed")
  }

  async function saveRecall(campaign: string, status: RecallStatus) {
    if (vehicle.id === "local") return
    setRecallPending(campaign)
    const response = await fetch("/api/recalls", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleId: vehicle.id, campaign, status }),
    })
    const body = await response.json().catch(() => null)
    setRecallPending(null)
    if (!response.ok || !Array.isArray(body?.recalls)) {
      toast.error(body?.error || "Could not save that recall")
      return
    }
    setRecalls(body.recalls)
    setRecallsLoaded(true)
  }

  async function signOut() {
    await fetch("/api/session", { method: "DELETE" })
    setVehicle(localVehicle)
    setOdometer("")
    setPanelOpen(false)
    setLoanOpen(false)
    setRecallsOpen(false)
    setInsuranceOpen(false)
    setRegistrationOpen(false)
    setAlertsOpen(false)
    setRecalls([])
    setRecallsLoaded(false)
    setRecallsFailed(false)
    setSignedIn(false)
  }

  if (signedIn === null) {
    return (
      <div className="garage-wait flex h-dvh items-center justify-center bg-black text-sm text-white/60">
        Opening garage
      </div>
    )
  }

  if (!signedIn) {
    return <GarageSignIn onSignedIn={() => setSignedIn(true)} />
  }

  return (
    <div className="garage-shell h-svh overflow-hidden bg-black text-white">
      <Showroom
        logs={scheduleLogs(vehicle.maintenances)}
        records={vehicle.maintenances}
        odometer={vehicle.odometer}
        mode={mode}
        loan={vehicle.loan}
        recalls={recalls}
        recallsLoaded={recallsLoaded}
        recallsFailed={recallsFailed}
        recallPending={recallPending}
        onLog={() => {
          setLoanOpen(false)
          setRecallsOpen(false)
          setInsuranceOpen(false)
          setRegistrationOpen(false)
          setAlertsOpen(false)
          setPanelOpen(true)
        }}
        onLoan={() => {
          setPanelOpen(false)
          setRecallsOpen(false)
          setInsuranceOpen(false)
          setRegistrationOpen(false)
          setAlertsOpen(false)
          setLoanOpen(true)
        }}
        onRecalls={() => {
          setPanelOpen(false)
          setLoanOpen(false)
          setInsuranceOpen(false)
          setRegistrationOpen(false)
          setAlertsOpen(false)
          setRecallsOpen(true)
        }}
        onInsurance={() => {
          setPanelOpen(false)
          setLoanOpen(false)
          setRecallsOpen(false)
          setRegistrationOpen(false)
          setAlertsOpen(false)
          setInsuranceOpen(true)
        }}
        onRegistration={() => {
          setPanelOpen(false)
          setLoanOpen(false)
          setRecallsOpen(false)
          setInsuranceOpen(false)
          setAlertsOpen(false)
          setRegistrationOpen(true)
        }}
        onAlerts={() => {
          setPanelOpen(false)
          setLoanOpen(false)
          setRecallsOpen(false)
          setInsuranceOpen(false)
          setRegistrationOpen(false)
          setAlertsOpen(true)
        }}
        onRecallStatus={saveRecall}
      />

      {recallsOpen && (
        <RecallPanel
          recalls={recalls}
          loaded={recallsLoaded}
          failed={recallsFailed}
          pending={recallPending}
          onStatus={saveRecall}
          onClose={() => setRecallsOpen(false)}
        />
      )}

      {alertsOpen && <AlertsPanel loan={vehicle.loan} onClose={() => setAlertsOpen(false)} />}

      {insuranceOpen && <InsurancePanel onClose={() => setInsuranceOpen(false)} />}

      {registrationOpen && (
        <RegistrationPanel
          registration={registrationView(vehicle.maintenances)}
          onClose={() => setRegistrationOpen(false)}
        />
      )}

      {loanOpen && (
        <LoanPanel
          loan={vehicle.loan}
          vehicleId={vehicle.id}
          onChange={(loan) => setVehicle((current) => ({ ...current, loan }))}
          onClose={() => setLoanOpen(false)}
        />
      )}

      {panelOpen && (
        <div className="fixed inset-0 z-30 flex justify-end overflow-x-hidden bg-black/40">
          <button
            type="button"
            aria-label="Close log"
            className="hidden h-full min-w-0 flex-1 max-[999px]:landscape:block min-[1000px]:block"
            onClick={() => setPanelOpen(false)}
          />
          <aside className="h-dvh w-full min-w-0 max-w-full overflow-x-hidden overflow-y-auto border-white/10 bg-zinc-950 p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] max-[999px]:landscape:max-w-[min(24rem,62vw)] max-[999px]:landscape:border-l min-[1000px]:max-w-md min-[1000px]:border-l min-[1000px]:p-5">
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">
                  Log
                </p>
                <h2 className="text-lg font-semibold">Service intake</h2>
                <p className="text-xs text-white/50">
                  {vehicle.year} · {k5.engine} · {vehicle.drive}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Sign out
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setPanelOpen(false)}>
                  Close
                </Button>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={mode === "normal" ? "default" : "outline"}
                onClick={() => changeMode("normal")}
              >
                Normal
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mode === "severe" ? "default" : "outline"}
                onClick={() => changeMode("severe")}
              >
                Severe
              </Button>
            </div>

            <form className="mt-6 flex min-w-0 items-end gap-2" onSubmit={saveOdometer}>
              <div className="min-w-0 flex-1 space-y-2">
                <Label htmlFor="odometer">Current miles</Label>
                <Input
                  id="odometer"
                  inputMode="numeric"
                  value={odometer}
                  onChange={(event) => setOdometer(event.target.value)}
                  placeholder="45200"
                />
              </div>
              <Button type="submit" className="shrink-0" disabled={savingMiles}>
                Save
              </Button>
            </form>

            <form className="mt-6 space-y-4" onSubmit={logService}>
              <div className="space-y-2">
                <Label>Service</Label>
                <Select key={formKey} value={task} onValueChange={setTask}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {k5Schedule.map((item) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="Battery">Battery</SelectItem>
                    <SelectItem value="Tires">Tires</SelectItem>
                    <SelectItem value="Registration">Registration</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {task === "Other" && (
                <div className="space-y-2">
                  <Label htmlFor="custom-task">What was it</Label>
                  <Input
                    id="custom-task"
                    value={customTask}
                    onChange={(event) => setCustomTask(event.target.value)}
                    placeholder="Wiper blades"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="service-date">Date</Label>
                <Input
                  id="service-date"
                  type="date"
                  value={serviceDate}
                  onChange={(event) => setServiceDate(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-miles">Mileage</Label>
                <Input
                  id="service-miles"
                  inputMode="numeric"
                  value={mileage}
                  onChange={(event) => setMileage(event.target.value)}
                  placeholder="45200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-cost">Cost</Label>
                <Input
                  id="service-cost"
                  inputMode="decimal"
                  value={cost}
                  onChange={(event) => setCost(event.target.value)}
                  placeholder="85.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-draft">Products bought</Label>
                <div className="flex flex-wrap gap-2">
                  {productSuggestions(vehicle.maintenances).map((product) => {
                    const selected = products.includes(product)
                    return (
                      <button
                        key={product}
                        type="button"
                        onClick={() =>
                          setProducts((current) =>
                            current.includes(product)
                              ? current.filter((item) => item !== product)
                              : [...current, product]
                          )
                        }
                        className={`max-w-full break-words rounded-full border px-2.5 py-1 text-left text-xs ${
                          selected ? "border-white bg-white text-black" : "border-white/20 text-white/75"
                        }`}
                      >
                        {product}
                      </button>
                    )
                  })}
                </div>
                <div className="flex min-w-0 gap-2">
                  <Input
                    id="product-draft"
                    value={productDraft}
                    onChange={(event) => setProductDraft(event.target.value)}
                    placeholder="Add a product"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0"
                    onClick={() => {
                      const name = productDraft.trim()
                      if (!name) return
                      setProducts((current) => (current.includes(name) ? current : [...current, name]))
                      setProductDraft("")
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tire-life">Tire life %</Label>
                  <Input
                    id="tire-life"
                    inputMode="numeric"
                    value={tireHealth}
                    onChange={(event) => setTireHealth(event.target.value)}
                    placeholder="60"
                  />
                  <label className="flex items-center gap-2 text-xs text-white/70">
                    <input
                      type="checkbox"
                      checked={tiresReplaced}
                      onChange={(event) => setTiresReplaced(event.target.checked)}
                    />
                    New tires
                  </label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="battery-life">Battery life %</Label>
                  <Input
                    id="battery-life"
                    inputMode="numeric"
                    value={batteryHealth}
                    onChange={(event) => setBatteryHealth(event.target.value)}
                    placeholder="100"
                  />
                  <label className="flex items-center gap-2 text-xs text-white/70">
                    <input
                      type="checkbox"
                      checked={batteryReplaced}
                      onChange={(event) => setBatteryReplaced(event.target.checked)}
                    />
                    New battery
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  maxLength={200}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Shop, oil brand, anything you want to remember"
                />
              </div>
              <Button type="submit" disabled={savingLog}>
                {savingLog ? "Saving" : "Save service"}
              </Button>
            </form>

            <div className="mt-8 border-t border-white/10 pt-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">
                History
              </p>
              <ul className="mt-3 space-y-3">
                {history.length === 0 ? (
                  <li className="text-sm text-white/50">Nothing logged yet.</li>
                ) : (
                  history.map((entry) => (
                    <li key={entry.id} className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-words text-sm">{entry.type}</p>
                        <p className="text-xs text-white/50">
                          {(parseServiceDate(entry.datedone) ?? dayjs(entry.date)).format("MMM D, YYYY")}
                          {recordedMiles(entry) != null
                            ? ` · ${recordedMiles(entry)!.toLocaleString()} mi`
                            : ""}
                          {entry.cost != null ? ` · ${formatMoney(entry.cost)}` : ""}
                        </p>
                        {entry.products && entry.products.length > 0 ? (
                          <p className="break-words text-xs text-white/45">{entry.products.join(" · ")}</p>
                        ) : null}
                        {entry.description ? (
                          <p className="break-words text-xs text-white/40">{entry.description}</p>
                        ) : null}
                        <CostField
                          entry={entry}
                          onSaved={(id, amount) =>
                            setVehicle((current) => ({
                              ...current,
                              maintenances: current.maintenances.map((item) =>
                                item.id === id ? { ...item, cost: amount } : item
                              ),
                            }))
                          }
                        />
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => deleteLog(entry.id)}>
                        Delete
                      </Button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

function CostField({
  entry,
  onSaved,
}: {
  entry: MaintenanceLog
  onSaved: (id: string, cost: number) => void
}) {
  const [value, setValue] = useState(entry.cost == null ? "" : String(entry.cost))
  const [saving, setSaving] = useState(false)

  async function save(event: FormEvent) {
    event.preventDefault()
    const amount = Number(value)
    if (value.trim() === "" || !Number.isFinite(amount) || amount < 0) {
      toast.error("Enter the cost as a dollar amount")
      return
    }
    const cost = Math.round(amount * 100) / 100
    setSaving(true)
    const response = await fetch("/api/addMaint", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maintenanceId: entry.id, cost }),
    })
    setSaving(false)
    if (!response.ok) {
      toast.error("Could not update that cost")
      return
    }
    onSaved(entry.id, cost)
    toast.success("Cost saved")
  }

  return (
    <form className="mt-2 flex min-w-0 items-center gap-2" onSubmit={save}>
      <Input
        aria-label={`Cost for ${entry.type}`}
        inputMode="decimal"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="0.00"
      />
      <Button type="submit" size="sm" variant="outline" className="shrink-0" disabled={saving}>
        {saving ? "Saving" : "Save"}
      </Button>
    </form>
  )
}

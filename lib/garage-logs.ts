import { parseServiceDate, type MaintenanceLog } from "@/lib/k5"
import dayjs from "dayjs"

export function serviceMiles(description: string | null) {
  if (!description) return null
  const currentAt = description.match(/currently at\s*(\d{1,3}(?:,\d{3})+|\d{4,6})/i)
  if (currentAt) return Number(currentAt[1].replace(/,/g, ""))
  const current = description.replace(/\bnext\b[\s\S]*$/i, "")
  const match = current.match(/(\d{1,3}(?:,\d{3})+|\d{4,6})/)
  if (!match) return null
  const miles = Number(match[1].replace(/,/g, ""))
  return Number.isInteger(miles) ? miles : null
}

export function recordedMiles(log: MaintenanceLog) {
  return log.mileage ?? serviceMiles(log.description)
}

export function highestReading(logs: MaintenanceLog[], odometer: number | null) {
  const values = logs
    .map(recordedMiles)
    .filter((miles): miles is number => miles != null)
  if (odometer != null) values.push(odometer)
  if (values.length === 0) return null
  return Math.max(...values)
}

export function raisedOdometer(current: number | null, incoming: number | null) {
  if (incoming == null) return current
  if (current == null || incoming > current) return incoming
  return current
}

export function scheduleLogs(logs: MaintenanceLog[]) {
  const mapped: MaintenanceLog[] = []
  for (const log of logs) {
    const description = log.description ?? ""
    const text = `${log.type} ${description}`
    if (!/oil change/i.test(text) && log.type !== "Engine oil and filter") continue
    const mileage = recordedMiles(log)
    mapped.push({ ...log, type: "Engine oil and filter", mileage })
    if (/cabin/i.test(description)) {
      mapped.push({
        ...log,
        id: `${log.id}-cabin`,
        type: "Cabin air filter",
        mileage,
        description: null,
      })
    }
    if (/air\s*&\s*cabin|engine air|air filter/i.test(description)) {
      mapped.push({
        ...log,
        id: `${log.id}-air`,
        type: "Engine air filter",
        mileage,
        description: null,
      })
    }
  }
  for (const log of logs) {
    const text = `${log.type} ${log.description ?? ""}`
    const rotation =
      log.type === "Tire rotation" || Boolean(log.tiresReplaced) || /new tires|tire rotation/i.test(text)
    if (!rotation) continue
    mapped.push({
      ...log,
      id: log.type === "Tire rotation" ? log.id : `${log.id}-rotation`,
      type: "Tire rotation",
      mileage: recordedMiles(log),
    })
  }
  return mapped
}

export function formatMoney(amount: number) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" })
}

export function totalSpend(logs: MaintenanceLog[]) {
  return logs.reduce((sum, log) => sum + (log.cost != null && log.cost > 0 ? log.cost : 0), 0)
}

export function productSuggestions(logs: MaintenanceLog[]) {
  const items = new Set<string>([
    "5W-30 Mobil 1",
    "Oil filter MGD MGL 10473",
    "Engine air filter",
    "Cabin air filter",
    "Under cover metal plate",
  ])
  for (const log of logs) {
    for (const product of log.products ?? []) {
      const name = product.trim()
      if (name) items.add(name)
    }
    const description = log.description ?? ""
    const filter = description.match(/oil filter:\s*([^\n.]+)/i)
    if (filter) items.add(`Oil filter ${filter[1].trim()}`)
    const oil = description.match(/\bOIL:\s*([^\n.]+)/i)
    if (oil) items.add(oil[1].trim())
    if (/cabin/i.test(description) && /filter/i.test(description)) items.add("Cabin air filter")
    if (/air\s*&\s*cabin|engine air/i.test(description)) items.add("Engine air filter")
    if (/metal plate|under cover/i.test(description)) items.add("Under cover metal plate")
  }
  return [...items]
}

export type WearPart = {
  name: "Tires" | "Battery"
  life: number | null
  replaced: boolean
  when: string | null
  mileage: number | null
}

function logTime(log: MaintenanceLog) {
  return parseServiceDate(log.datedone)?.valueOf() ?? dayjs(log.date).valueOf()
}

function lifePercent(value: number | null | undefined) {
  if (value == null || !Number.isInteger(value) || value < 0 || value > 100) return null
  return value
}

function mentionedLife(text: string, subject: RegExp) {
  const forward = text.match(new RegExp(`${subject.source}[\\s\\S]{0,48}?(\\d{1,3})\\s*%`, "i"))
  if (forward) return lifePercent(Number(forward[1]))
  const backward = text.match(new RegExp(`(\\d{1,3})\\s*%[\\s\\S]{0,48}?${subject.source}`, "i"))
  if (backward) return lifePercent(Number(backward[1]))
  return null
}

function latestWear(
  logs: MaintenanceLog[],
  name: "Tires" | "Battery",
  subject: RegExp,
  health: (log: MaintenanceLog) => number | null | undefined,
  replaced: (log: MaintenanceLog) => boolean | null | undefined
): WearPart {
  const sorted = [...logs].sort((a, b) => logTime(b) - logTime(a))
  for (const log of sorted) {
    const text = `${log.type} ${log.description ?? ""}`
    const recorded = lifePercent(health(log))
    const wasReplaced =
      Boolean(replaced(log)) ||
      new RegExp(`(?:new|replace[d]?)\\s+(?:\\d+\\s+)?${name}`, "i").test(text)
    const fromNote = mentionedLife(text, subject)
    if (recorded == null && !wasReplaced && fromNote == null) continue
    return {
      name,
      life: recorded ?? fromNote,
      replaced: wasReplaced,
      when: log.datedone,
      mileage: recordedMiles(log),
    }
  }
  return { name, life: null, replaced: false, when: null, mileage: null }
}

export function tireStatus(logs: MaintenanceLog[]) {
  return latestWear(logs, "Tires", /tires?/, (log) => log.tireHealth, (log) => log.tiresReplaced)
}

export function batteryStatus(logs: MaintenanceLog[]) {
  return latestWear(logs, "Battery", /batter(?:y|ies)/, (log) => log.batteryHealth, (log) => log.batteryReplaced)
}

export function lastRegistration(logs: MaintenanceLog[]) {
  const match = [...logs]
    .filter((log) => /registration/i.test(`${log.type} ${log.description ?? ""}`))
    .sort((a, b) => logTime(b) - logTime(a))[0]
  if (!match) return null
  return {
    when: match.datedone,
    mileage: recordedMiles(match),
  }
}

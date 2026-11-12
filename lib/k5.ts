import dayjs from "dayjs"

/**
 * Personal Kia K5 profile.
 * Intervals follow the 2021–2024 owner's manual for the 1.6T under normal use.
 * Severe mode only changes the oil interval, which is the one Kia states as
 * 5,000 miles or 6 months. Other severe items are "more frequently" with no
 * single published number, so they stay on the normal interval.
 */
export const k5 = {
  make: "Kia",
  model: "K5",
  year: 2023,
  vin: "5XXG64J25MG063586",
  openRecall: "25V794",
  engine: "1.6L turbo I4",
  oil: "0W-20 full synthetic, about 5.1 qt with filter",
  drive: "FWD",
  transmission: "8-speed automatic",
  fuel_type: "gas",
  cylinders: 4,
  displacement: 1.6,
  city_mpg: 27,
  highway_mpg: 37,
  combination_mpg: 31,
  class: "midsize sedan",
  image: "",
} as const

export type ScheduleMode = "normal" | "severe"

export type ScheduleItem = {
  id: string
  name: string
  miles: number | null
  months: number | null
  severeMiles?: number | null
  severeMonths?: number | null
  note?: string
}

export const k5Schedule: ScheduleItem[] = [
  {
    id: "oil",
    name: "Engine oil and filter",
    miles: 8000,
    months: 12,
    severeMiles: 5000,
    severeMonths: 6,
    note: "0W-20 full synthetic. About 5.1 qt with the filter on the 1.6T.",
  },
  {
    id: "tires",
    name: "Tire rotation",
    miles: 8000,
    months: null,
  },
  {
    id: "cabin-filter",
    name: "Cabin air filter",
    miles: 16000,
    months: 24,
    note: "Inspect it at the in-between 8,000-mile services.",
  },
  {
    id: "engine-filter",
    name: "Engine air filter",
    miles: 24000,
    months: 36,
  },
  {
    id: "brake-fluid",
    name: "Brake fluid",
    miles: 48000,
    months: 48,
    note: "Inspect every 8,000 miles. This row tracks the replacement.",
  },
  {
    id: "spark-plugs",
    name: "Spark plugs",
    miles: 48000,
    months: null,
    note: "Turbo engines, normal use.",
  },
  {
    id: "coolant",
    name: "Engine coolant",
    miles: 120000,
    months: 120,
    note: "After the first replacement, Kia's interval becomes 24,000 miles or 24 months.",
  },
]

export type MaintenanceLog = {
  id: string
  type: string
  description: string | null
  datedone: string
  date: string
  mileage: number | null
  cost?: number | null
  products?: string[]
  tireHealth?: number | null
  batteryHealth?: number | null
  tiresReplaced?: boolean | null
  batteryReplaced?: boolean | null
}

export type ServiceStatus = "overdue" | "due" | "ok" | "unlogged"

export type ServiceEvaluation = {
  item: ScheduleItem
  status: ServiceStatus
  milesLeft: number | null
  daysLeft: number | null
  last: MaintenanceLog | null
  intervalMiles: number | null
  intervalMonths: number | null
}

export function parseServiceDate(value: string) {
  if (!value) return null
  const us = value.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2}|\d{4})$/)
  if (us) {
    const year = us[3].length === 2 ? 2000 + Number(us[3]) : Number(us[3])
    const parsed = dayjs(`${year}-${us[1].padStart(2, "0")}-${us[2].padStart(2, "0")}`)
    return parsed.isValid() ? parsed : null
  }
  const parsed = dayjs(value)
  return parsed.isValid() ? parsed : null
}

function intervalFor(item: ScheduleItem, mode: ScheduleMode, hasPrevious: boolean) {
  if (item.id === "coolant" && hasPrevious) {
    return { miles: 24000, months: 24 }
  }
  if (mode === "severe" && (item.severeMiles || item.severeMonths)) {
    return {
      miles: item.severeMiles ?? null,
      months: item.severeMonths ?? null,
    }
  }
  return { miles: item.miles, months: item.months }
}

export function latestLog(logs: MaintenanceLog[], name: string) {
  return logs
    .filter((log) => log.type === name)
    .sort((a, b) => {
      const aTime = parseServiceDate(a.datedone)?.valueOf() ?? dayjs(a.date).valueOf()
      const bTime = parseServiceDate(b.datedone)?.valueOf() ?? dayjs(b.date).valueOf()
      return bTime - aTime
    })[0]
}

export function evaluateSchedule(
  logs: MaintenanceLog[],
  odometer: number | null,
  mode: ScheduleMode,
  now = dayjs()
): ServiceEvaluation[] {
  return k5Schedule.map((item) => {
    const last = latestLog(logs, item.name) ?? null
    const interval = intervalFor(item, mode, Boolean(last))
    if (!last) {
      return {
        item,
        status: "unlogged",
        milesLeft: null,
        daysLeft: null,
        last: null,
        intervalMiles: interval.miles,
        intervalMonths: interval.months,
      }
    }

    const milesLeft =
      interval.miles != null && odometer != null && last.mileage != null
        ? last.mileage + interval.miles - odometer
        : null

    const lastOn = parseServiceDate(last.datedone) ?? dayjs(last.date)
    const daysLeft =
      interval.months != null && lastOn.isValid()
        ? lastOn.add(interval.months, "month").diff(now, "day")
        : null

    let status: ServiceStatus = "ok"
    const overdue =
      (milesLeft != null && milesLeft < 0) || (daysLeft != null && daysLeft < 0)
    const dueSoon =
      (milesLeft != null && milesLeft <= 1000) || (daysLeft != null && daysLeft <= 45)

    if (overdue) status = "overdue"
    else if (dueSoon) status = "due"

    return {
      item,
      status,
      milesLeft,
      daysLeft,
      last,
      intervalMiles: interval.miles,
      intervalMonths: interval.months,
    }
  })
}

export function formatMiles(miles: number) {
  return `${Math.abs(miles).toLocaleString()} mi`
}

export function intervalLabel(miles: number | null, months: number | null) {
  const parts = []
  if (miles != null) parts.push(`${miles.toLocaleString()} mi`)
  if (months != null) parts.push(`${months} mo`)
  return parts.join(" or ")
}

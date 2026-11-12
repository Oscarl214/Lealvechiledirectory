import dayjs from "dayjs"
import { parseServiceDate, type MaintenanceLog } from "@/lib/k5"
import { recordedMiles } from "@/lib/garage-logs"

export const insurance = {
  carrier: "Progressive County Mutual",
  policyNumber: "861401819",
  insured: "Oscar Leal",
  address: "504 S Storey St, Dallas, TX 75203",
  phone: "1-800-776-4737",
  claimsPhone: "1-800-274-4499",
  claimsUrl: "https://claims.progressive.com",
  monthlyPayment: 292.74,
  effective: "2026-08-10",
  expires: "2027-02-10",
  vehicle: "2021 Kia K5",
  vin: "5XXG64J25MG063586",
} as const

export type RegistrationView = {
  renewed: string
  due: string | null
  mileage: number | null
  stickerYear: number | null
  note: string | null
}

export function registrationView(logs: MaintenanceLog[]): RegistrationView | null {
  const match = [...logs]
    .filter((log) => /registration/i.test(`${log.type} ${log.description ?? ""}`))
    .sort((a, b) => {
      const aTime = parseServiceDate(a.datedone)?.valueOf() ?? dayjs(a.date).valueOf()
      const bTime = parseServiceDate(b.datedone)?.valueOf() ?? dayjs(b.date).valueOf()
      return bTime - aTime
    })[0]
  if (!match) return null
  const renewed = parseServiceDate(match.datedone)
  const sticker = match.description?.match(/\b(20\d{2})\s+sticker\b/i)
  const stickerYear = sticker ? Number(sticker[1]) : null
  const due = renewed
    ? dayjs(new Date(stickerYear ?? renewed.year() + 1, renewed.month() + 1, 0)).format("YYYY-MM-DD")
    : null
  return {
    renewed: renewed ? renewed.format("YYYY-MM-DD") : match.datedone,
    due,
    mileage: recordedMiles(match),
    stickerYear,
    note: match.description?.trim() || null,
  }
}

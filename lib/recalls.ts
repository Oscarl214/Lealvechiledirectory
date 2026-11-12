import { k5 } from "@/lib/k5"

export type RecallStatus = "open" | "done" | "skip"

export type GarageRecall = {
  campaign: string
  nhtsaNumber: string
  kiaNumber: string
  reported: string
  component: string
  summary: string
  consequence: string
  remedy: string
  parkOutside: boolean
  turboOnly: boolean
  onThisVin: boolean
  status: RecallStatus
}

const vinYear: Record<string, number> = {
  A: 2010,
  B: 2011,
  C: 2012,
  D: 2013,
  E: 2014,
  F: 2015,
  G: 2016,
  H: 2017,
  J: 2018,
  K: 2019,
  L: 2020,
  M: 2021,
  N: 2022,
  P: 2023,
  R: 2024,
  S: 2025,
  T: 2026,
  V: 2027,
  W: 2028,
  X: 2029,
  Y: 2030,
}

export function vinModelYear(vin: string) {
  return vinYear[vin.charAt(9)] ?? null
}

const statuses = new Set<RecallStatus>(["open", "done", "skip"])

export function parseRecallStatuses(value: unknown) {
  const saved: Record<string, RecallStatus> = {}
  if (!value || typeof value !== "object") return saved
  for (const [campaign, status] of Object.entries(value)) {
    if (typeof status === "string" && statuses.has(status as RecallStatus)) {
      saved[campaign] = status as RecallStatus
    }
  }
  return saved
}

function text(value: unknown) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : ""
}

function reported(value: string) {
  const [day, month, year] = value.split("/").map(Number)
  if (!day || !month || !year) return value
  return new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10)
}

function nhtsaNumber(campaign: string) {
  return campaign.replace(/000$/, "")
}

function kiaNumber(remedy: string) {
  const match = remedy.match(/number for this recall is\s+([A-Z0-9-]+)/i)
  return match?.[1] ?? ""
}

export function recallsFromNhtsa(payload: unknown, saved: Record<string, RecallStatus>) {
  const results = payload && typeof payload === "object" && "results" in payload ? payload.results : []
  if (!Array.isArray(results)) return []
  const recalls: GarageRecall[] = []
  for (const entry of results) {
    if (!entry || typeof entry !== "object") continue
    const row = entry as Record<string, unknown>
    const campaign = text(row.NHTSACampaignNumber)
    const summary = text(row.Summary)
    if (!campaign || !summary) continue
    const remedy = text(row.Remedy)
    const number = nhtsaNumber(campaign)
    recalls.push({
      campaign,
      nhtsaNumber: number,
      kiaNumber: kiaNumber(remedy),
      reported: reported(text(row.ReportReceivedDate)),
      component: text(row.Component),
      summary,
      consequence: text(row.Consequence),
      remedy,
      parkOutside: row.parkOutSide === true || row.parkOutSide === "true" || row.parkIt === true,
      turboOnly: /2\.5\s*l|t-gdi|turbocharged/i.test(summary),
      onThisVin: number === k5.openRecall,
      status: saved[campaign] ?? "open",
    })
  }
  return recalls.sort((a, b) => b.reported.localeCompare(a.reported))
}

export function openRecallCount(recalls: GarageRecall[]) {
  return recalls.filter((recall) => recall.onThisVin && recall.status === "open").length
}

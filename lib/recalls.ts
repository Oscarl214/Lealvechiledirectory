export type RecallStatus = "open" | "done" | "skip"

export type GarageRecall = {
  campaign: string
  reported: string
  component: string
  summary: string
  consequence: string
  remedy: string
  parkOutside: boolean
  turboOnly: boolean
  status: RecallStatus
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
    recalls.push({
      campaign,
      reported: reported(text(row.ReportReceivedDate)),
      component: text(row.Component),
      summary,
      consequence: text(row.Consequence),
      remedy: text(row.Remedy),
      parkOutside: row.parkOutSide === true || row.parkOutSide === "true" || row.parkIt === true,
      turboOnly: /2\.5\s*l|t-gdi|turbocharged/i.test(summary),
      status: saved[campaign] ?? "open",
    })
  }
  return recalls.sort((a, b) => b.reported.localeCompare(a.reported))
}

export function openRecallCount(recalls: GarageRecall[]) {
  return recalls.filter((recall) => recall.status === "open").length
}

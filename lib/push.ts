import webpush from "web-push"
import { vapidPublicKey } from "@/lib/vapid-public"

export type StoredPush = {
  endpoint: string
  keys: { p256dh: string; auth: string }
}

export function parsePush(value: unknown): StoredPush | null {
  if (!value || typeof value !== "object") return null
  const item = value as { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } }
  if (typeof item.endpoint !== "string" || !item.endpoint.startsWith("https://")) return null
  if (typeof item.keys?.p256dh !== "string" || typeof item.keys.auth !== "string") return null
  return { endpoint: item.endpoint, keys: { p256dh: item.keys.p256dh, auth: item.keys.auth } }
}

export function parsePushList(value: unknown): StoredPush[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const list: StoredPush[] = []
  for (const item of value) {
    const subscription = parsePush(item)
    if (!subscription || seen.has(subscription.endpoint)) continue
    seen.add(subscription.endpoint)
    list.push(subscription)
  }
  return list
}

export function pushConfigured() {
  return Boolean(process.env.VAPID_PRIVATE_KEY)
}

export async function sendPush(subscriptions: StoredPush[], message: { title: string; body: string }) {
  const privateKey = process.env.VAPID_PRIVATE_KEY
  if (!privateKey) throw new Error("VAPID_PRIVATE_KEY is not set")
  webpush.setVapidDetails("mailto:oscaranftesting@gmail.com", vapidPublicKey, privateKey)
  const payload = JSON.stringify(message)
  const gone: string[] = []
  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(subscription, payload, { TTL: 60 * 60 * 12 })
      } catch (error) {
        const status =
          typeof error === "object" && error && "statusCode" in error ? Number(error.statusCode) : 0
        if (status === 404 || status === 410) gone.push(subscription.endpoint)
        else throw error
      }
    })
  )
  return gone
}

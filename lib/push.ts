import { getMessaging } from "firebase-admin/messaging"
import { adminApp } from "@/lib/firebase-admin"

export type StoredPush = {
  token: string
}

export function parsePush(value: unknown): StoredPush | null {
  if (!value || typeof value !== "object") return null
  const token = (value as { token?: unknown }).token
  if (typeof token !== "string" || token.length < 20) return null
  return { token }
}

export function parsePushList(value: unknown): StoredPush[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const list: StoredPush[] = []
  for (const item of value) {
    const subscription = parsePush(item)
    if (!subscription || seen.has(subscription.token)) continue
    seen.add(subscription.token)
    list.push(subscription)
  }
  return list
}

export async function sendPush(subscriptions: StoredPush[], message: { title: string; body: string }, link: string) {
  const messaging = getMessaging(adminApp())
  const gone: string[] = []
  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await messaging.send({
          token: subscription.token,
          data: { title: message.title, body: message.body },
          webpush: {
            headers: { Urgency: "high", TTL: String(60 * 60 * 12) },
            fcmOptions: { link },
          },
        })
      } catch (error) {
        const code = error && typeof error === "object" && "code" in error ? String(error.code) : ""
        if (
          code === "messaging/registration-token-not-registered" ||
          code === "messaging/invalid-registration-token" ||
          code === "messaging/invalid-argument"
        ) {
          gone.push(subscription.token)
          return
        }
        throw error
      }
    })
  )
  return gone
}

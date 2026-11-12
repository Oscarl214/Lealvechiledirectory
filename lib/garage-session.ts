import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

export const SESSION_COOKIE = "garage_session"
const FIVE_DAYS_MS = 60 * 60 * 24 * 5 * 1000

export function ownerEmail() {
  const email = process.env.GARAGE_OWNER_EMAIL?.trim().replace(/^["']|["']$/g, "").trim().toLowerCase()
  if (!email) throw new Error("GARAGE_OWNER_EMAIL is not set")
  return email
}

export async function openGarageSession(idToken: string) {
  const decoded = await adminAuth().verifyIdToken(idToken)
  const email = decoded.email?.toLowerCase()
  if (!email) {
    return {
      ok: false as const,
      status: 401,
      error: "Google did not confirm the email on that sign-in. Try again.",
    }
  }
  if (email !== ownerEmail()) {
    return { ok: false as const, status: 403, error: "This Google account cannot open the garage" }
  }
  const session = await adminAuth().createSessionCookie(idToken, { expiresIn: FIVE_DAYS_MS })
  return { ok: true as const, session, email, maxAge: FIVE_DAYS_MS / 1000 }
}

export async function readGarageSession() {
  const cookie = cookies().get(SESSION_COOKIE)?.value
  if (!cookie) return null
  try {
    const decoded = await adminAuth().verifySessionCookie(cookie, true)
    const email = decoded.email?.toLowerCase()
    if (!email || email !== ownerEmail()) return null
    return { email, uid: decoded.uid }
  } catch {
    return null
  }
}

export async function requireGarageSession() {
  const session = await readGarageSession()
  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }
  return { session, response: null }
}

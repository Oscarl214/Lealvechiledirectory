import { NextResponse } from "next/server"
import { openGarageSession, readGarageSession, SESSION_COOKIE } from "@/lib/garage-session"

export async function GET() {
  const session = await readGarageSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return NextResponse.json({ email: session.email })
}

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json()
    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "Missing sign-in token" }, { status: 400 })
    }
    const opened = await openGarageSession(idToken)
    if (!opened) {
      return NextResponse.json({ error: "This Google account cannot open the garage" }, { status: 403 })
    }
    const response = NextResponse.json({ email: opened.email })
    response.cookies.set(SESSION_COOKIE, opened.session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: opened.maxAge,
    })
    return response
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : ""
    const detail = error instanceof Error ? error.message : ""
    if (!process.env.GARAGE_OWNER_EMAIL?.trim()) {
      return NextResponse.json({ error: "Garage owner email is not on this deployment. Redeploy after saving it." }, { status: 401 })
    }
    if (/FIREBASE_SERVICE_ACCOUNT|private_key|JSON/i.test(detail)) {
      return NextResponse.json({ error: "The Firebase service account on Vercel could not be read." }, { status: 401 })
    }
    if (code.startsWith("auth/")) {
      return NextResponse.json({ error: "Google sign-in could not be verified." }, { status: 401 })
    }
    return NextResponse.json({ error: "Could not start the session" }, { status: 401 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 })
  return response
}

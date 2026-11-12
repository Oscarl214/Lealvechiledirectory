import { NextResponse } from "next/server"
import { ServiceAccountError } from "@/lib/firebase-admin"
import { openGarageSession, readGarageSession, SESSION_COOKIE } from "@/lib/garage-session"

export async function GET() {
  const session = await readGarageSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return NextResponse.json({ email: session.email })
}

function sessionCookie(response: NextResponse, session: string, maxAge: number) {
  response.cookies.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  })
}

function signInFailure(request: Request, message: string, status: number, navigate: boolean) {
  if (!navigate) return NextResponse.json({ error: message }, { status })
  const url = new URL("/garage", request.url)
  url.searchParams.set("signin", message)
  return NextResponse.redirect(url, 303)
}

async function readSignIn(request: Request) {
  const contentType = request.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => null)
    const idToken = body && typeof body.idToken === "string" ? body.idToken : ""
    return { idToken, navigate: false }
  }
  const form = await request.formData().catch(() => null)
  const idToken = form?.get("idToken")
  return { idToken: typeof idToken === "string" ? idToken : "", navigate: true }
}

export async function POST(request: Request) {
  const submitted = await readSignIn(request).catch(() => ({ idToken: "", navigate: false }))
  try {
    if (!submitted.idToken) {
      return signInFailure(request, "Missing sign-in token", 400, submitted.navigate)
    }
    const opened = await openGarageSession(submitted.idToken)
    if (!opened.ok) {
      return signInFailure(request, opened.error, opened.status, submitted.navigate)
    }
    if (submitted.navigate) {
      const response = NextResponse.redirect(new URL("/garage", request.url), 303)
      sessionCookie(response, opened.session, opened.maxAge)
      return response
    }
    const response = NextResponse.json({ email: opened.email })
    sessionCookie(response, opened.session, opened.maxAge)
    return response
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : ""
    if (error instanceof ServiceAccountError) {
      return signInFailure(request, error.message, 401, submitted.navigate)
    }
    if (!process.env.GARAGE_OWNER_EMAIL?.trim()) {
      return signInFailure(request, "Garage owner email is not on this deployment. Redeploy after saving it.", 401, submitted.navigate)
    }
    if (code.startsWith("auth/")) {
      return signInFailure(request, "Google sign-in could not be verified.", 401, submitted.navigate)
    }
    return signInFailure(request, "Could not start the session", 401, submitted.navigate)
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 })
  return response
}

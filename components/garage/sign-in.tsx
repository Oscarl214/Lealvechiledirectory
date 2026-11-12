"use client"

import { useEffect, useState } from "react"
import {
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  type User,
  type UserCredential,
} from "firebase/auth"
import { toast } from "sonner"
import { clientAuth } from "@/lib/firebase"

let redirectResult: Promise<UserCredential | null> | null = null

function redirectResultOnce() {
  if (!redirectResult) redirectResult = getRedirectResult(clientAuth())
  return redirectResult
}

function homeScreenSignIn() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function signInError(error: unknown) {
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : ""
  if (
    code === "auth/popup-closed-by-user" ||
    code === "auth/cancelled-popup-request" ||
    code === "auth/user-cancelled" ||
    code === "auth/no-auth-event"
  ) {
    return null
  }
  if (code === "auth/network-request-failed") return "The sign-in connection dropped. Try again."
  if (error instanceof Error && !code) return error.message
  return "Google sign-in did not finish. Try again."
}

const homeSignInGuard = "k5-home-sign-in"

async function openSession(user: User) {
  await user.reload()
  const idToken = await user.getIdToken(true)
  const response = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    await clientAuth().signOut().catch(() => undefined)
    throw new Error(typeof body?.error === "string" ? body.error : "Google sign-in did not finish. Try again.")
  }
}

function restoredUser() {
  const auth = clientAuth()
  if (auth.currentUser) return Promise.resolve(auth.currentUser)
  return new Promise<User | null>((resolve) => {
    const timeout = window.setTimeout(() => {
      unsubscribe()
      resolve(auth.currentUser)
    }, 2500)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return
      window.clearTimeout(timeout)
      unsubscribe()
      resolve(user)
    })
  })
}

function submitHomeSession(idToken: string) {
  const form = document.createElement("form")
  form.method = "POST"
  form.action = "/api/session"
  const input = document.createElement("input")
  input.type = "hidden"
  input.name = "idToken"
  input.value = idToken
  form.append(input)
  document.body.append(form)
  form.submit()
}

export async function resumeGoogleSignIn() {
  const existing = await fetch("/api/session")
  if (existing.ok) {
    sessionStorage.removeItem(homeSignInGuard)
    return true
  }
  try {
    const result = await redirectResultOnce()
    const user = result?.user ?? (homeScreenSignIn() ? await restoredUser() : null)
    if (!user) return false
    if (homeScreenSignIn()) {
      if (sessionStorage.getItem(homeSignInGuard) === "1") return false
      sessionStorage.setItem(homeSignInGuard, "1")
      await user.reload()
      submitHomeSession(await user.getIdToken(true))
      return true
    }
    await openSession(user)
    return true
  } catch (error) {
    const message = signInError(error)
    if (message) toast.error(message)
    return false
  }
}

export function GarageSignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [pending, setPending] = useState(false)

  useEffect(() => {
    const url = new URL(window.location.href)
    const message = url.searchParams.get("signin")
    if (!message) return
    toast.error(message)
    url.searchParams.delete("signin")
    window.history.replaceState({}, "", `${url.pathname}${url.search}`)
  }, [])

  async function signIn() {
    setPending(true)
    try {
      const provider = new GoogleAuthProvider()
      provider.addScope("email")
      provider.setCustomParameters({ prompt: "select_account" })
      const auth = clientAuth()
      if (homeScreenSignIn()) {
        sessionStorage.removeItem(homeSignInGuard)
        await signInWithRedirect(auth, provider)
        return
      }
      try {
        const result = await signInWithPopup(auth, provider)
        await openSession(result.user)
        onSignedIn()
      } catch (error) {
        const code = error && typeof error === "object" && "code" in error ? String(error.code) : ""
        if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment") {
          await signInWithRedirect(auth, provider)
          return
        }
        throw error
      }
    } catch (error) {
      const message = signInError(error)
      if (message) toast.error(message)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="garage-enter flex h-dvh flex-col items-center justify-center bg-black px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] text-center text-white">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">Garage</p>
      <h1 className="mt-2 text-3xl font-semibold">Kia K5</h1>
      <p className="mt-3 max-w-sm text-sm text-white/60">Sign in with Google to open the car.</p>
      <button
        type="button"
        onClick={signIn}
        disabled={pending}
        className="mt-8 rounded-full bg-white px-5 py-2 text-sm font-medium text-black disabled:opacity-60"
      >
        {pending ? "Opening" : "Continue with Google"}
      </button>
    </div>
  )
}

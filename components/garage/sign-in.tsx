"use client"

import { useState } from "react"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { toast } from "sonner"
import { clientAuth } from "@/lib/firebase"

export function GarageSignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [pending, setPending] = useState(false)

  async function signIn() {
    setPending(true)
    try {
      const result = await signInWithPopup(clientAuth(), new GoogleAuthProvider())
      const idToken = await result.user.getIdToken()
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      })
      if (!response.ok) {
        await clientAuth().signOut()
        toast.error("This Google account cannot open the garage")
        return
      }
      onSignedIn()
    } catch {
      toast.error("Google sign-in did not finish")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-black px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] text-center text-white">
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

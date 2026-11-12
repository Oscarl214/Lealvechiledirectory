import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

function authDomain() {
  if (typeof window === "undefined") return process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  if (standalone && window.location.protocol === "https:") return window.location.host
  return process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
}

export function clientApp() {
  const existing = getApps()[0]
  if (existing) return existing
  return initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: authDomain(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  })
}

export function clientAuth() {
  return getAuth(clientApp())
}

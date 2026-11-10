import fs from "fs"
import path from "path"
import { cert, getApps, initializeApp, type App } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

function loadCredential() {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (inline) return cert(JSON.parse(inline))
  const file = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  if (!file) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH is not set")
  const fullPath = path.isAbsolute(file) ? file : path.join(process.cwd(), file)
  const json = JSON.parse(fs.readFileSync(fullPath, "utf8"))
  return cert(json)
}

export function adminApp(): App {
  const existing = getApps()[0]
  if (existing) return existing
  return initializeApp({ credential: loadCredential() })
}

export function adminAuth() {
  return getAuth(adminApp())
}

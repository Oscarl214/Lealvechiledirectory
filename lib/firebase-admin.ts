import fs from "fs"
import path from "path"
import { cert, getApps, initializeApp, type App } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

function parseServiceAccount(raw: string) {
  let text = raw.trim().replace(/^\uFEFF/, "")
  if (text.startsWith('"') && text.endsWith('"')) {
    try {
      const once = JSON.parse(text)
      if (typeof once === "string") text = once
    } catch {
      text = text.slice(1, -1)
    }
  }
  try {
    return JSON.parse(text)
  } catch {
    const fixed = text.replace(/"private_key"\s*:\s*"([\s\S]*?)"\s*,/, (_match, key: string) => {
      return `"private_key":"${key.replace(/\r?\n/g, "\\n")}",`
    })
    return JSON.parse(fixed)
  }
}

function loadCredential() {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (inline) return cert(parseServiceAccount(inline))
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

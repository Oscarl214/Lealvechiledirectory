import fs from "fs"
import path from "path"
import { cert, getApps, initializeApp, type App } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

export class ServiceAccountError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ServiceAccountError"
  }
}

function decodeRaw(raw: string) {
  let text = raw.trim().replace(/^\uFEFF/, "")
  if (!text.startsWith("{") && !text.startsWith('"') && !text.startsWith("'")) {
    try {
      const decoded = Buffer.from(text, "base64").toString("utf8").trim()
      if (decoded.startsWith("{")) text = decoded
    } catch {
      text = raw.trim()
    }
  }
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    try {
      const once = JSON.parse(text)
      if (typeof once === "string") text = once.trim()
    } catch {
      text = text.slice(1, -1)
    }
  }
  return text
}

function normalizePrivateKey(key: string) {
  const value = key.trim().replace(/\\n/g, "\n").replace(/\r\n/g, "\n")
  const match = value.match(/-----BEGIN ([A-Z0-9 ]+)-----([\s\S]*?)-----END \1-----/)
  if (!match) return value.endsWith("\n") ? value : `${value}\n`
  const body = match[2].replace(/\s+/g, "")
  const lines = body.match(/.{1,64}/g) ?? []
  return `-----BEGIN ${match[1]}-----\n${lines.join("\n")}\n-----END ${match[1]}-----\n`
}

function parseServiceAccount(raw: string) {
  const text = decodeRaw(raw)
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    try {
      const fixed = text.replace(/"private_key"\s*:\s*"([\s\S]*?)"\s*,/, (_match, key: string) => {
        return `"private_key":${JSON.stringify(key)},`
      })
      parsed = JSON.parse(fixed)
    } catch {
      throw new ServiceAccountError("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON. Paste it again as one line.")
    }
  }
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed)
    } catch {
      throw new ServiceAccountError("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON. Paste it again as one line.")
    }
  }
  if (!parsed || typeof parsed !== "object") {
    throw new ServiceAccountError("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON. Paste it again as one line.")
  }
  const account = parsed as { private_key?: unknown }
  if (typeof account.private_key !== "string" || !account.private_key.trim()) {
    throw new ServiceAccountError("The service account is missing its private key.")
  }
  account.private_key = normalizePrivateKey(account.private_key)
  return account
}

function loadCredential() {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (inline?.trim()) {
    try {
      return cert(parseServiceAccount(inline) as Parameters<typeof cert>[0])
    } catch (error) {
      if (error instanceof ServiceAccountError) throw error
      throw new ServiceAccountError("The service account private key is damaged. Paste the JSON again as one line.")
    }
  }
  const file = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  if (!file) throw new ServiceAccountError("FIREBASE_SERVICE_ACCOUNT_JSON is missing on this deployment.")
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

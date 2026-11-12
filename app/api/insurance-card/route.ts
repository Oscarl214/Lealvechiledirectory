import { readFile } from "fs/promises"
import path from "path"
import { NextResponse } from "next/server"
import { requireGarageSession } from "@/lib/garage-session"

export async function GET() {
  const auth = await requireGarageSession()
  if (auth.response) return auth.response
  try {
    const file = await readFile(path.join(process.cwd(), "private", "progressive-id-card.pdf"))
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="progressive-id-card.pdf"',
        "Cache-Control": "private, no-store",
      },
    })
  } catch (error) {
    console.error("Error opening insurance card", error instanceof Error ? error.message : "unknown")
    return NextResponse.json({ error: "Insurance card is not on this deployment" }, { status: 404 })
  }
}

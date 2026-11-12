import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from "./providers"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "K5 Garage",
  description: "Personal maintenance log for the Kia K5",
  applicationName: "K5 Garage",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "K5 Garage",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TELECELL MAGAZINE - Recibos",
  description: "Sistema profissional de geração de recibos de garantia para smartphones",
  generator: "TELECELL MAGAZINE - Recibos",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/telecell-logo.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/telecell-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: "/telecell-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

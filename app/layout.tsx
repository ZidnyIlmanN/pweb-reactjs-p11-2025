import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Pacifico } from "next/font/google"
import "./globals.css"
import ClientLayout from "./ClientLayout"
import Script from "next/script"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
});

export const metadata: Metadata = {
  title: "IT Literature Shop",
  description: "Your online library for IT books and literature",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} font-sans bg-background text-foreground min-h-screen`}>
        <ClientLayout>{children}</ClientLayout>
        <Script
          src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs"
          type="module"
        />
      </body>
    </html>
  )
}

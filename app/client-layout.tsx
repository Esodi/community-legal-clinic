'use client'

import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import BallTrail from "@/components/BallTrail"
import { AuthProvider } from "./contexts/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body 
        className={`${inter.className} min-h-screen bg-[#001a42] dark:bg-gray-900 antialiased`}
      >
        <Providers>
          <AuthProvider>
            <BallTrail />
            <main>
              {children}
            </main>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}

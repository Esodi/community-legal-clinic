import type { Metadata } from "next"
import logo from "@/assets/logo.png"
export const metadata: Metadata = {
  metadataBase: new URL('https://www.clc.tz'),
  title: {
    default: "Community Legal Clinic (CLC)",
    template: "%s | CLC"
  },
  description: "Instant access to trusted legal experts, wherever you are.",
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      }
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#1F1F23'
      }
    ]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "Community Legal Clinic (CLC)",
    description: "Instant access to trusted legal experts, wherever you are.",
    url: "https://www.clc.tz",
    siteName: "Community Legal Clinic",
    locale: "en_TZ",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
} 
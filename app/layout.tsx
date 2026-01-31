import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'BREATHE SPEC | Navy SEAL Breathing Techniques',
  description: 'Master military-grade breathing techniques used by Navy SEALs. Box breathing, tactical breathing, and more. Free, no signup required.',
  keywords: ['breathing techniques', 'box breathing', 'navy seal', 'stress relief', 'meditation', 'tactical breathing', 'physiological sigh', '4-7-8 breathing'],
  authors: [{ name: 'BREATHE SPEC' }],
  creator: 'BREATHE SPEC',
  publisher: 'BREATHE SPEC',
  metadataBase: new URL('https://breathespec.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://breathespec.com',
    siteName: 'BREATHE SPEC',
    title: 'BREATHE SPEC | Train Your Breath. Master Your Mind.',
    description: 'Military-grade breathing techniques, free for everyone. Used by Navy SEALs, backed by science.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@breathespec',
    creator: '@breathespec',
    title: 'BREATHE SPEC | Navy SEAL Breathing Techniques',
    description: 'Master military-grade breathing techniques used by Navy SEALs. Box breathing, tactical breathing, physiological sigh, and more.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BREATHE SPEC',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'application-name': 'BREATHE SPEC',
    'apple-mobile-web-app-title': 'BREATHE SPEC',
    'msapplication-TileColor': '#0A1628',
    'msapplication-tap-highlight': 'no',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A1628',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-navy text-white min-h-screen overflow-y-auto">
        {children}
      </body>
    </html>
  )
}

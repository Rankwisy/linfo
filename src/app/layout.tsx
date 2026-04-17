import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

/**
 * Inter as a variable font — one .woff2 file covers every weight.
 * next/font inlines @font-face, serves from same origin, and adjusts
 * the system-font fallback metrics → zero CLS when Inter swaps in.
 *
 * Performance vs. old setup (Quicksand 5 weights):
 *   Before : 5 network requests ~130 KB, potential layout shift
 *   After  : 1 variable-font request ~85 KB (latin subset), zero CLS
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',  // CSS variable used in globals.css @theme
  display: 'swap',           // content visible immediately with fallback
  preload: true,             // preloaded in <head> → better LCP
  adjustFontFallback: true,  // tweaks fallback metrics to match Inter → no CLS
})

export const metadata: Metadata = {
  title: {
    default: 'linfo.be — Annuaire des entreprises locales en Belgique',
    template: '%s | linfo.be',
  },
  description:
    "linfo.be est l'annuaire des entreprises locales en Belgique. Transport, sport, construction et services professionnels.",
  metadataBase: new URL('https://linfo.be'),
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // inter.variable sets --font-inter on <html>, available to all children
    <html lang="fr" className={inter.variable}>
      <body className="font-sans bg-gray-50 text-gray-800 antialiased selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  )
}

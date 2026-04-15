import type { Metadata } from 'next'
import { Quicksand } from 'next/font/google'
import './globals.css'

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'linfo.be — Annuaire des entreprises locales en Belgique',
    template: '%s | linfo.be',
  },
  description:
    'linfo.be est l\'annuaire des entreprises locales en Belgique. Transport, sport, construction et services professionnels.',
  metadataBase: new URL('https://linfo.be'),
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${quicksand.className} bg-gray-50 text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  )
}

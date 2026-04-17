import { ImageResponse } from 'next/og'

/*
  Next.js App Router file-based icon metadata.
  This file is served at /icon and automatically wired into <head> as:
    <link rel="icon" href="/icon?<hash>" type="image/png" sizes="32x32">

  The icon matches the navbar logo:
    • Blue (#2563eb) rounded rectangle
    • White MapPin SVG (Lucide style)
*/

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* MapPin — Lucide path, scaled to 20px on a 32px canvas */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
    ),
    { ...size },
  )
}

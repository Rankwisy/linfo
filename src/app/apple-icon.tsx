import { ImageResponse } from 'next/og'

/*
  Apple Touch Icon — 180×180 px PNG.
  iOS uses this when a user adds the site to their home screen.
  Next.js serves it at /apple-icon and injects:
    <link rel="apple-touch-icon" href="/apple-icon?<hash>">

  Slightly larger border-radius (40px) to match iOS rounded icon appearance.
  Icon scaled up proportionally: 20/32 × 180 ≈ 112px
*/

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="112"
          height="112"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.75"
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

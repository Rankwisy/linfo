'use client'

/**
 * HeroImage — full-width business banner with graceful error handling.
 *
 * Uses a plain <img> with referrerPolicy="no-referrer" so Google CDN
 * doesn't block the request with 403. Hides the entire section on error.
 */

import { useState } from 'react'

interface Props {
  src: string
  alt: string
}

const BROKEN_PATTERNS = [
  '/AAAAAAAAAAI/',
  's44-p-k-no',
  'streetviewpixels',
  'maps.gstatic.com',
]

function isBroken(url: string): boolean {
  return BROKEN_PATTERNS.some(p => url.includes(p))
}

export function HeroImage({ src, alt }: Props) {
  const [failed, setFailed] = useState(() => isBroken(src))

  if (failed) return null

  return (
    <div className="relative h-56 w-full sm:h-72 overflow-hidden bg-gray-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  )
}

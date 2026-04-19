'use client'

/**
 * BusinessAvatar — image with server-rendered icon fallback.
 *
 * Google Business / Outscraper image URLs are frequently unreliable:
 *   - Old Google+ logos  (/AAAAAAAAAAI/ pattern)  → often 403 / 404
 *   - Street View thumbs (streetviewpixels-pa.*)  → blocked when proxied
 *
 * IMPORTANT — RSC constraint:
 *   React component functions are NOT serializable across the Server →
 *   Client boundary. So we accept the fallback as `children` (JSX rendered
 *   server-side and passed as RSC payload) instead of as a component prop.
 *
 * Usage (in a Server Component):
 *   <BusinessAvatar src={business.imageUrl} alt={name} bgColor={bgColor}>
 *     <Icon icon={icon} size="lg" className={color} />
 *   </BusinessAvatar>
 */

import { useState } from 'react'
import type { ReactNode } from 'react'

interface Props {
  src: string | null | undefined
  alt: string
  /** Rendered server-side; shown when image is absent or fails */
  children: ReactNode
  /** Tailwind bg class applied to the fallback container, e.g. bg-rose-50 */
  bgColor: string
  /** Container size + shape, defaults to "h-16 w-16 rounded-2xl" */
  sizeClass?: string
}

/** URL patterns that are almost always broken — skip, show fallback directly */
const BROKEN_PATTERNS = [
  '/AAAAAAAAAAI/',       // Old Google+ / G Business profile icon (dead)
  's44-p-k-no',         // 44 px square thumbnail — too small, often 404
  'streetviewpixels',   // Street View thumbnail — 403 when proxied
  'maps.gstatic.com',   // Static map tiles — not useful as a logo
]

function isBroken(url: string): boolean {
  return BROKEN_PATTERNS.some(p => url.includes(p))
}

export function BusinessAvatar({
  src,
  alt,
  children,
  bgColor,
  sizeClass = 'h-16 w-16 rounded-2xl',
}: Props) {
  const [failed, setFailed] = useState(() => !src || isBroken(src))

  if (failed) {
    return (
      <div className={`${sizeClass} shrink-0 flex items-center justify-center ${bgColor}`}>
        {children}
      </div>
    )
  }

  return (
    <div className={`${sizeClass} shrink-0 overflow-hidden`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src!}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  )
}

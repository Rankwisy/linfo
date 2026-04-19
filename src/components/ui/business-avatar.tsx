'use client'

/**
 * BusinessAvatar — image with automatic icon fallback.
 *
 * Google Business / Outscraper image URLs are frequently unreliable:
 *   - Old Google+ logos  (/AAAAAAAAAAI/ pattern)  → often 403 / 404
 *   - Street View thumbs (streetviewpixels-pa.*)  → blocked when proxied
 *
 * Strategy:
 *   1. Skip known-broken patterns up front → render icon immediately
 *   2. For valid URLs: render <img> directly (no Next.js proxy) with onError
 *   3. On load error → swap to icon fallback
 *
 * Why <img> not next/image?
 *   - next/image proxies the request through /_next/image which adds a
 *     Referer header that causes Google to return 403.
 *   - For user-uploaded logos we want the image as-is, no resize needed.
 */

import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'

interface Props {
  src: string | null | undefined
  alt: string
  /** Lucide icon component to render as fallback */
  fallbackIcon: LucideIcon
  /** Tailwind color class for the icon, e.g. text-rose-600 */
  iconColor: string
  /** Tailwind bg class for the icon container, e.g. bg-rose-50 */
  bgColor: string
  /** Container size class, defaults to "h-16 w-16" */
  sizeClass?: string
}

/** URL patterns that are almost always broken — skip them, show icon directly */
const BROKEN_PATTERNS = [
  '/AAAAAAAAAAI/',       // Old Google+ / G Business profile icon format
  's44-p-k-no',         // 44 px square → too small, often 404
  'streetviewpixels',   // Street View thumbnails → 403 when proxied
  'maps.gstatic.com',   // Static map tiles → not useful as a logo
]

function isBroken(url: string): boolean {
  return BROKEN_PATTERNS.some(p => url.includes(p))
}

export function BusinessAvatar({
  src,
  alt,
  fallbackIcon: FallbackIcon,
  iconColor,
  bgColor,
  sizeClass = 'h-16 w-16',
}: Props) {
  const [failed, setFailed] = useState(false)

  const showImage = src && !failed && !isBroken(src)

  if (!showImage) {
    return (
      <div className={`${sizeClass} shrink-0 rounded-2xl flex items-center justify-center ${bgColor}`}>
        <FallbackIcon
          size={28}
          strokeWidth={1.5}
          className={iconColor}
          aria-hidden
        />
      </div>
    )
  }

  return (
    <div className={`${sizeClass} shrink-0 rounded-2xl overflow-hidden`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  )
}

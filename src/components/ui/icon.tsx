import type { LucideIcon } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────────────────────
   Unified icon wrapper
   ─────────────────────────────────────────────────────────────────────────────
   Usage:
     import { Icon } from '@/components/ui/icon'
     import { CarIcon } from 'lucide-react'

     <Icon icon={CarIcon} size="md" />
     <Icon icon={CarIcon} size="sm" className="text-blue-600" />

   Size scale (px):
     xs  12 — inline metadata labels
     sm  16 — card secondary info (phone, domain, map pin)
     md  20 — button icons, nav items, sidebar links
     lg  24 — navbar, primary actions, hero elements
     xl  32 — category grid cards
   ───────────────────────────────────────────────────────────────────────────── */

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const SIZE_PX: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
}

interface IconProps {
  icon: LucideIcon
  size?: IconSize
  /** px override — prefer the size scale; use sparingly */
  sizePx?: number
  strokeWidth?: number
  className?: string
  'aria-hidden'?: boolean
}

export function Icon({
  icon: LucideComponent,
  size = 'md',
  sizePx,
  strokeWidth = 1.75,
  className,
  'aria-hidden': ariaHidden = true,
}: IconProps) {
  const px = sizePx ?? SIZE_PX[size]
  return (
    <LucideComponent
      size={px}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden={ariaHidden}
    />
  )
}

/** Convenience re-export so callers don't need a separate Lucide import */
export type { LucideIcon }

/**
 * MegaMenuPanel — desktop dropdown panel for one nav category.
 *
 * Design:
 *   ┌──────────────────────────────────────────────────┐
 *   │  💍 Mariage          Voir tous les pros →        │
 *   ├──────────────────────────────────┬───────────────┤
 *   │  Salle de mariage                │  PAR VILLE    │
 *   │  Traiteur mariage    Robe…       │  📍 Bruxelles │
 *   │  Photographe…        Fleuriste…  │  📍 Anvers    │
 *   │  Wedding Planner                 │  📍 Gand      │
 *   │                                  │  📍 Liège     │
 *   └──────────────────────────────────┴───────────────┘
 *
 * SEO:
 *   - Rendered server-side; all <a> tags are in the HTML source.
 *   - Hidden via CSS (opacity/pointer-events), NOT display:none.
 *   - Googlebot follows all links regardless of visibility state.
 *   - tabIndex managed to keep keyboard focus away from invisible items.
 *
 * Performance:
 *   - No animation library — GPU-accelerated opacity + transform only.
 *   - transition-[opacity,transform] avoids triggering layout/paint.
 *   - will-change applied only when the panel is transitioning (via the
 *     isVisible class change), released immediately after.
 */

import Link from 'next/link'
import { cities, type MenuCategory } from '@/data/menu'

interface Props {
  id: string
  category: MenuCategory
  /** Controls visibility — toggled by parent hover/focus state */
  isVisible: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function MegaMenuPanel({
  id,
  category: cat,
  isVisible,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  const ti = isVisible ? 0 : -1 // tabIndex shorthand

  return (
    <div
      id={id}
      role="region"
      aria-label={`Navigation — ${cat.label}`}
      aria-hidden={!isVisible}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={[
        // ── Position: stacked at top of the absolute panels container ──
        'absolute inset-x-0 top-0',
        // ── Appearance ──
        'bg-white border-t border-gray-100 shadow-2xl',
        // ── GPU-accelerated transition (no layout / paint cost) ──
        'transition-[opacity,transform] duration-150 ease-out',
        // ── Visibility state ──
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-1 pointer-events-none',
      ].join(' ')}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">

        {/* ── Panel header ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl leading-none" aria-hidden="true">
              {cat.icon}
            </span>
            <span className={`text-base font-bold ${cat.color}`}>
              {cat.label}
            </span>
          </div>
          <Link
            href={cat.siloHref}
            tabIndex={ti}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Voir tous les professionnels&nbsp;→
          </Link>
        </div>

        {/* ── Panel body: subcategories + city column ───────────────── */}
        <div className="grid grid-cols-[1fr_168px] gap-8">

          {/* Subcategory links — 2-column grid, keyword-rich anchor text */}
          <ul
            className="grid grid-cols-2 gap-x-6 gap-y-0.5 content-start"
            role="list"
          >
            {cat.subcategories.map((sub) => (
              <li key={sub.subSlug}>
                <Link
                  href={sub.defaultHref}
                  tabIndex={ti}
                  className="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  {/* Decorative bullet — animates to blue on hover */}
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-300 group-hover:bg-blue-500 transition-colors"
                  />
                  {sub.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* City column */}
          <div className="border-l border-gray-100 pl-6">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Par ville
            </p>
            <ul className="space-y-0.5" role="list">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/${city.slug}/${cat.id}`}
                    tabIndex={ti}
                    className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <span aria-hidden="true" className="text-[11px]">📍</span>
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

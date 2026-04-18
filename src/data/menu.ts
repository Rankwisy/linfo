/**
 * Mega-menu data for linfo.be
 *
 * Derived from silos.ts (single source of truth for categories/subcategories).
 * This file controls:
 *   - Which silos appear in the top nav bar and in what order
 *   - The short label used in the nav tab (overrides the full silo name)
 *   - Default city for subcategory deep-links (highest-traffic city)
 *
 * SEO notes:
 *   - Every subcategory link resolves to a real static page /{city}/{silo}/{sub}
 *   - Every city link resolves to a real static page /{city}/{silo}
 *   - All links are crawlable server-rendered HTML (no JS-only links)
 *   - Anchor text = exact keyword phrase (e.g. "Photographe & Vidéaste")
 */

import { silos, type Silo } from './silos'
import { cities } from './cities'

// ─── Short labels shown in the nav tab bar ────────────────────────────────────
// Kept intentionally concise so all 9 tabs fit on a 1024 px screen.
const NAV_LABELS: Record<string, string> = {
  'mariage':                   'Mariage',
  'finance-juridique':         'Juridique',
  'sante-bien-etre':           'Santé',
  'immobilier-construction':   'Rénovation',
  'beaute-mode':               'Beauté',
  'automobile-transport':      'Transport',
  'services-professionnels':   'Business',
  'evenementiel-culture':      'Événementiel',
}

// ─── Display order in the nav bar (priority order = revenue / traffic) ────────
export const NAV_SILO_SLUGS = Object.keys(NAV_LABELS)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MenuSubcategory {
  /** Keyword-rich display label used as anchor text */
  label: string
  siloSlug: string
  subSlug: string
  /**
   * Default deep-link: /{defaultCity}/{silo}/{sub}
   * Using Bruxelles — highest search volume, most businesses.
   * Internal links fan out from here across the city × category matrix.
   */
  defaultHref: string
}

export interface MenuCategory {
  /** = silo slug, used as React key and aria-controls id */
  id: string
  /** Short nav label (≤ 12 chars) */
  label: string
  /** Emoji icon from silos.ts */
  icon: string
  /** Tailwind text-color class, e.g. text-rose-700 */
  color: string
  /** Tailwind bg-color class, e.g. bg-rose-50 */
  bgColor: string
  /** Silo hub page — /{silo} — links to city-picker for this category */
  siloHref: string
  subcategories: MenuSubcategory[]
}

// ─── Build menu categories from silos ────────────────────────────────────────

const DEFAULT_CITY = 'bruxelles'

export const menuCategories: MenuCategory[] = NAV_SILO_SLUGS
  .map((slug) => silos.find((s) => s.slug === slug))
  .filter((s): s is Silo => Boolean(s))
  .map((silo): MenuCategory => ({
    id:       silo.slug,
    label:    NAV_LABELS[silo.slug] ?? silo.name,
    icon:     silo.icon,
    color:    silo.color,
    bgColor:  silo.bgColor,
    siloHref: `/${silo.slug}`,
    subcategories: silo.subcategories.map((sub) => ({
      label:       sub.name,
      siloSlug:    silo.slug,
      subSlug:     sub.slug,
      defaultHref: `/${DEFAULT_CITY}/${silo.slug}/${sub.slug}`,
    })),
  }))

// Re-export cities so consumers only need one import
export { cities }

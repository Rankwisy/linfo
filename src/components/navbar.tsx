'use client'

/**
 * Navbar — linfo.be
 *
 * ┌─ Desktop (≥ 1024 px) ───────────────────────────────────────────────┐
 * │  Logo │ Mariage · Juridique · Santé · Rénovation · ... │  + Ajouter │
 * │       ┌─────────────────── Mega panel (absolute) ──────────────┐    │
 * │       │  💍 Mariage              Voir tous les pros →          │    │
 * │       │  • Salle de mariage  • Robe de mariée   │ PAR VILLE   │    │
 * │       │  • Traiteur          • Fleuriste         │ Bruxelles   │    │
 * │       │  • Photographe       • Wedding Planner   │ Anvers ...  │    │
 * │       └────────────────────────────────────────────────────────┘    │
 * └────────────────────────────────────────────────────────────────────-┘
 *
 * ┌─ Mobile (< 1024 px) ────────────────────────────────────────────────┐
 * │  ☰  Logo                                              + Ajouter     │
 * │  ┌─ Drawer ─────────────────────────────────────────────────────┐  │
 * │  │  Villes: [Bruxelles] [Anvers] [Gand] [Liège]                │  │
 * │  │  ▼ Mariage                                                   │  │
 * │  │     • Salle de mariage  • Traiteur  ...                      │  │
 * │  │     Par ville: Bruxelles · Anvers · Gand · Liège             │  │
 * │  │  ▼ Juridique ...                                             │  │
 * │  └──────────────────────────────────────────────────────────────┘  │
 * └────────────────────────────────────────────────────────────────────-┘
 *
 * SEO impact:
 *   - All desktop panel links rendered in SSR HTML → Googlebot follows them.
 *   - Visibility controlled by CSS only (opacity / pointer-events / transform).
 *   - Every page links to every subcategory × city combo in 1 click.
 *   - Anchor text = exact keyword phrases ("Photographe & Vidéaste", etc.)
 *   - Reduces max crawl depth to 2 for any page in the directory.
 *
 * Keyboard navigation:
 *   - Tab / Shift-Tab traverses tabs and panel links naturally.
 *   - Enter / Space on a tab button opens / closes its panel.
 *   - Arrow Left / Right moves between tab buttons.
 *   - Escape closes the open panel, returns focus to the active tab button.
 *   - Click outside → panel closes.
 *
 * Performance:
 *   - No animation library. GPU-accelerated opacity + transform only.
 *   - 150 ms close timer prevents panel flicker when moving mouse
 *     diagonally from tab button to panel content.
 *   - useCallback / useRef prevent re-renders on timer operations.
 *   - Mobile drawer is conditionally rendered to keep HTML payload lean.
 */

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type KeyboardEvent,
} from 'react'
import Link from 'next/link'
import {
  MenuIcon,
  XIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MapPinIcon,
  PlusIcon,
} from 'lucide-react'

import { menuCategories, cities } from '@/data/menu'
import { MegaMenuPanel } from './nav/MegaMenuPanel'

export default function Navbar() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab]           = useState<string | null>(null)
  const [mobileOpen, setMobileOpen]         = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)

  // ── Refs ───────────────────────────────────────────────────────────────────
  const navRef        = useRef<HTMLElement>(null)
  const closeTimer    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  // ── Hover helpers (150 ms delay avoids diagonal-mouse flicker) ─────────────
  const openTab = useCallback((id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveTab(id)
  }, [])

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveTab(null), 150)
  }, [])

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  // ── Click outside → close panel ────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveTab(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Escape key → close everything, return focus to active tab ──────────────
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (activeTab) {
        setActiveTab(null)
        tabButtonRefs.current[activeTab]?.focus()
      }
      if (mobileOpen) setMobileOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [activeTab, mobileOpen])

  // ── Arrow key navigation between tab buttons ───────────────────────────────
  const handleTabKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        const next = menuCategories[(idx + 1) % menuCategories.length]
        tabButtonRefs.current[next.id]?.focus()
        openTab(next.id)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        const prev =
          menuCategories[(idx - 1 + menuCategories.length) % menuCategories.length]
        tabButtonRefs.current[prev.id]?.focus()
        openTab(prev.id)
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setActiveTab((cur) =>
          cur === menuCategories[idx].id ? null : menuCategories[idx].id,
        )
      }
    },
    [openTab],
  )

  // ── Close mobile on link click ─────────────────────────────────────────────
  const closeMobile = useCallback(() => {
    setMobileOpen(false)
    setMobileExpanded(null)
  }, [])

  // ───────────────────────────────────────────────────────────────────────────

  return (
    <nav
      ref={navRef}
      className="relative z-50 bg-white border-b border-gray-100 shadow-sm"
      aria-label="Navigation principale"
      onMouseLeave={scheduleClose}
    >
      {/* ════════════════════════════════════════════════════════════════════
          HEADER ROW
      ════════════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-3">

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex-shrink-0 rounded-md p-1.5 text-gray-600 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-drawer"
          >
            {mobileOpen
              ? <XIcon size={22} strokeWidth={2} />
              : <MenuIcon size={22} strokeWidth={2} />}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="linfo.be — accueil"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600">
              <MapPinIcon size={15} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-bold text-gray-900 tracking-tight leading-none">
              linfo<span className="text-blue-600">.be</span>
            </span>
          </Link>

          {/* Desktop tab bar */}
          <div
            className="hidden lg:flex items-center gap-0.5 flex-1 min-w-0"
            role="menubar"
            aria-label="Catégories principales"
          >
            {menuCategories.map((cat, idx) => (
              <button
                key={cat.id}
                ref={(el) => { tabButtonRefs.current[cat.id] = el }}
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={activeTab === cat.id}
                aria-controls={`panel-${cat.id}`}
                onMouseEnter={() => openTab(cat.id)}
                onFocus={() => openTab(cat.id)}
                onClick={() =>
                  setActiveTab((cur) => (cur === cat.id ? null : cat.id))
                }
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
                className={[
                  'flex items-center gap-1 rounded-md px-2.5 py-1.5',
                  'text-[11.5px] font-medium whitespace-nowrap',
                  'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                  activeTab === cat.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                ].join(' ')}
              >
                <span className="text-sm leading-none" aria-hidden="true">
                  {cat.icon}
                </span>
                {cat.label}
                <ChevronDownIcon
                  size={11}
                  strokeWidth={2.5}
                  aria-hidden="true"
                  className={`flex-shrink-0 transition-transform duration-150 ${
                    activeTab === cat.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Blog link — desktop */}
          <Link
            href="/blog"
            className="hidden lg:flex flex-shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11.5px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            ✍️ Blog
          </Link>

          {/* CTA */}
          <Link
            href="/ajouter-entreprise"
            className={[
              'flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-blue-600',
              'px-4 py-2 text-sm font-semibold text-white',
              'transition hover:bg-blue-700 active:scale-95',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
            ].join(' ')}
          >
            <PlusIcon size={14} strokeWidth={2.5} aria-hidden="true" />
            <span className="hidden sm:inline">Ajouter mon entreprise</span>
            <span className="sm:hidden">Ajouter</span>
          </Link>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          DESKTOP MEGA PANELS
          All 9 panels rendered in SSR HTML for full Googlebot crawlability.
          Stacked absolutely at top-14 (56 px = header height).
          Only the active panel is visible; others are opacity-0 + pointer-events-none.
      ════════════════════════════════════════════════════════════════════ */}
      <div
        className="hidden lg:block absolute inset-x-0 top-14"
        aria-live="polite"
      >
        {menuCategories.map((cat) => (
          <MegaMenuPanel
            key={cat.id}
            id={`panel-${cat.id}`}
            category={cat}
            isVisible={activeTab === cat.id}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          />
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          MOBILE DRAWER — accordion
          Conditionally rendered to keep initial HTML payload lean.
          Opens via hamburger button; each category expands independently.
      ════════════════════════════════════════════════════════════════════ */}
      {mobileOpen && (
        <div
          id="mobile-drawer"
          className="lg:hidden border-t border-gray-100 bg-white overflow-y-auto"
          style={{ maxHeight: 'calc(100dvh - 56px)' }}
        >
          {/* City pill row */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Villes
            </p>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}`}
                  onClick={closeMobile}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  <MapPinIcon size={11} className="text-gray-400" aria-hidden="true" />
                  {city.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Category accordion */}
          {menuCategories.map((cat) => {
            const isOpen = mobileExpanded === cat.id
            return (
              <div key={cat.id} className="border-b border-gray-100">
                {/* Accordion trigger */}
                <button
                  className="flex w-full items-center justify-between px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-blue-500"
                  onClick={() =>
                    setMobileExpanded((cur) => (cur === cat.id ? null : cat.id))
                  }
                  aria-expanded={isOpen}
                  aria-controls={`mobile-panel-${cat.id}`}
                >
                  <span className="flex items-center gap-2.5 text-sm font-semibold text-gray-900">
                    <span aria-hidden="true" className="text-base leading-none">
                      {cat.icon}
                    </span>
                    {cat.label}
                  </span>
                  <ChevronDownIcon
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                    className={`text-gray-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Accordion body */}
                {isOpen && (
                  <div id={`mobile-panel-${cat.id}`} className="px-4 pb-4">

                    {/* Subcategory links */}
                    <ul className="mb-3 space-y-0.5" role="list">
                      {cat.subcategories.map((sub) => (
                        <li key={sub.subSlug}>
                          <Link
                            href={sub.defaultHref}
                            onClick={closeMobile}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            <ChevronRightIcon
                              size={12}
                              strokeWidth={2.5}
                              aria-hidden="true"
                              className="flex-shrink-0 text-gray-300"
                            />
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {/* City grid for this category */}
                    <div className="border-t border-gray-100 pt-3">
                      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                        Par ville
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        {cities.map((city) => (
                          <Link
                            key={city.slug}
                            href={`/${city.slug}/${cat.id}`}
                            onClick={closeMobile}
                            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            <MapPinIcon
                              size={11}
                              aria-hidden="true"
                              className="flex-shrink-0 text-gray-400"
                            />
                            {city.name}
                          </Link>
                        ))}
                      </div>

                      {/* See-all CTA */}
                      <Link
                        href={cat.siloHref}
                        onClick={closeMobile}
                        className="mt-3 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Voir tout {cat.label}
                        <ChevronRightIcon size={13} strokeWidth={2.5} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Blog link — mobile */}
          <div className="px-3 pb-1">
            <Link
              href="/blog"
              onClick={closeMobile}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ✍️ Blog
            </Link>
          </div>

          {/* Bottom CTA */}
          <div className="p-4">
            <Link
              href="/ajouter-entreprise"
              onClick={closeMobile}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              <PlusIcon size={15} strokeWidth={2.5} aria-hidden="true" />
              Ajouter mon entreprise
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

'use client'
import Link from 'next/link'
import { silos } from '@/data/silos'
import { cities } from '@/data/cities'

interface SidebarProps {
  activeSiloSlug?: string
  activeSubSlug?: string
  activeCitySlug?: string
}

export default function Sidebar({ activeSiloSlug, activeSubSlug, activeCitySlug }: SidebarProps) {
  const city = activeCitySlug ?? 'bruxelles'

  return (
    <aside className="flex flex-col gap-6">
      {/* Silos filter */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-3 font-semibold text-gray-900">Secteurs</h3>
        <ul className="space-y-1">
          {silos.map((silo) => (
            <li key={silo.slug}>
              <Link
                href={`/${city}/${silo.slug}`}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeSiloSlug === silo.slug
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span>{silo.icon}</span>
                {silo.name}
              </Link>

              {/* Subcategories (expand when active) */}
              {activeSiloSlug === silo.slug && (
                <ul className="ml-4 mt-1 space-y-1 border-l border-gray-100 pl-3">
                  {silo.subcategories.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={`/${city}/${silo.slug}/${sub.slug}`}
                        className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                          activeSubSlug === sub.slug
                            ? 'text-blue-600 font-semibold'
                            : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Cities filter */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-3 font-semibold text-gray-900">Villes</h3>
        <ul className="space-y-1">
          {cities.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/${c.slug}${activeSiloSlug ? `/${activeSiloSlug}` : ''}`}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeCitySlug === c.slug
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                📍 {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-blue-600 p-5 text-white">
        <h3 className="font-semibold text-lg mb-2">Votre entreprise ici?</h3>
        <p className="text-sm text-blue-100 mb-4">
          Inscrivez votre entreprise gratuitement et touchez des milliers de clients potentiels.
        </p>
        <Link
          href="/ajouter-entreprise"
          className="block text-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
        >
          Ajouter mon entreprise
        </Link>
      </div>
    </aside>
  )
}

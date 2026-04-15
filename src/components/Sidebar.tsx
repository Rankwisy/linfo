'use client'
import Link from 'next/link'
import { categories } from '@/data/categories'
import { cities } from '@/data/cities'

interface SidebarProps {
  activeCategorySlug?: string
  activeSubcategorySlug?: string
  activeCitySlug?: string
}

export default function Sidebar({ activeCategorySlug, activeSubcategorySlug, activeCitySlug }: SidebarProps) {
  return (
    <aside className="flex flex-col gap-6">
      {/* Categories filter */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-3 font-semibold text-gray-900">Catégories</h3>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/${cat.slug}-${activeCitySlug || 'bruxelles'}`}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeCategorySlug === cat.slug
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </Link>

              {/* Subcategories */}
              {activeCategorySlug === cat.slug && (
                <ul className="ml-4 mt-1 space-y-1 border-l border-gray-100 pl-3">
                  {cat.subcategories.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={`/${sub.slug}-${activeCitySlug || 'bruxelles'}`}
                        className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                          activeSubcategorySlug === sub.slug
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
          {cities.map((city) => (
            <li key={city.slug}>
              <Link
                href={`/${activeCategorySlug || activeCategorySlug || 'transport'}-${city.slug}`}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeCitySlug === city.slug
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                📍 {city.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA box */}
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

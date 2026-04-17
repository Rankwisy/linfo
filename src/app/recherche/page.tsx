import { Metadata } from 'next'
import Link from 'next/link'
import { SearchIcon, MapPinIcon, BuildingIcon } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { supabase } from '@/lib/supabase'
import { type BusinessRow } from '@/lib/supabase'
import { silos } from '@/data/silos'
import { cities } from '@/data/cities'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata(props: SearchPageProps): Promise<Metadata> {
  const { q } = await props.searchParams
  const query = q?.trim() ?? ''
  return {
    title: query ? `"${query}" — Recherche | Linfo.be` : 'Recherche | Linfo.be',
    description: query
      ? `Résultats de recherche pour "${query}" sur Linfo.be — annuaire des entreprises belges.`
      : 'Recherchez des entreprises, services et professionnels en Belgique sur Linfo.be.',
    robots: { index: false },
  }
}

async function searchBusinesses(query: string) {
  if (!query || query.length < 2) return []
  const q = query.trim()
  const { data, error } = await supabase
    .from('businesses')
    .select('object_id, name, slug, category, subcategory, city, address, phone, website, image_url, rating, review_count, short_description')
    .or(`name.ilike.%${q}%,category.ilike.%${q}%,subcategory.ilike.%${q}%,city.ilike.%${q}%`)
    .order('rating', { ascending: false })
    .limit(60)
  if (error) { console.error(error); return [] }
  return data as BusinessRow[]
}

function getSiloForBusiness(category: string, subcategory: string) {
  return silos.find(
    (s) =>
      s.dbCategory === category ||
      s.subcategories.some((sub) => sub.dbCategory === category && sub.dbSubcategory === subcategory)
  )
}

function getCityName(slug: string) {
  return cities.find((c) => c.slug === slug)?.name ?? slug
}

export default async function RecherchePage(props: SearchPageProps) {
  const { q } = await props.searchParams
  const query = q?.trim() ?? ''
  const results = await searchBusinesses(query)

  // Group by city for display
  const grouped: Record<string, BusinessRow[]> = {}
  for (const biz of results) {
    if (!grouped[biz.city]) grouped[biz.city] = []
    grouped[biz.city].push(biz)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Search header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <form method="GET" action="/recherche" className="flex items-center gap-0 rounded-xl overflow-hidden shadow border border-gray-200 bg-white max-w-2xl">
              <div className="flex items-center pl-4 text-gray-400">
                <SearchIcon size={20} />
              </div>
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Rechercher une entreprise, taxi, restaurant..."
                className="flex-1 px-4 py-3.5 text-gray-800 placeholder-gray-400 outline-none text-base bg-transparent"
                autoComplete="off"
                autoFocus
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Rechercher
              </button>
            </form>

            {query && (
              <p className="mt-3 text-sm text-gray-500">
                {results.length > 0
                  ? <><span className="font-semibold text-gray-800">{results.length}</span> résultat{results.length > 1 ? 's' : ''} pour <span className="font-semibold text-blue-600">&ldquo;{query}&rdquo;</span></>
                  : <>Aucun résultat pour <span className="font-semibold text-blue-600">&ldquo;{query}&rdquo;</span></>
                }
              </p>
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* No query state */}
          {!query && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Recherchez sur Linfo.be</h1>
              <p className="text-gray-500 mb-8">Trouvez des entreprises, services et professionnels partout en Belgique.</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Restaurant', 'Taxi', 'Avocat', 'Médecin', 'Renovation', 'Gym'].map((term) => (
                  <a
                    key={term}
                    href={`/recherche?q=${encodeURIComponent(term)}`}
                    className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-sm"
                  >
                    {term}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {query && results.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">😕</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Aucun résultat trouvé</h2>
              <p className="text-gray-500 mb-6">Essayez un autre mot-clé ou parcourez nos catégories.</p>
              <div className="flex flex-wrap justify-center gap-3">
                {silos.filter((s) => s.dbCategory).slice(0, 6).map((silo) => (
                  <Link
                    key={silo.slug}
                    href={`/bruxelles/${silo.slug}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-sm"
                  >
                    <span>{silo.icon}</span>
                    <span>{silo.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {query && results.length > 0 && (
            <div className="space-y-8">
              {Object.entries(grouped).map(([citySlug, businesses]) => (
                <section key={citySlug}>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                    <MapPinIcon size={18} className="text-blue-500" />
                    {getCityName(citySlug)}
                    <span className="text-sm font-normal text-gray-400 ml-1">({businesses.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {businesses.map((biz) => {
                      const silo = getSiloForBusiness(biz.category, biz.subcategory)
                      const siloSub = silo?.subcategories.find(
                        (s) => s.dbSubcategory === biz.subcategory || s.dbCategory === biz.category
                      )
                      const href = silo
                        ? `/${biz.city}/${silo.slug}/${siloSub?.slug ?? ''}`
                        : `/${biz.city}`

                      return (
                        <Link
                          key={biz.object_id}
                          href={`/company/${biz.slug}`}
                          className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all overflow-hidden group"
                        >
                          {biz.image_url && (
                            <div className="h-36 overflow-hidden bg-gray-100">
                              <img
                                src={biz.image_url}
                                alt={biz.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {biz.name}
                              </h3>
                              {biz.rating && Number(biz.rating) > 0 && (
                                <span className="shrink-0 text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                  ★ {Number(biz.rating).toFixed(1)}
                                </span>
                              )}
                            </div>
                            {biz.short_description && (
                              <p className="text-xs text-gray-500 line-clamp-2 mb-2">{biz.short_description}</p>
                            )}
                            <div className="flex items-center gap-2 flex-wrap">
                              {silo && (
                                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#f0f4ff', color: '#3b5bdb' }}>
                                  {silo.icon} {siloSub?.name ?? silo.name}
                                </span>
                              )}
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <MapPinIcon size={11} />
                                {getCityName(biz.city)}
                              </span>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

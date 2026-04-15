import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import BusinessCard from '@/components/BusinessCard'
import { silos, siloSlugs, getSiloBySlug } from '@/data/silos'
import { cities, getCityBySlug } from '@/data/cities'
import {
  getTopBusinessesForSilo,
  getBusinessCountsBySiloForCity,
  parseSeoSlug,
} from '@/services/businesses'

export const dynamicParams = false

export async function generateStaticParams() {
  // All city slugs + all silo slugs
  const params: { slug: string }[] = []
  for (const city of cities) params.push({ slug: city.slug })
  for (const silo of silos) params.push({ slug: silo.slug })
  return params
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params

  const city = getCityBySlug(slug)
  if (city) {
    return {
      title: `Entreprises à ${city.name} — Annuaire linfo.be`,
      description: `Trouvez les meilleures entreprises locales à ${city.name} : transport, sport, construction, services et plus encore.`,
      alternates: { canonical: `https://linfo.be/${slug}` },
    }
  }

  const silo = getSiloBySlug(slug)
  if (silo) {
    return {
      title: `${silo.name} en Belgique — Annuaire linfo.be`,
      description: silo.description,
      alternates: { canonical: `https://linfo.be/${slug}` },
    }
  }

  return {}
}

export default async function SlugPage(props: PageProps) {
  const { slug } = await props.params

  // City hub page
  const city = getCityBySlug(slug)
  if (city) {
    const counts = await getBusinessCountsBySiloForCity(slug)

    return (
      <>
        <Navbar />

        {/* Hero */}
        <div className="border-b border-gray-100 bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-12 text-white">
          <div className="mx-auto max-w-5xl">
            <p className="mb-2 text-sm text-blue-200 uppercase tracking-wider">Annuaire local</p>
            <h1 className="text-4xl font-extrabold mb-3">Entreprises à {city.name}</h1>
            <p className="max-w-2xl text-blue-100">{city.description}</p>
          </div>
        </div>

        <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <nav className="mb-8 flex gap-2 text-sm text-gray-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600">Accueil</Link>
            <span>/</span>
            <span className="text-gray-700">{city.name}</span>
          </nav>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Parcourir par secteur</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {silos.map((silo) => (
              <Link
                key={silo.slug}
                href={`/${slug}/${silo.slug}`}
                className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${silo.bgColor}`}>
                  {silo.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {silo.name}
                  </h3>
                  {counts[silo.slug] != null && counts[silo.slug] > 0 ? (
                    <p className="text-xs text-gray-500 mt-0.5">{counts[silo.slug]} entreprise{counts[silo.slug] > 1 ? 's' : ''}</p>
                  ) : (
                    <p className="text-xs text-gray-400 mt-0.5">{silo.subcategories.length} sous-catégories</p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Other cities */}
          <div className="mt-12 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-gray-900">Autres villes en Belgique</h2>
            <div className="flex flex-wrap gap-2">
              {cities.filter((c) => c.slug !== slug).map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  📍 {c.name}
                </Link>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </>
    )
  }

  // Silo hub page
  const silo = getSiloBySlug(slug)
  if (silo) {
    const topBusinesses = await getTopBusinessesForSilo(slug, 6)

    return (
      <>
        <Navbar />

        {/* Hero */}
        <div className={`border-b px-4 py-12 ${silo.bgColor}`}>
          <div className="mx-auto max-w-5xl">
            <p className="mb-2 text-sm text-gray-500 uppercase tracking-wider">Secteur</p>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-5xl">{silo.icon}</span>
              <h1 className={`text-4xl font-extrabold ${silo.color}`}>{silo.name}</h1>
            </div>
            <p className="max-w-2xl text-gray-600">{silo.description}</p>
          </div>
        </div>

        <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <nav className="mb-8 flex gap-2 text-sm text-gray-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600">Accueil</Link>
            <span>/</span>
            <span className="text-gray-700">{silo.name}</span>
          </nav>

          {/* Subcategories */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Sous-catégories</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {silo.subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/${slug}/${sub.slug}`}
                  className="group flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
                >
                  <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm ${silo.bgColor} ${silo.color} font-bold`}>
                    {sub.name.charAt(0)}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{sub.name}</p>
                    <p className="text-sm text-gray-500">{sub.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* By city */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">{silo.name} par ville</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}/${slug}`}
                  className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
                >
                  <p className="text-2xl mb-1">📍</p>
                  <p className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">{city.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{city.region}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Top businesses (if DB data exists) */}
          {topBusinesses.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Meilleures entreprises</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topBusinesses.map((b) => (
                  <BusinessCard key={b.objectID} business={b} />
                ))}
              </div>
            </section>
          )}

          {/* SEO text */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tout savoir sur {silo.name} en Belgique
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              {silo.description} Retrouvez sur linfo.be l&apos;annuaire complet des professionnels
              du secteur <strong>{silo.name}</strong> en Belgique. Comparez les prestataires,
              consultez les avis clients et contactez directement les entreprises qui correspondent
              à vos besoins.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Que vous soyez à Bruxelles, Anvers, Gand ou Liège, notre annuaire recense les
              meilleurs professionnels de {silo.name.toLowerCase()} avec leurs coordonnées
              complètes, notes et descriptions détaillées.
            </p>
          </div>

          {/* Internal links to other silos */}
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Autres secteurs</h3>
            <div className="flex flex-wrap gap-2">
              {silos.filter((s) => s.slug !== slug).slice(0, 8).map((s) => (
                <Link
                  key={s.slug}
                  href={`/${s.slug}`}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  {s.icon} {s.name}
                </Link>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </>
    )
  }

  notFound()
}

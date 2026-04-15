import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import BusinessCard from '@/components/BusinessCard'
import BusinessList from '@/components/BusinessList'
import { silos, getSiloBySlug, getSiloSubcategoryInSilo } from '@/data/silos'
import { cities, getCityBySlug } from '@/data/cities'
import {
  getBusinessesForSiloCity,
  getBusinessesForSiloSubcategoryCity,
  getTopBusinessesForSilo,
} from '@/services/businesses'

export const dynamicParams = false

export async function generateStaticParams() {
  const params: { slug: string; sub: string }[] = []

  // city × silo: /bruxelles/automobile-transport
  for (const city of cities) {
    for (const silo of silos) {
      params.push({ slug: city.slug, sub: silo.slug })
    }
  }

  // silo × subcategory: /automobile-transport/taxi
  for (const silo of silos) {
    for (const sub of silo.subcategories) {
      params.push({ slug: silo.slug, sub: sub.slug })
    }
  }

  return params
}

interface PageProps {
  params: Promise<{ slug: string; sub: string }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug, sub } = await props.params

  const city = getCityBySlug(slug)
  if (city) {
    const silo = getSiloBySlug(sub)
    if (!silo) return {}
    return {
      title: `${silo.name} à ${city.name} — Annuaire linfo.be`,
      description: `Trouvez les meilleures entreprises de ${silo.name.toLowerCase()} à ${city.name}. ${silo.description}`,
      alternates: { canonical: `https://linfo.be/${slug}/${sub}` },
      openGraph: {
        title: `${silo.name} à ${city.name}`,
        description: silo.description,
        url: `https://linfo.be/${slug}/${sub}`,
      },
    }
  }

  const silo = getSiloBySlug(slug)
  if (silo) {
    const subcategory = getSiloSubcategoryInSilo(slug, sub)
    if (!subcategory) return {}
    return {
      title: `${subcategory.name} en Belgique — ${silo.name} — linfo.be`,
      description: subcategory.description,
      alternates: { canonical: `https://linfo.be/${slug}/${sub}` },
    }
  }

  return {}
}

export default async function SubPage(props: PageProps) {
  const { slug, sub } = await props.params

  // ── City × Silo: /bruxelles/automobile-transport ──
  const city = getCityBySlug(slug)
  if (city) {
    const silo = getSiloBySlug(sub)
    if (!silo) notFound()

    const businesses = await getBusinessesForSiloCity(sub, slug)

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${silo.name} à ${city.name}`,
      description: silo.description,
      numberOfItems: businesses.length,
      itemListElement: businesses.slice(0, 10).map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'LocalBusiness',
          name: b.name,
          description: b.shortDescription,
          telephone: b.phone,
          address: {
            '@type': 'PostalAddress',
            addressLocality: city.name,
            addressCountry: 'BE',
          },
        },
      })),
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Navbar />

        {/* Header */}
        <div className="border-b border-gray-100 bg-white px-4 py-5">
          <div className="mx-auto max-w-7xl">
            <nav className="mb-2 flex flex-wrap gap-2 text-sm text-gray-400" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-blue-600">Accueil</Link>
              <span>/</span>
              <Link href={`/${slug}`} className="hover:text-blue-600">{city.name}</Link>
              <span>/</span>
              <span className="text-gray-700">{silo.name}</span>
            </nav>
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${silo.bgColor}`}>
                {silo.icon}
              </span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {silo.name} à {city.name}
                </h1>
                <p className="text-sm text-gray-500">{businesses.length} entreprise{businesses.length !== 1 ? 's' : ''} trouvée{businesses.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
            {/* Sidebar */}
            <aside className="flex flex-col gap-4">
              {/* Subcategories */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-3 font-semibold text-gray-900">Sous-catégories</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href={`/${slug}/${sub}`}
                      className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700"
                    >
                      {silo.icon} Tout {silo.name}
                    </Link>
                  </li>
                  {silo.subcategories.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/${slug}/${sub}/${s.slug}`}
                        className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Other cities */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-3 font-semibold text-gray-900">Autres villes</h3>
                <ul className="space-y-1">
                  {cities.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/${c.slug}/${sub}`}
                        className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                          c.slug === slug
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
                <h3 className="font-semibold mb-2">Votre entreprise ici ?</h3>
                <p className="text-sm text-blue-100 mb-3">Inscrivez-vous gratuitement.</p>
                <Link
                  href="/ajouter-entreprise"
                  className="block text-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  Ajouter mon entreprise
                </Link>
              </div>
            </aside>

            {/* Listings */}
            <div>
              {businesses.length > 0 ? (
                <BusinessList businesses={businesses} />
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
                  <p className="text-gray-500 text-lg mb-2">Aucune entreprise pour le moment</p>
                  <p className="text-gray-400 text-sm">
                    Soyez le premier à référencer votre activité {silo.name.toLowerCase()} à {city.name}.
                  </p>
                  <Link
                    href="/ajouter-entreprise"
                    className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    Ajouter mon entreprise
                  </Link>
                </div>
              )}

              {/* Internal links: subcategories */}
              <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-semibold text-gray-900">
                  Spécialisations à {city.name}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {silo.subcategories.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/${slug}/${sub}/${s.slug}`}
                      className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </>
    )
  }

  // ── Silo × Subcategory: /automobile-transport/taxi ──
  const silo = getSiloBySlug(slug)
  if (silo) {
    const subcategory = getSiloSubcategoryInSilo(slug, sub)
    if (!subcategory) notFound()

    return (
      <>
        <Navbar />

        {/* Header */}
        <div className={`border-b px-4 py-10 ${silo.bgColor}`}>
          <div className="mx-auto max-w-5xl">
            <nav className="mb-3 flex flex-wrap gap-2 text-sm text-gray-400" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-blue-600">Accueil</Link>
              <span>/</span>
              <Link href={`/${slug}`} className={`hover:text-blue-600 ${silo.color}`}>{silo.name}</Link>
              <span>/</span>
              <span className="text-gray-700">{subcategory.name}</span>
            </nav>
            <h1 className={`text-3xl font-extrabold mb-2 ${silo.color}`}>{subcategory.name}</h1>
            <p className="text-gray-600 max-w-2xl">{subcategory.description}</p>
          </div>
        </div>

        <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Choose city */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">
              Trouver un prestataire {subcategory.name.toLowerCase()} par ville
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}/${slug}/${sub}`}
                  className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
                >
                  <p className="text-2xl mb-2">📍</p>
                  <p className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">{city.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{city.region}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Other subcategories in same silo */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Autres spécialisations en {silo.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {silo.subcategories.filter((s) => s.slug !== sub).map((s) => (
                <Link
                  key={s.slug}
                  href={`/${slug}/${s.slug}`}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </section>

          {/* SEO content */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {subcategory.name} en Belgique
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              {subcategory.description} Retrouvez sur linfo.be tous les professionnels
              de <strong>{subcategory.name.toLowerCase()}</strong> en Belgique,
              disponibles dans les principales villes belges.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Comparez les prestataires, consultez les avis clients authentiques et
              contactez directement les entreprises. Notre annuaire est mis à jour
              régulièrement pour vous garantir des informations fiables.
            </p>
          </div>
        </main>

        <Footer />
      </>
    )
  }

  notFound()
}

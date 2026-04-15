import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import BusinessList from '@/components/BusinessList'
import { silos, getSiloBySlug, getSiloSubcategoryInSilo } from '@/data/silos'
import { cities, getCityBySlug } from '@/data/cities'
import { getBusinessesForSiloSubcategoryCity } from '@/services/businesses'

export const dynamicParams = false

export async function generateStaticParams() {
  const params: { slug: string; sub: string; leaf: string }[] = []

  // city × silo × subcategory: /bruxelles/automobile-transport/taxi
  for (const city of cities) {
    for (const silo of silos) {
      for (const sub of silo.subcategories) {
        params.push({ slug: city.slug, sub: silo.slug, leaf: sub.slug })
      }
    }
  }

  return params
}

interface PageProps {
  params: Promise<{ slug: string; sub: string; leaf: string }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug, sub, leaf } = await props.params

  const city = getCityBySlug(slug)
  const silo = getSiloBySlug(sub)
  const subcategory = silo ? getSiloSubcategoryInSilo(sub, leaf) : undefined

  if (!city || !silo || !subcategory) return {}

  return {
    title: `${subcategory.name} à ${city.name} — ${silo.name} — linfo.be`,
    description: `${subcategory.description} Retrouvez les meilleures entreprises de ${subcategory.name.toLowerCase()} à ${city.name} avec avis et coordonnées.`,
    alternates: { canonical: `https://linfo.be/${slug}/${sub}/${leaf}` },
    openGraph: {
      title: `${subcategory.name} à ${city.name}`,
      description: subcategory.description,
      url: `https://linfo.be/${slug}/${sub}/${leaf}`,
    },
  }
}

export default async function LeafPage(props: PageProps) {
  const { slug, sub, leaf } = await props.params

  const city = getCityBySlug(slug)
  const silo = getSiloBySlug(sub)
  const subcategory = silo ? getSiloSubcategoryInSilo(sub, leaf) : undefined

  if (!city || !silo || !subcategory) notFound()

  const businesses = await getBusinessesForSiloSubcategoryCity(sub, leaf, slug)

  // Schema.org structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${subcategory.name} à ${city.name}`,
    description: subcategory.description,
    numberOfItems: businesses.length,
    itemListElement: businesses.slice(0, 10).map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: b.name,
        description: b.shortDescription,
        telephone: b.phone,
        url: b.website,
        address: {
          '@type': 'PostalAddress',
          addressLocality: city.name,
          addressCountry: 'BE',
        },
        aggregateRating: b.reviewCount > 0
          ? { '@type': 'AggregateRating', ratingValue: b.rating, reviewCount: b.reviewCount }
          : undefined,
      },
    })),
  }

  // BreadcrumbList schema
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://linfo.be' },
      { '@type': 'ListItem', position: 2, name: city.name, item: `https://linfo.be/${slug}` },
      { '@type': 'ListItem', position: 3, name: silo.name, item: `https://linfo.be/${slug}/${sub}` },
      { '@type': 'ListItem', position: 4, name: subcategory.name, item: `https://linfo.be/${slug}/${sub}/${leaf}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />

      <Navbar />

      {/* Header */}
      <div className="border-b border-gray-100 bg-white px-4 py-5">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-2 flex flex-wrap gap-2 text-sm text-gray-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600">Accueil</Link>
            <span>/</span>
            <Link href={`/${slug}`} className="hover:text-blue-600">{city.name}</Link>
            <span>/</span>
            <Link href={`/${slug}/${sub}`} className={`hover:text-blue-600 ${silo.color}`}>{silo.name}</Link>
            <span>/</span>
            <span className="text-gray-700">{subcategory.name}</span>
          </nav>
          <div className="flex items-center gap-3">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${silo.bgColor}`}>
              {silo.icon}
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {subcategory.name} à {city.name}
              </h1>
              <p className="text-sm text-gray-500">
                {businesses.length} entreprise{businesses.length !== 1 ? 's' : ''} trouvée{businesses.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            {/* Subcategories in same silo */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold text-gray-900">{silo.name}</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href={`/${slug}/${sub}`}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    ← Tout voir
                  </Link>
                </li>
                {silo.subcategories.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/${slug}/${sub}/${s.slug}`}
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                        s.slug === leaf
                          ? 'bg-blue-50 font-semibold text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Same subcategory in other cities */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold text-gray-900">Autres villes</h3>
              <ul className="space-y-1">
                {cities.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/${c.slug}/${sub}/${leaf}`}
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

            {/* Other silos */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold text-gray-900">Autres secteurs</h3>
              <ul className="space-y-1">
                {silos.filter((s) => s.slug !== sub).slice(0, 6).map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/${slug}/${s.slug}`}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      {s.icon} {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="rounded-2xl bg-blue-600 p-5 text-white">
              <h3 className="font-semibold mb-2">Votre entreprise ici ?</h3>
              <p className="text-sm text-blue-100 mb-3">Référencez-vous gratuitement sur linfo.be.</p>
              <Link
                href="/ajouter-entreprise"
                className="block text-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
              >
                Ajouter mon entreprise
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <div>
            {/* Description */}
            <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-gray-600">{subcategory.description}</p>
            </div>

            {/* Listings */}
            {businesses.length > 0 ? (
              <BusinessList businesses={businesses} />
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
                <p className="text-gray-500 text-lg mb-2">Aucune entreprise pour le moment</p>
                <p className="text-gray-400 text-sm mb-4">
                  Soyez le premier à référencer votre activité {subcategory.name.toLowerCase()} à {city.name}.
                </p>
                <Link
                  href="/ajouter-entreprise"
                  className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Ajouter mon entreprise
                </Link>
              </div>
            )}

            {/* SEO text block */}
            <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {subcategory.name} à {city.name} : tout ce qu&apos;il faut savoir
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                {subcategory.description} À {city.name}, retrouvez sur linfo.be l&apos;annuaire
                complet des professionnels spécialisés en{' '}
                <strong>{subcategory.name.toLowerCase()}</strong>. Consultez les avis clients,
                comparez les offres et contactez directement les prestataires.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Tous les professionnels listés ont été vérifiés. Que vous soyez
                particulier ou entreprise, vous trouverez le prestataire idéal pour vos
                besoins à {city.name} et dans la région.
              </p>
            </div>

            {/* Links to same subcategory in other cities */}
            <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">
                {subcategory.name} dans d&apos;autres villes
              </h3>
              <div className="flex flex-wrap gap-2">
                {cities.filter((c) => c.slug !== slug).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}/${sub}/${leaf}`}
                    className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                  >
                    📍 {c.name}
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

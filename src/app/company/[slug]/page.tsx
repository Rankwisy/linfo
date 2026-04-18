import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { StarIcon, PhoneIcon, MailIcon, GlobeIcon, MapPinIcon, ChevronRightIcon } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getCityBySlug } from '@/data/cities'
import { cities } from '@/data/cities'
import { silos } from '@/data/silos'
import { Icon } from '@/components/ui/icon'
import { getSiloIcon } from '@/lib/icon-registry'
import { getBusinessBySlugAsync, getAllBusinessSlugs, getRelatedBusinesses } from '@/services/businesses'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getAllBusinessSlugs()
  return slugs.map((slug) => ({ slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSiloForBusiness(category: string, subcategory: string) {
  const silo = silos.find((s) => s.dbCategory === category)
  const siloSub = silo?.subcategories.find((s) => s.dbSubcategory === subcategory)
  return { silo: silo ?? null, siloSub: siloSub ?? null }
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text
  return text.slice(0, text.lastIndexOf(' ', max)) + '…'
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params
  const business = await getBusinessBySlugAsync(slug)
  if (!business) return {}

  const city = getCityBySlug(business.city)
  const { silo, siloSub } = getSiloForBusiness(business.category, business.subcategory)

  const cityName    = city?.nameFr ?? business.city
  const subcatName  = siloSub?.name ?? business.subcategory
  const siloName    = silo?.name ?? business.category

  // Title: "Name — Subcategory à City | linfo.be" (≤ 60 chars ideal)
  const title = `${business.name} — ${subcatName} à ${cityName} | linfo.be`

  // Description: 140–155 chars
  const rawDesc = business.shortDescription || business.description || ''
  const snippet = rawDesc ? truncate(rawDesc, 130) : ''
  const description = snippet
    ? `${business.name} : ${snippet} Coordonnées, avis et itinéraire sur linfo.be.`
    : `Découvrez ${business.name}, ${subcatName} à ${cityName}. Coordonnées, horaires et avis sur linfo.be.`

  const canonicalUrl = `https://linfo.be/company/${slug}`
  const ogImage = business.imageUrl ?? undefined

  return {
    title,
    description,
    keywords: [business.name, subcatName, siloName, cityName, 'Belgique', 'linfo.be'].join(', '),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${business.name} — ${subcatName} à ${cityName}`,
      description,
      url: canonicalUrl,
      siteName: 'linfo.be',
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage, alt: business.name }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${business.name} — ${subcatName} à ${cityName}`,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function CompanyPage(props: PageProps) {
  const { slug } = await props.params
  const business = await getBusinessBySlugAsync(slug)
  if (!business) notFound()

  const city                   = getCityBySlug(business.city)
  const { silo, siloSub }      = getSiloForBusiness(business.category, business.subcategory)
  const { icon, color, bgColor } = getSiloIcon(silo?.slug ?? '')

  const cityName   = city?.nameFr ?? business.city
  const subcatName = siloSub?.name ?? business.subcategory
  const siloName   = silo?.name ?? business.category

  // Canonical page URLs
  const siloUrl    = silo    ? `/${business.city}/${silo.slug}`               : `/${business.city}`
  const subcatUrl  = siloSub ? `/${business.city}/${silo!.slug}/${siloSub.slug}` : siloUrl

  // Related businesses (same subcategory + city)
  const related = await getRelatedBusinesses(business.subcategory, business.city, business.objectID)

  // Schema.org: LocalBusiness
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description || business.shortDescription,
    telephone: business.phone,
    email: business.email,
    url: business.website,
    image: business.imageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: cityName,
      addressCountry: 'BE',
    },
    ...(business.rating > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: business.rating,
        reviewCount: business.reviewCount || 1,
      },
    } : {}),
    ...(business.lat && business.lng ? {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: business.lat,
        longitude: business.lng,
      },
    } : {}),
  }

  // Schema.org: BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://linfo.be' },
      { '@type': 'ListItem', position: 2, name: siloName,  item: `https://linfo.be${siloUrl}` },
      { '@type': 'ListItem', position: 3, name: subcatName, item: `https://linfo.be${subcatUrl}` },
      { '@type': 'ListItem', position: 4, name: business.name, item: `https://linfo.be/company/${slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Navbar />

      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <div className="border-b border-gray-100 bg-white px-4 py-3">
        <div className="mx-auto max-w-5xl">
          <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
            <ChevronRightIcon size={14} />
            {silo && (
              <>
                <Link href={siloUrl} className="hover:text-blue-600 transition-colors">{silo.name}</Link>
                <ChevronRightIcon size={14} />
              </>
            )}
            {siloSub && (
              <>
                <Link href={subcatUrl} className="hover:text-blue-600 transition-colors">{siloSub.name}</Link>
                <ChevronRightIcon size={14} />
              </>
            )}
            <span className="text-gray-700 font-medium truncate max-w-[200px]">{business.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Hero image ─────────────────────────────────────────────────── */}
      {business.imageUrl && (
        <div className="relative h-56 w-full sm:h-72 overflow-hidden bg-gray-100">
          <Image src={business.imageUrl} alt={business.name} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* ── Left column ──────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Business header */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden flex items-center justify-center ${business.imageUrl ? '' : bgColor}`}>
                  {business.imageUrl ? (
                    <Image src={business.imageUrl} alt={business.name} fill className="object-cover" />
                  ) : (
                    <Icon icon={icon} size="lg" className={color} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 leading-tight">{business.name}</h1>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {silo && (
                          <Link href={siloUrl}
                            className="rounded-full bg-blue-50 px-3 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors">
                            {silo.name}
                          </Link>
                        )}
                        {siloSub && (
                          <Link href={subcatUrl}
                            className="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors">
                            {siloSub.name}
                          </Link>
                        )}
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPinIcon size={12} strokeWidth={1.75} aria-hidden />
                          {cityName}
                        </span>
                      </div>
                    </div>
                    {business.featured && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 shrink-0">
                        En vedette
                      </span>
                    )}
                  </div>

                  {/* Stars */}
                  {business.rating > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon key={star} size={16} strokeWidth={1.75}
                            className={star <= Math.round(business.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-gray-200 text-gray-200'} />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{business.rating.toFixed(1)}</span>
                      {business.reviewCount > 0 && (
                        <span className="text-sm text-gray-400">({business.reviewCount} avis)</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {(business.description || business.shortDescription) && (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">À propos</h2>
                <div className="prose">
                  {(business.description || business.shortDescription).split('\n').filter(Boolean).map((para, i) => (
                    <p key={i} className="mb-3 text-gray-600 leading-relaxed last:mb-0">{para.trim()}</p>
                  ))}
                </div>
                {business.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {business.tags.map((tag) => (
                      <span key={tag}
                        className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Address / map */}
            {business.address && (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Localisation</h2>
                <div className="flex items-center gap-2 mb-4 text-gray-600">
                  <MapPinIcon size={16} strokeWidth={1.75} className="text-blue-600 shrink-0" aria-hidden />
                  <span>{business.address}</span>
                </div>
                {business.lat && business.lng && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${business.lat},${business.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    <MapPinIcon size={16} strokeWidth={1.75} aria-hidden />
                    Voir sur Google Maps
                  </a>
                )}
              </div>
            )}

            {/* Related businesses */}
            {related.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-xl font-semibold text-gray-900">
                  {subcatName} à {cityName}
                </h2>
                <p className="mb-4 text-sm text-gray-500">Entreprises similaires dans la même ville</p>
                <div className="space-y-3">
                  {related.map((b) => (
                    <Link key={b.objectID} href={`/company/${b.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 hover:border-blue-200 hover:bg-blue-50 transition-colors group">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bgColor}`}>
                        <Icon icon={icon} size="sm" className={color} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-700">{b.name}</p>
                        {b.shortDescription && (
                          <p className="text-xs text-gray-500 truncate">{b.shortDescription}</p>
                        )}
                      </div>
                      <ChevronRightIcon size={16} className="ml-auto shrink-0 text-gray-300 group-hover:text-blue-400" />
                    </Link>
                  ))}
                </div>
                <Link href={subcatUrl}
                  className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-blue-600 hover:underline">
                  Voir tous les {subcatName} à {cityName} →
                </Link>
              </div>
            )}

            {/* ── Internal links: other cities ──────────────────────────── */}
            {silo && (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  {siloSub?.name ?? silo.name} dans d&apos;autres villes
                </h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {cities.map((c) => {
                    const url = siloSub
                      ? `/${c.slug}/${silo.slug}/${siloSub.slug}`
                      : `/${c.slug}/${silo.slug}`
                    const isActive = c.slug === business.city
                    return (
                      <Link key={c.slug} href={url}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                          isActive
                            ? 'border-blue-200 bg-blue-50 text-blue-700 font-semibold'
                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-blue-200 hover:text-blue-600'
                        }`}>
                        <MapPinIcon size={13} strokeWidth={1.75} aria-hidden />
                        {c.nameFr}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Internal links: explore silo subcategories ────────────── */}
            {silo && silo.subcategories.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Explorer {silo.name} à {cityName}
                </h2>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {silo.subcategories.map((sub) => {
                    const url = `/${business.city}/${silo.slug}/${sub.slug}`
                    const isActive = sub.dbSubcategory === business.subcategory
                    return (
                      <Link key={sub.slug} href={url}
                        className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm transition-colors ${
                          isActive
                            ? 'border-blue-200 bg-blue-50 text-blue-700 font-semibold'
                            : 'border-gray-100 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600'
                        }`}>
                        <Icon icon={getSiloIcon(silo.slug).icon} size="sm"
                          className={isActive ? 'text-blue-600' : color} />
                        {sub.name}
                      </Link>
                    )
                  })}
                </div>
                <Link href={siloUrl}
                  className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-blue-600 hover:underline">
                  Voir tout {silo.name} à {cityName} →
                </Link>
              </div>
            )}

          </div>

          {/* ── Right column: contact card ────────────────────────────────── */}
          <div className="space-y-4">
            <div className="sticky top-6 space-y-4">

              {/* Contact */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-semibold text-gray-900 text-lg">Coordonnées</h2>
                <div className="space-y-3">
                  {business.phone && (
                    <a href={`tel:${business.phone}`}
                      className="flex w-full items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 transition-colors">
                      <PhoneIcon size={18} strokeWidth={1.75} aria-hidden />
                      {business.phone}
                    </a>
                  )}
                  {business.email && (
                    <a href={`mailto:${business.email}`}
                      className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-gray-700 text-sm hover:border-blue-300 hover:text-blue-600 transition-colors">
                      <MailIcon size={16} strokeWidth={1.75} aria-hidden />
                      <span className="truncate">{business.email}</span>
                    </a>
                  )}
                  {business.website && (
                    <a href={business.website} target="_blank" rel="noopener noreferrer"
                      className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-gray-700 text-sm hover:border-blue-300 hover:text-blue-600 transition-colors">
                      <GlobeIcon size={16} strokeWidth={1.75} aria-hidden />
                      Visiter le site web
                    </a>
                  )}
                  {business.address && (
                    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                      <MapPinIcon size={16} strokeWidth={1.75} className="shrink-0 mt-0.5 text-blue-500" aria-hidden />
                      <span>{business.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Category quick links */}
              {silo && (
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Catégorie
                  </p>
                  <Link href={siloUrl}
                    className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    <Icon icon={icon} size="sm" className={color} />
                    {silo.name}
                  </Link>
                  {siloSub && (
                    <Link href={subcatUrl}
                      className="mt-2 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                      <ChevronRightIcon size={14} className="text-gray-400" />
                      {siloSub.name}
                    </Link>
                  )}
                </div>
              )}

              {/* CTA */}
              <div className="rounded-2xl bg-blue-600 p-5 text-white text-center">
                <p className="font-semibold mb-1">Vous êtes propriétaire?</p>
                <p className="text-sm text-blue-100 mb-3">Revendiquez cette fiche gratuitement.</p>
                <Link href="/ajouter-entreprise"
                  className="block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors">
                  Revendiquer
                </Link>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

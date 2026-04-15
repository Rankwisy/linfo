import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { StarIcon, PhoneIcon, MailIcon, GlobeIcon, MapPinIcon } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getCategoryBySlug, getSubcategoryBySlug } from '@/data/categories'
import { getCityBySlug } from '@/data/cities'
import { getBusinessBySlugAsync, getAllBusinessSlugs, getRelatedBusinesses } from '@/services/businesses'

export const revalidate = 3600 // ISR: rebuild pages every hour

export async function generateStaticParams() {
  const slugs = await getAllBusinessSlugs()
  return slugs.map((slug) => ({ slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params
  const business = await getBusinessBySlugAsync(slug)
  if (!business) return {}

  const city = getCityBySlug(business.city)
  const sub = getSubcategoryBySlug(business.subcategory)

  return {
    title: `${business.name} — ${sub?.subcategory.name ?? ''} à ${city?.name ?? ''}`,
    description: business.shortDescription,
    alternates: { canonical: `https://linfo.be/company/${slug}` },
    openGraph: {
      title: business.name,
      description: business.shortDescription,
      url: `https://linfo.be/company/${slug}`,
    },
  }
}

export default async function CompanyPage(props: PageProps) {
  const { slug } = await props.params
  const business = await getBusinessBySlugAsync(slug)
  if (!business) notFound()

  const city = getCityBySlug(business.city)
  const cat = getCategoryBySlug(business.category)
  const sub = getSubcategoryBySlug(business.subcategory)

  // Schema.org LocalBusiness structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description,
    telephone: business.phone,
    email: business.email,
    url: business.website,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: city?.name,
      addressCountry: 'BE',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: business.rating,
      reviewCount: business.reviewCount,
    },
  }

  // Related businesses (same subcategory + city)
  const related = await getRelatedBusinesses(business.subcategory, business.city, business.objectID)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white px-4 py-4">
        <div className="mx-auto max-w-5xl">
          <nav className="flex gap-2 text-sm text-gray-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600">Accueil</Link>
            <span>/</span>
            {cat && (
              <>
                <Link href={`/${cat.slug}-${business.city}`} className="hover:text-blue-600 capitalize">
                  {cat.name}
                </Link>
                <span>/</span>
              </>
            )}
            {sub && (
              <>
                <Link href={`/${sub.subcategory.slug}-${business.city}`} className="hover:text-blue-600">
                  {sub.subcategory.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-700 truncate max-w-[200px]">{business.name}</span>
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left: Main info */}
          <div className="space-y-6">
            {/* Business header card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold text-2xl">
                  {business.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {cat && (
                          <Link
                            href={`/${cat.slug}-${business.city}`}
                            className="rounded-full bg-blue-50 px-3 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                          >
                            {cat.name}
                          </Link>
                        )}
                        {sub && (
                          <Link
                            href={`/${sub.subcategory.slug}-${business.city}`}
                            className="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
                          >
                            {sub.subcategory.name}
                          </Link>
                        )}
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPinIcon size={12} />
                          {city?.name ?? business.city}
                        </span>
                      </div>
                    </div>
                    {business.featured && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        En vedette
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          size={16}
                          className={
                            star <= Math.round(business.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-gray-200 text-gray-200'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{business.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-400">({business.reviewCount} avis)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">À propos</h2>
              {business.description.split('\n').map((para, i) => (
                <p key={i} className="mb-3 text-gray-600 leading-relaxed last:mb-0">
                  {para.trim()}
                </p>
              ))}

              {/* Tags */}
              {business.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {business.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-500"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Map placeholder */}
            {(business.lat && business.lng) && (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Localisation</h2>
                <div className="flex items-center gap-2 mb-3 text-gray-600">
                  <MapPinIcon size={16} className="text-blue-600 shrink-0" />
                  <span>{business.address}</span>
                </div>
                <div className="h-48 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                  <div className="text-center text-gray-400 text-sm">
                    <MapPinIcon size={32} className="mx-auto mb-2 text-blue-300" />
                    <p>Carte disponible</p>
                    <p className="text-xs mt-1">
                      {business.lat?.toFixed(4)}, {business.lng?.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Related businesses */}
            {related.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Entreprises similaires à {city?.name}
                </h2>
                <div className="space-y-3">
                  {related.map((b) => (
                    <Link
                      key={b.objectID}
                      href={`/company/${b.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-semibold">
                        {b.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{b.name}</p>
                        <p className="text-xs text-gray-500">{b.shortDescription}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Contact card */}
          <div className="space-y-4">
            <div className="sticky top-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-gray-900 text-lg">Coordonnées</h2>

              <div className="space-y-3">
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="flex w-full items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <PhoneIcon size={18} />
                    {business.phone}
                  </a>
                )}

                {business.email && (
                  <a
                    href={`mailto:${business.email}`}
                    className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-gray-700 text-sm hover:border-blue-300 hover:text-blue-600 transition-colors"
                  >
                    <MailIcon size={16} />
                    <span className="truncate">{business.email}</span>
                  </a>
                )}

                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-gray-700 text-sm hover:border-blue-300 hover:text-blue-600 transition-colors"
                  >
                    <GlobeIcon size={16} />
                    Visiter le site web
                  </a>
                )}

                {business.address && (
                  <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    <MapPinIcon size={16} className="shrink-0 mt-0.5 text-blue-500" />
                    <span>{business.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA for listing */}
            <div className="rounded-2xl bg-blue-600 p-5 text-white text-center">
              <p className="font-semibold mb-1">Vous êtes propriétaire?</p>
              <p className="text-sm text-blue-100 mb-3">Revendiquez cette fiche gratuitement.</p>
              <Link
                href="/ajouter-entreprise"
                className="block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
              >
                Revendiquer
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

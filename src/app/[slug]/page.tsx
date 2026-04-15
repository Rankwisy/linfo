import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Sidebar from '@/components/Sidebar'
import BusinessList from '@/components/BusinessList'
import {
  getAllSeoPageSlugs,
  parseSeoSlug,
  getBusinessesForCategoryCity,
  getBusinessesForSubcategoryCity,
} from '@/services/businesses'
import { getCategoryBySlug, getSubcategoryBySlug } from '@/data/categories'
import { getCityBySlug } from '@/data/cities'
import Link from 'next/link'

export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = getAllSeoPageSlugs()
  return slugs.map((slug) => ({ slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params
  const parsed = parseSeoSlug(slug)
  if (!parsed) return {}

  const city = getCityBySlug(parsed.citySlug)

  if (parsed.type === 'category-city') {
    const cat = getCategoryBySlug(parsed.categorySlug)
    if (!cat || !city) return {}
    return {
      title: `${cat.name} à ${city.name} — Annuaire linfo.be`,
      description: `Trouvez les meilleures entreprises de ${cat.name.toLowerCase()} à ${city.name}. Liste complète avec contacts, avis et informations.`,
      alternates: { canonical: `https://linfo.be/${slug}` },
      openGraph: {
        title: `${cat.name} à ${city.name}`,
        description: `Annuaire des professionnels de ${cat.name.toLowerCase()} à ${city.name}, Belgique.`,
        url: `https://linfo.be/${slug}`,
      },
    }
  }

  const sub = getSubcategoryBySlug(parsed.subcategorySlug!)
  if (!sub || !city) return {}
  return {
    title: `${sub.subcategory.name} à ${city.name} — Annuaire linfo.be`,
    description: `${sub.subcategory.description} Retrouvez tous les prestataires de ${sub.subcategory.name.toLowerCase()} à ${city.name}.`,
    alternates: { canonical: `https://linfo.be/${slug}` },
    openGraph: {
      title: `${sub.subcategory.name} à ${city.name}`,
      description: sub.subcategory.description,
      url: `https://linfo.be/${slug}`,
    },
  }
}

// SEO content blocks per category-city combo
const seoContent: Record<string, { h1: string; intro: string; body: string }> = {
  'transport-bruxelles': {
    h1: 'Transport à Bruxelles',
    intro: 'Bruxelles, capitale de la Belgique et siège des institutions européennes, dispose d\'un réseau de transport dense et varié.',
    body: `La Région de Bruxelles-Capitale propose une multitude de solutions de transport pour répondre aux besoins des habitants, des navetteurs et des touristes. Que vous cherchiez un taxi pour un trajet rapide, un autocar pour un voyage de groupe ou un service de déménagement fiable, l'annuaire linfo.be recense les meilleurs professionnels du secteur.

Le réseau de transport public bruxellois, géré par la STIB, complète parfaitement l'offre des prestataires privés. Pour les déplacements interurbains ou les transferts vers l'aéroport de Bruxelles-Zaventem, les compagnies d'autocar et de taxi référencées sur notre plateforme offrent des solutions souples et adaptées.

Les entreprises de transport bruxelloises se distinguent par leur professionnalisme et leur connaissance du tissu urbain local. Qu'il s'agisse de transport de personnes ou de marchandises, vous trouverez sur linfo.be des prestataires certifiés, évalués par leurs clients.`,
  },
  'autocar-bruxelles': {
    h1: 'Location d\'autocar à Bruxelles',
    intro: 'Besoin d\'un autocar à Bruxelles ? Retrouvez tous les loueurs d\'autocars et services de transport de groupe dans la capitale belge.',
    body: `La location d'autocar à Bruxelles répond à de nombreux besoins : excursions scolaires, événements d'entreprise, voyages touristiques, transferts aéroport ou déplacements sportifs. Les entreprises spécialisées que vous trouverez sur linfo.be disposent de flottes modernes, allant des minibus de 8 places aux grands autocars de 55 places.

Louer un autocar à Bruxelles présente de nombreux avantages. Vous déléguez entièrement la logistique à des professionnels, évitez les problèmes de stationnement en ville et garantissez le confort de vos passagers. Les tarifs sont généralement calculés à la journée ou à la prestation, selon la taille du véhicule et la distance parcourue.

Pour obtenir le meilleur tarif, pensez à réserver à l'avance, notamment pour les périodes de haute saison (été, fêtes de fin d'année). N'hésitez pas à demander plusieurs devis aux entreprises listées sur notre annuaire et à comparer les prestations incluses.`,
  },
  'taxi-bruxelles': {
    h1: 'Taxi à Bruxelles',
    intro: 'Trouvez votre taxi à Bruxelles : services disponibles 24h/24 et 7j/7 dans toute la capitale belge et ses environs.',
    body: `Le secteur du taxi à Bruxelles est réglementé par la Région de Bruxelles-Capitale, garantissant des standards de qualité et de sécurité élevés. Tous les chauffeurs de taxi référencés sur linfo.be disposent des autorisations requises et ont suivi les formations obligatoires.

Que vous ayez besoin d'un taxi pour un transfert vers l'aéroport de Zaventem ou Brussels South Charleroi Airport, pour un rendez-vous professionnel ou une sortie nocturne, les compagnies bruxelloises sont à votre disposition. La plupart proposent la réservation en ligne ou par téléphone, avec confirmation immédiate.

Les tarifs des taxis bruxellois sont réglementés : un prix de prise en charge fixe, un tarif kilométrique et des suppléments éventuels (aéroport, nuit, bagages). La majorité des taxis acceptent désormais le paiement par carte bancaire, rendant vos déplacements encore plus pratiques.`,
  },
  'sport-bruxelles': {
    h1: 'Sport à Bruxelles',
    intro: 'Découvrez les meilleurs clubs sportifs, salles de fitness et infrastructures sportives à Bruxelles.',
    body: `Bruxelles offre une infrastructure sportive remarquable, avec des dizaines de salles de sport, piscines, clubs de tennis, stades de football et bien d'autres équipements répartis dans les 19 communes de la Région. Que vous soyez un sportif amateur ou un athlète confirmé, la capitale belge dispose des ressources pour satisfaire votre passion.

Le sport à Bruxelles est accessible à tous les niveaux et tous les budgets. Des grandes chaînes de fitness comme Basic-Fit aux salles boutique spécialisées en CrossFit ou yoga, l'offre est aussi variée que diverse. Les clubs sportifs associatifs proposent quant à eux des tarifs attractifs, notamment pour les jeunes et les familles.

Les autorités bruxelloises investissent régulièrement dans les infrastructures sportives publiques : piscines communales, terrains de football synthétiques, pistes d'athlétisme. Ces équipements, gérés par les communes ou par la Région, sont accessibles à des tarifs préférentiels pour les résidents.`,
  },
  'gym-bruxelles': {
    h1: 'Salle de sport et fitness à Bruxelles',
    intro: 'Trouvez la meilleure salle de gym à Bruxelles : centres de fitness, clubs de musculation et cours collectifs dans toute la capitale.',
    body: `Le marché du fitness à Bruxelles est en pleine expansion, avec l'émergence de nouveaux concepts de salles de sport qui répondent à des attentes de plus en plus diversifiées. Des grandes enseignes low-cost aux studios premium, chaque bruxellois peut trouver la formule qui correspond à ses objectifs et à son budget.

Les salles de fitness modernes à Bruxelles proposent bien plus que des machines de musculation. Les cours collectifs sont au cœur de l'offre : yoga, pilates, HIIT, spinning, zumba, boxe fitness... La plupart des établissements emploient des coachs diplômés capables de vous accompagner dans l'atteinte de vos objectifs, qu'il s'agisse de perte de poids, de prise de masse ou d'amélioration de votre condition physique générale.

Avant de vous engager, visitez plusieurs salles et renseignez-vous sur les conditions d'abonnement. De nombreux clubs proposent un premier cours ou une séance d'essai gratuite. Comparez les équipements disponibles, les horaires d'ouverture, la proximité avec votre domicile ou lieu de travail, et bien sûr les tarifs.`,
  },
}

export default async function SeoPage(props: PageProps) {
  const { slug } = await props.params
  const parsed = parseSeoSlug(slug)

  if (!parsed) notFound()

  const city = getCityBySlug(parsed.citySlug)
  if (!city) notFound()

  let pageTitle = ''
  const categorySlug = parsed.categorySlug
  let subcategorySlug: string | undefined

  let businesses: import('@/services/businesses').Business[] = []

  if (parsed.type === 'category-city') {
    const cat = getCategoryBySlug(parsed.categorySlug)
    if (!cat) notFound()
    pageTitle = `${cat.name} à ${city.name}`
    businesses = await getBusinessesForCategoryCity(parsed.categorySlug, parsed.citySlug)
  } else {
    const sub = getSubcategoryBySlug(parsed.subcategorySlug!)
    if (!sub) notFound()
    subcategorySlug = parsed.subcategorySlug
    pageTitle = `${sub.subcategory.name} à ${city.name}`
    businesses = await getBusinessesForSubcategoryCity(parsed.subcategorySlug!, parsed.citySlug)
  }

  const content = seoContent[slug] || {
    h1: pageTitle,
    intro: `Retrouvez les meilleures entreprises pour ${pageTitle.toLowerCase()} sur linfo.be, l'annuaire local de référence en Belgique.`,
    body: `Notre annuaire recense les professionnels vérifiés pour ${pageTitle.toLowerCase()}. Comparez les entreprises, consultez les avis clients et contactez directement les prestataires qui correspondent à vos besoins.`,
  }

  // Build structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: content.h1,
    description: content.intro,
    numberOfItems: businesses.length,
    itemListElement: businesses.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: b.name,
        description: b.shortDescription,
        address: {
          '@type': 'PostalAddress',
          addressLocality: city.name,
          addressCountry: 'BE',
        },
        telephone: b.phone,
      },
    })),
  }

  // Related subcategories for internal linking
  const cat = getCategoryBySlug(categorySlug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Navbar />

      {/* Breadcrumb + Header */}
      <div className="border-b border-gray-100 bg-white px-4 py-4">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-2 flex gap-2 text-sm text-gray-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600">Accueil</Link>
            <span>/</span>
            {parsed.type === 'subcategory-city' && (
              <>
                <Link href={`/${categorySlug}-${parsed.citySlug}`} className="hover:text-blue-600 capitalize">
                  {cat?.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-700">{pageTitle}</span>
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <Sidebar
            activeCategorySlug={categorySlug}
            activeSubcategorySlug={subcategorySlug}
            activeCitySlug={parsed.citySlug}
          />

          {/* Main content */}
          <div>
            {/* H1 + intro */}
            <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{content.h1}</h1>
              <p className="mt-3 text-gray-600">{content.intro}</p>
            </div>

            {/* Business listings */}
            <div className="mb-8">
              <p className="mb-4 text-sm text-gray-500">
                {businesses.length} entreprise{businesses.length !== 1 ? 's' : ''} trouvée{businesses.length !== 1 ? 's' : ''}
              </p>
              <BusinessList businesses={businesses} />
            </div>

            {/* SEO text */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Tout savoir sur {content.h1.toLowerCase()}
              </h2>
              {content.body.split('\n\n').map((para, i) => (
                <p key={i} className="mb-4 text-sm leading-relaxed text-gray-600 last:mb-0">
                  {para.trim()}
                </p>
              ))}
            </div>

            {/* Internal links */}
            {cat && (
              <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-gray-900">
                  Sous-catégories de {cat.name} à {city.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/${sub.slug}-${parsed.citySlug}`}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        subcategorySlug === sub.slug
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                      }`}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* City links */}
            <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">
                {content.h1.split(' à ')[0]} dans d&apos;autres villes
              </h3>
              <div className="flex flex-wrap gap-2">
                {['bruxelles', 'anvers', 'gand', 'liege'].map((citySlug) => (
                  <Link
                    key={citySlug}
                    href={`/${subcategorySlug || categorySlug}-${citySlug}`}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors capitalize ${
                      parsed.citySlug === citySlug
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    {citySlug === 'bruxelles' ? 'Bruxelles' : citySlug === 'anvers' ? 'Anvers' : citySlug === 'gand' ? 'Gand' : 'Liège'}
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

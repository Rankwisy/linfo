import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import SearchBar from '@/components/SearchBar'
import CategoryGrid from '@/components/CategoryGrid'
import CityGrid from '@/components/CityGrid'
import BusinessCard from '@/components/BusinessCard'
import { getFeaturedBusinessesAsync } from '@/services/businesses'

export const metadata: Metadata = {
  title: 'linfo.be — Annuaire des entreprises locales en Belgique',
  description:
    'Trouvez les meilleures entreprises locales en Belgique : transport, sport, construction et services. Annuaire B2B et grand public avec avis et coordonnées.',
  alternates: { canonical: 'https://linfo.be' },
  openGraph: {
    title: 'linfo.be — Annuaire des entreprises locales en Belgique',
    description: 'Trouvez les meilleures entreprises locales en Belgique.',
    url: 'https://linfo.be',
    siteName: 'linfo.be',
    type: 'website',
  },
}

const popularSearches = [
  { label: 'Taxi Bruxelles', href: '/bruxelles/automobile-transport/taxi' },
  { label: 'Autocar Bruxelles', href: '/bruxelles/automobile-transport/location-autocar' },
  { label: 'Gym Bruxelles', href: '/bruxelles/sport-loisirs/gym-fitness' },
  { label: 'Déménagement Bruxelles', href: '/bruxelles/automobile-transport/demenagement' },
  { label: 'Transport Anvers', href: '/anvers/automobile-transport' },
  { label: 'Sport Gand', href: '/gand/sport-loisirs' },
]

export default async function HomePage() {
  const featured = await getFeaturedBusinessesAsync()

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        className="relative py-16 px-4 text-white"
        style={{
          backgroundImage: 'url(https://ik.imagekit.io/9nqnnkvba/linfo.be%20hero%20image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-blue-900/60" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-display text-balance text-white mb-4">
            Trouvez les meilleures entreprises{' '}
            <span className="text-yellow-300">en Belgique</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-blue-100/90">
            L&apos;annuaire local de référence pour trouver transport, sport, construction et services professionnels près de chez vous.
          </p>

          <SearchBar />

          {/* Popular searches */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {popularSearches.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="rounded-full border border-blue-400 bg-blue-500/40 px-3 py-1 text-sm text-white hover:bg-blue-400/60 transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Categories */}
        <section className="py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Parcourir par catégorie</h2>
            <Link href="/bruxelles" className="text-sm font-medium text-blue-600 hover:underline">
              Voir tout →
            </Link>
          </div>
          <CategoryGrid citySlug="bruxelles" />
          <div className="mt-4 text-center">
            <a href="/bruxelles" className="text-sm font-medium text-blue-600 hover:underline">
              Voir toutes les catégories à Bruxelles →
            </a>
          </div>
        </section>

        {/* Featured businesses */}
        <section className="py-12 border-t border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Entreprises en vedette</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">Sélectionnées pour leur qualité de service</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {featured.slice(0, 3).map((b) => (
              <BusinessCard key={b.objectID} business={b} />
            ))}
          </div>
        </section>

        {/* Popular cities */}
        <section className="py-12 border-t border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Villes populaires</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">Explorez les entreprises par ville</p>
          </div>
          <CityGrid />
        </section>

        {/* SEO internal links section */}
        <section className="py-12 border-t border-gray-100">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Recherches fréquentes</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: 'Transport Bruxelles', href: '/bruxelles/automobile-transport' },
              { label: 'Autocar Bruxelles', href: '/bruxelles/automobile-transport/location-autocar' },
              { label: 'Taxi Bruxelles', href: '/bruxelles/automobile-transport/taxi' },
              { label: 'Sport Bruxelles', href: '/bruxelles/sport-loisirs' },
              { label: 'Gym Bruxelles', href: '/bruxelles/sport-loisirs/gym-fitness' },
              { label: 'Piscine Bruxelles', href: '/bruxelles/sport-loisirs/piscine' },
              { label: 'Construction Bruxelles', href: '/bruxelles/immobilier-construction' },
              { label: 'Rénovation Bruxelles', href: '/bruxelles/immobilier-construction/renovation' },
              { label: 'Services Bruxelles', href: '/bruxelles/services-professionnels' },
              { label: 'Transport Anvers', href: '/anvers/automobile-transport' },
              { label: 'Sport Gand', href: '/gand/sport-loisirs' },
              { label: 'Services Liège', href: '/liege/services-professionnels' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm hover:border-blue-200 hover:text-blue-600 transition-colors"
              >
                <span className="text-blue-500">→</span>
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

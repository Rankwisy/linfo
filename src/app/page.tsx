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
  { label: 'Taxi Bruxelles', href: '/taxi-bruxelles' },
  { label: 'Autocar Bruxelles', href: '/autocar-bruxelles' },
  { label: 'Gym Bruxelles', href: '/gym-bruxelles' },
  { label: 'Déménagement Bruxelles', href: '/demenagement-bruxelles' },
  { label: 'Transport Anvers', href: '/transport-anvers' },
  { label: 'Sport Gand', href: '/sport-gand' },
]

export default async function HomePage() {
  const featured = await getFeaturedBusinessesAsync()

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-700 to-blue-600 py-16 px-4 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            Trouvez les meilleures entreprises{' '}
            <span className="text-yellow-300">en Belgique</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
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
            <h2 className="text-2xl font-bold text-gray-900">Parcourir par catégorie</h2>
            <Link href="/transport-bruxelles" className="text-sm font-medium text-blue-600 hover:underline">
              Voir tout →
            </Link>
          </div>
          <CategoryGrid citySlug="bruxelles" />
        </section>

        {/* Featured businesses */}
        <section className="py-12 border-t border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Entreprises en vedette</h2>
            <p className="mt-1 text-gray-500 text-sm">Sélectionnées pour leur qualité de service</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((b) => (
              <BusinessCard key={b.objectID} business={b} />
            ))}
          </div>
        </section>

        {/* Popular cities */}
        <section className="py-12 border-t border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Villes populaires</h2>
            <p className="mt-1 text-gray-500 text-sm">Explorez les entreprises par ville</p>
          </div>
          <CityGrid />
        </section>

        {/* SEO internal links section */}
        <section className="py-12 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recherches fréquentes</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: 'Transport Bruxelles', href: '/transport-bruxelles' },
              { label: 'Autocar Bruxelles', href: '/autocar-bruxelles' },
              { label: 'Taxi Bruxelles', href: '/taxi-bruxelles' },
              { label: 'Sport Bruxelles', href: '/sport-bruxelles' },
              { label: 'Gym Bruxelles', href: '/gym-bruxelles' },
              { label: 'Piscine Bruxelles', href: '/piscine-bruxelles' },
              { label: 'Construction Bruxelles', href: '/construction-bruxelles' },
              { label: 'Rénovation Bruxelles', href: '/renovation-bruxelles' },
              { label: 'Services Bruxelles', href: '/services-bruxelles' },
              { label: 'Transport Anvers', href: '/transport-anvers' },
              { label: 'Sport Gand', href: '/sport-gand' },
              { label: 'Services Liège', href: '/services-liege' },
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

'use client'
import { ArrowUp, MapPinIcon } from 'lucide-react'
import Link from 'next/link'

// ── Top categories linking to real city×silo pages ────────────────────────────
const categories = [
  { label: 'Avocats à Bruxelles',       href: '/bruxelles/finance-juridique/avocat' },
  { label: 'Rénovation à Bruxelles',    href: '/bruxelles/immobilier-construction' },
  { label: 'Mariage à Bruxelles',       href: '/bruxelles/mariage' },
  { label: 'Santé à Bruxelles',         href: '/bruxelles/sante-bien-etre' },
  { label: 'Informatique à Anvers',     href: '/anvers/informatique-technologies' },
  { label: 'Événementiel à Gand',       href: '/gand/evenementiel-culture' },
  { label: 'Juridique à Liège',         href: '/liege/finance-juridique' },
  { label: 'Services à Anvers',         href: '/anvers/services-professionnels' },
]

// ── City hub pages ─────────────────────────────────────────────────────────────
const cityLinks = [
  { label: 'Bruxelles', href: '/bruxelles' },
  { label: 'Anvers',    href: '/anvers' },
  { label: 'Gand',      href: '/gand' },
  { label: 'Liège',     href: '/liege' },
]

// ── Popular keyword searches ───────────────────────────────────────────────────
const topSearches = [
  { label: 'Avocat Bruxelles',          href: '/bruxelles/finance-juridique/avocat' },
  { label: 'Notaire Anvers',            href: '/anvers/finance-juridique/notaire' },
  { label: 'Wedding Planner Bruxelles', href: '/bruxelles/mariage/wedding-planner' },
  { label: 'Photographe Gand',          href: '/gand/evenementiel-culture/photographe' },
  { label: 'Déménagement Anvers',       href: '/anvers/automobile-transport/demenagement' },
  { label: 'Rénovation Liège',          href: '/liege/immobilier-construction/renovation' },
  { label: 'Coiffeur Bruxelles',        href: '/bruxelles/beaute-mode/coiffeur' },
  { label: 'Taxi Bruxelles',            href: '/bruxelles/automobile-transport/taxi' },
]

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
                <MapPinIcon size={16} color="white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                linfo<span className="text-blue-400">.be</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              L&apos;annuaire des entreprises locales en Belgique. Trouvez rapidement les meilleurs prestataires près de chez vous.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h6 className="mb-4 font-semibold text-white">Catégories populaires</h6>
            <ul className="space-y-2.5">
              {categories.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h6 className="mb-4 font-semibold text-white">Villes</h6>
            <ul className="space-y-2.5">
              {cityLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    📍 {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top searches */}
          <div>
            <h6 className="mb-4 font-semibold text-white">Recherches populaires</h6>
            <ul className="space-y-2.5">
              {topSearches.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      <div className="relative border-t border-gray-800 bg-gray-900">
        <button
          onClick={scrollToTop}
          aria-label="Retour en haut"
          className="absolute -top-5 right-8 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 shadow-lg hover:bg-blue-500 transition-colors md:right-16"
        >
          <ArrowUp color="#fff" size={18} />
        </button>
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-5 md:flex-row md:justify-between">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} linfo.be — L&apos;annuaire local de Belgique
          </p>
          <div className="flex gap-4 text-sm">
            <Link href="/sitemap.xml" className="text-gray-500 hover:text-gray-300 transition-colors">
              Sitemap
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-300 transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

'use client'
import { ArrowUp, MapPinIcon, MailIcon } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-4">

          {/* ── Col 1: Brand ───────────────────────────────────────────── */}
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

          {/* ── Col 2: About ───────────────────────────────────────────── */}
          <div>
            <h6 className="mb-4 font-semibold text-white uppercase tracking-wider text-xs">About</h6>
            <ul className="space-y-2.5">
              {[
                { label: 'Home',       href: '/' },
                { label: 'Categories', href: '/bruxelles' },
                { label: 'About Us',   href: '#' },
                { label: 'FAQs',       href: '#' },
                { label: 'Contact Us', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Quick Links ─────────────────────────────────────── */}
          <div>
            <h6 className="mb-4 font-semibold text-white uppercase tracking-wider text-xs">Quick Links</h6>
            <ul className="space-y-2.5">
              {[
                { label: 'Add Your Business',   href: '/ajouter-entreprise' },
                { label: 'Blog',                href: '#' },
                { label: 'Write for Us',        href: '#' },
                { label: 'Terms and Conditions',href: '#' },
                { label: 'Site Map',            href: '/sitemap.xml' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4: Get in Touch ────────────────────────────────────── */}
          <div>
            <h6 className="mb-4 font-semibold text-white uppercase tracking-wider text-xs">Get in Touch</h6>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@linfo.be"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <MailIcon size={14} className="shrink-0 text-blue-400" />
                  info@linfo.be
                </a>
              </li>
              <li className="text-sm text-gray-400 leading-relaxed">
                Serving communities<br />worldwide
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────── */}
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

'use client'
import { MenuIcon, XIcon, MapPinIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { title: 'Transport', link: '/transport-bruxelles' },
  { title: 'Sport', link: '/sport-bruxelles' },
  { title: 'Construction', link: '/construction-bruxelles' },
  { title: 'Services', link: '/services-bruxelles' },
]

const Navbar = () => {
  const [showNav, setShowNav] = useState(false)

  return (
    <nav className="relative z-20 bg-white border-b border-gray-100 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          {/* Hamburger */}
          <button
            onClick={() => setShowNav(!showNav)}
            aria-label="Toggle Menu"
            className="md:hidden"
          >
            {showNav ? (
              <XIcon color="#202020" strokeWidth={2.5} size={24} />
            ) : (
              <MenuIcon color="#202020" strokeWidth={2.5} size={24} />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
              <MapPinIcon size={18} color="white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              linfo<span className="text-blue-600">.be</span>
            </span>
          </Link>

          {/* Nav links */}
          <div
            className={`absolute left-0 right-0 -z-10 flex w-full flex-col gap-1 bg-white px-4 py-3 shadow-lg transition-all duration-300 ease-in-out md:relative md:left-0 md:right-auto md:top-auto md:z-auto md:flex-row md:shadow-none md:p-0 md:gap-1 ${
              showNav ? 'top-[54px]' : 'top-[-300px]'
            }`}
          >
            {navLinks.map(({ title, link }) => (
              <Link
                key={title}
                href={link}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
              >
                {title}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/ajouter-entreprise"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95"
          >
            + Ajouter mon entreprise
          </Link>
          <Link
            href="/ajouter-entreprise"
            className="sm:hidden inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
          >
            + Ajouter
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

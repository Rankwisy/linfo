'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboardIcon,
  ListIcon,
  PlusCircleIcon,
  UploadIcon,
  SettingsIcon,
  BuildingIcon,
  ExternalLinkIcon,
} from 'lucide-react'

const NAV = [
  { href: '/admin',               label: 'Dashboard',      icon: LayoutDashboardIcon, exact: true },
  { href: '/admin/listings',      label: 'Listings',       icon: ListIcon },
  { href: '/admin/listings/new',  label: 'Add Listing',    icon: PlusCircleIcon },
  { href: '/admin/import',        label: 'Import / Export',icon: UploadIcon },
  { href: '/admin/settings',      label: 'Settings',       icon: SettingsIcon },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 min-h-screen bg-slate-900 flex flex-col">
      {/* Brand */}
      <div className="px-5 py-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
            <BuildingIcon size={15} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-none">Linfo.be</div>
            <div className="text-slate-400 text-xs mt-0.5">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-700/50">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ExternalLinkIcon size={11} />
          View site
        </Link>
      </div>
    </aside>
  )
}

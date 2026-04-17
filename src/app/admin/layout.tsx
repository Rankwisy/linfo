import type { ReactNode } from 'react'
import AdminSidebar from '@/components/admin/sidebar'

export const metadata = {
  title: { template: '%s | Admin — Linfo.be', default: 'Admin — Linfo.be' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">{children}</div>
    </div>
  )
}

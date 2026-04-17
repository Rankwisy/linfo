import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getListings, getFilterOptions } from '@/lib/admin/actions'
import ListingsTable from '@/components/admin/listings-table'

export const metadata: Metadata = { title: 'Listings' }
export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{
    page?: string
    pageSize?: string
    q?: string
    category?: string
    city?: string
    sortBy?: string
    sortDir?: string
  }>
}

export default async function AdminListingsPage({ searchParams }: Props) {
  const sp = await searchParams

  const page = Math.max(1, parseInt(sp.page ?? '1', 10))
  const pageSize = Math.min(250, Math.max(25, parseInt(sp.pageSize ?? '50', 10)))
  const search = sp.q?.trim() ?? ''
  const category = sp.category?.trim() ?? ''
  const city = sp.city?.trim() ?? ''
  const sortBy = sp.sortBy ?? 'created_at'
  const sortDir = (sp.sortDir === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc'

  const [result, filters] = await Promise.all([
    getListings({ page, pageSize, search, category, city, sortBy, sortDir }),
    getFilterOptions(),
  ])

  return (
    <div className="flex flex-col h-screen">
      {/* Page header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-white shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Listings</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          Manage all directory entries
        </p>
      </div>

      {/* Table (fills remaining height) */}
      <div className="flex-1 min-h-0">
        <Suspense fallback={<div className="p-8 text-gray-400 text-sm">Loading…</div>}>
          <ListingsTable
            initialData={result.data}
            total={result.total}
            page={result.page}
            pageSize={result.pageSize}
            totalPages={result.totalPages}
            categories={filters.categories}
            cities={filters.cities}
            searchQuery={search}
            filterCategory={category}
            filterCity={city}
            sortBy={sortBy}
            sortDir={sortDir}
          />
        </Suspense>
      </div>
    </div>
  )
}

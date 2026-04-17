import type { Metadata } from 'next'
import Link from 'next/link'
import { PlusIcon, UploadIcon, BuildingIcon, MapPinIcon, ArrowRightIcon } from 'lucide-react'
import { getDashboardStats } from '@/lib/admin/actions'
import StatsCards from '@/components/admin/stats-cards'

export const metadata: Metadata = { title: 'Dashboard' }
export const revalidate = 60

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()
  const topTotal = stats.byCategory.reduce((s, [, n]) => s + n, 0)

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">Directory overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/import"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <UploadIcon size={14} />
            Import
          </Link>
          <Link
            href="/admin/listings/new"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <PlusIcon size={14} />
            Add Listing
          </Link>
        </div>
      </div>

      {/* Stats */}
      <StatsCards total={stats.total} byCategory={stats.byCategory} byCity={stats.byCity} />

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* By category */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">By Category</h3>
          <div className="space-y-3">
            {stats.byCategory.map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 capitalize w-28 truncate shrink-0">{cat}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${topTotal > 0 ? (count / topTotal) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600 w-10 text-right shrink-0">
                  {count.toLocaleString('fr-BE')}
                </span>
              </div>
            ))}
            {stats.byCategory.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No data yet</p>
            )}
          </div>
        </div>

        {/* By city */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">By City</h3>
          <div className="space-y-3">
            {stats.byCity.map(([city, count]) => (
              <div key={city} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 capitalize w-28 truncate shrink-0">{city}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${topTotal > 0 ? (count / topTotal) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600 w-10 text-right shrink-0">
                  {count.toLocaleString('fr-BE')}
                </span>
              </div>
            ))}
            {stats.byCity.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent listings */}
      <div className="bg-white rounded-xl border border-gray-200 mt-6">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Recent Listings</h3>
          <Link
            href="/admin/listings"
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            View all <ArrowRightIcon size={11} />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {stats.recent.map((biz) => (
            <div key={biz.id} className="px-5 py-3 flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <BuildingIcon size={13} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">{biz.name}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPinIcon size={10} />
                  <span className="capitalize">{biz.city}</span>
                  <span className="text-gray-200">·</span>
                  <span className="capitalize">{biz.category}</span>
                </div>
              </div>
              <Link
                href={`/admin/listings/${biz.id}/edit`}
                className="text-xs text-blue-600 hover:underline shrink-0"
              >
                Edit
              </Link>
            </div>
          ))}
          {stats.recent.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-gray-400">
              No listings yet.{' '}
              <Link href="/admin/listings/new" className="text-blue-600 hover:underline">
                Add the first one →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useCallback, useTransition, useRef, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/react-table'
import {
  SearchIcon,
  PencilIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  FilterIcon,
  StarIcon,
  LoaderIcon,
} from 'lucide-react'
import type { BusinessRow } from '@/lib/supabase'
import { deleteListing, bulkDeleteListings, bulkUpdateCategory } from '@/lib/admin/actions'

// ─── Algolia search client (search-only key, safe client-side) ───────────────

async function algoliaSearch(query: string): Promise<BusinessRow[]> {
  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
  const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
  const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX ?? 'businesses'
  if (!appId || !searchKey) return []

  try {
    const { algoliasearch } = await import('algoliasearch')
    const client = algoliasearch(appId, searchKey)
    const { results } = await client.search({
      requests: [{ indexName, query, hitsPerPage: 100 }],
    })
    const hits = (results[0] as any)?.hits ?? []
    return hits as BusinessRow[]
  } catch {
    return []
  }
}

// ─── Column definitions ───────────────────────────────────────────────────────

function useColumns(
  onDelete: (id: string, name: string) => void
): ColumnDef<BusinessRow>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="rounded border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="rounded border-gray-300"
        />
      ),
      enableSorting: false,
      size: 40,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900 text-sm leading-snug line-clamp-1">
            {row.original.name}
          </div>
          {row.original.slug && (
            <div className="text-xs text-gray-400 truncate max-w-[200px]">/{row.original.slug}</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
            {row.original.category}
          </span>
          {row.original.subcategory && row.original.subcategory !== row.original.category && (
            <div className="text-xs text-gray-400 mt-0.5 capitalize">{row.original.subcategory}</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'city',
      header: 'City',
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-600 capitalize">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ getValue }) => {
        const v = getValue() as string | null
        return v ? (
          <span className="text-sm text-gray-600 font-mono text-xs">{v}</span>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'featured',
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          {row.original.featured && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">
              <StarIcon size={10} />
              Featured
            </span>
          )}
          {row.original.rating > 0 && (
            <span className="text-xs text-gray-500">★ {Number(row.original.rating).toFixed(1)}</span>
          )}
          {!row.original.featured && !row.original.rating && (
            <span className="text-xs text-gray-300">Active</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ getValue }) => {
        const v = getValue() as string
        if (!v) return <span className="text-gray-300 text-xs">—</span>
        return (
          <span className="text-xs text-gray-400">
            {new Date(v).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short', year: '2-digit' })}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          <Link
            href={`/admin/listings/${row.original.id}/edit`}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <PencilIcon size={13} />
          </Link>
          <button
            onClick={() => onDelete(row.original.id, row.original.name)}
            className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <TrashIcon size={13} />
          </button>
        </div>
      ),
      enableSorting: false,
      size: 60,
    },
  ]
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  initialData: BusinessRow[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  categories: string[]
  cities: string[]
  searchQuery: string
  filterCategory: string
  filterCity: string
  sortBy: string
  sortDir: string
}

export default function ListingsTable({
  initialData,
  total,
  page,
  pageSize,
  totalPages,
  categories,
  cities,
  searchQuery,
  filterCategory,
  filterCity,
  sortBy,
  sortDir,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Local search state (Algolia instant search)
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [algoliaRows, setAlgoliaRows] = useState<BusinessRow[] | null>(null)
  const [algoliaLoading, setAlgoliaLoading] = useState(false)
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Row selection
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // Bulk action state
  const [bulkCategory, setBulkCategory] = useState('')
  const [bulkMsg, setBulkMsg] = useState('')

  // Sorting (client state synced from URL)
  const [sorting, setSorting] = useState<SortingState>(() =>
    sortBy ? [{ id: sortBy, desc: sortDir === 'desc' }] : []
  )

  // Data to display: Algolia results if searching, else server-side data
  const rows = algoliaRows ?? initialData

  // ── URL navigation helper ──────────────────────────────────────────────────
  const navigate = useCallback(
    (updates: Record<string, string | number>) => {
      const params = new URLSearchParams(sp.toString())
      for (const [k, v] of Object.entries(updates)) {
        if (v === '' || v === undefined) params.delete(k)
        else params.set(k, String(v))
      }
      startTransition(() => router.push(`${pathname}?${params.toString()}`))
    },
    [router, pathname, sp, startTransition]
  )

  // ── Search (Algolia or server fallback) ───────────────────────────────────
  const handleSearch = useCallback(
    (value: string) => {
      setLocalSearch(value)
      clearTimeout(searchTimer.current)

      if (!value.trim()) {
        setAlgoliaRows(null)
        navigate({ q: '', page: 1 })
        return
      }

      // Try Algolia first (instant), fallback to server
      const hasAlgolia =
        process.env.NEXT_PUBLIC_ALGOLIA_APP_ID &&
        process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY

      if (hasAlgolia) {
        setAlgoliaLoading(true)
        searchTimer.current = setTimeout(async () => {
          const hits = await algoliaSearch(value)
          setAlgoliaRows(hits.length > 0 ? hits : [])
          setAlgoliaLoading(false)
        }, 250)
      } else {
        searchTimer.current = setTimeout(() => {
          navigate({ q: value, page: 1 })
        }, 400)
      }
    },
    [navigate]
  )

  // ── Sorting ───────────────────────────────────────────────────────────────
  const handleSort = useCallback(
    (col: string) => {
      const newDir = sortBy === col && sortDir === 'desc' ? 'asc' : 'desc'
      navigate({ sortBy: col, sortDir: newDir, page: 1 })
    },
    [sortBy, sortDir, navigate]
  )

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(
    async (id: string, name: string) => {
      if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
      const res = await deleteListing(id)
      if (!res.success) alert('Error: ' + res.error)
      setRowSelection({})
    },
    []
  )

  // ── Bulk delete ───────────────────────────────────────────────────────────
  const handleBulkDelete = useCallback(async () => {
    const ids = Object.keys(rowSelection).map((idx) => rows[parseInt(idx)]?.id).filter(Boolean)
    if (!ids.length) return
    if (!confirm(`Delete ${ids.length} listing(s)? This cannot be undone.`)) return
    const res = await bulkDeleteListings(ids)
    if (res.success) {
      setBulkMsg(`Deleted ${(res as any).data?.deleted} listings.`)
      setRowSelection({})
    } else {
      alert('Error: ' + res.error)
    }
  }, [rowSelection, rows])

  // ── Bulk update category ──────────────────────────────────────────────────
  const handleBulkCategory = useCallback(async () => {
    if (!bulkCategory) return
    const ids = Object.keys(rowSelection).map((idx) => rows[parseInt(idx)]?.id).filter(Boolean)
    if (!ids.length) return
    const [cat, sub] = bulkCategory.split('::')
    const res = await bulkUpdateCategory(ids, cat, sub ?? cat)
    if (res.success) {
      setBulkMsg(`Updated category for ${ids.length} listing(s).`)
      setRowSelection({})
    } else {
      alert('Error: ' + res.error)
    }
  }, [rowSelection, rows, bulkCategory])

  const selectedCount = Object.keys(rowSelection).length

  const columns = useColumns(handleDelete)

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    getRowId: (row, index) => String(index),
  })

  return (
    <div className="flex flex-col h-full">
      {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-white">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search listings…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {algoliaLoading && (
            <LoaderIcon size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
          )}
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1.5">
          <FilterIcon size={13} className="text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => navigate({ category: e.target.value, page: 1 })}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* City filter */}
        <select
          value={filterCity}
          onChange={(e) => navigate({ city: e.target.value, page: 1 })}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-400">{total.toLocaleString('fr-BE')} total</span>
          <Link
            href="/admin/listings/new"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <PlusIcon size={13} />
            Add
          </Link>
        </div>
      </div>

      {/* ── Bulk actions bar ─────────────────────────────────────────────────── */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-3 px-6 py-2.5 bg-blue-50 border-b border-blue-200">
          <span className="text-sm font-semibold text-blue-800">{selectedCount} selected</span>
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors"
          >
            <TrashIcon size={12} />
            Delete selected
          </button>
          <select
            value={bulkCategory}
            onChange={(e) => setBulkCategory(e.target.value)}
            className="text-xs border border-blue-200 rounded-lg px-2 py-1.5 bg-white"
          >
            <option value="">Change category…</option>
            {categories.map((c) => (
              <option key={c} value={`${c}::${c}`}>{c}</option>
            ))}
          </select>
          {bulkCategory && (
            <button
              onClick={handleBulkCategory}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          )}
          {bulkMsg && <span className="text-xs text-blue-700 font-medium">{bulkMsg}</span>}
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const sorted = sorting.find((s) => s.id === header.column.id)
                  return (
                    <th
                      key={header.id}
                      style={{ width: header.column.columnDef.size }}
                      className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 whitespace-nowrap ${
                        canSort ? 'cursor-pointer select-none hover:text-gray-700' : ''
                      }`}
                      onClick={canSort ? () => handleSort(header.column.id) : undefined}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <span className="text-gray-300">
                            {sorted ? (
                              sorted.desc ? <ChevronDownIcon size={12} /> : <ChevronUpIcon size={12} />
                            ) : (
                              <ChevronsUpDownIcon size={12} />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className={isPending ? 'opacity-50' : ''}>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-16 text-gray-400 text-sm">
                  {localSearch ? 'No results for this search.' : 'No listings yet.'}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                    row.getIsSelected() ? 'bg-blue-50/50' : ''
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ───────────────────────────────────────────────────────── */}
      {!algoliaRows && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-white">
          <span className="text-xs text-gray-400">
            Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of{' '}
            {total.toLocaleString('fr-BE')}
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1 || isPending}
              onClick={() => navigate({ page: page - 1 })}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon size={15} />
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let p: number
              if (totalPages <= 7) p = i + 1
              else if (page <= 4) p = i + 1
              else if (page >= totalPages - 3) p = totalPages - 6 + i
              else p = page - 3 + i
              return (
                <button
                  key={p}
                  onClick={() => navigate({ page: p })}
                  disabled={isPending}
                  className={`min-w-[28px] h-7 px-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                    p === page
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {p}
                </button>
              )
            })}

            <button
              disabled={page >= totalPages || isPending}
              onClick={() => navigate({ page: page + 1 })}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRightIcon size={15} />
            </button>
          </div>

          <select
            value={pageSize}
            onChange={(e) => navigate({ pageSize: e.target.value, page: 1 })}
            className="text-xs border border-gray-200 rounded px-2 py-1 bg-white"
          >
            {[25, 50, 100, 250].map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

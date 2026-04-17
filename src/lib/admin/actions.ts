'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import {
  syncListingsToAlgolia,
  removeFromAlgolia,
  removeMultipleFromAlgolia,
} from './algolia'
import type { BusinessRow } from '@/lib/supabase'
import type { ListingFormData } from './validators'

// ─── Supabase admin client (service role bypasses RLS) ──────────────────────

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60)
}

function makeObjectId() {
  return `admin-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
}

function makeSlug(name: string, city: string, suffix?: string) {
  const base = `${slugify(name)}-${slugify(city)}`
  const sfx = suffix ?? Math.random().toString(36).substring(2, 5)
  return `${base}-${sfx}`
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GetListingsOptions {
  page?: number
  pageSize?: number
  search?: string
  category?: string
  city?: string
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

export interface ListingsResult {
  data: BusinessRow[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type ActionResult<T = unknown> =
  | { success: true; data?: T }
  | { success: false; error: string }

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function getListings({
  page = 1,
  pageSize = 50,
  search = '',
  category = '',
  city = '',
  sortBy = 'created_at',
  sortDir = 'desc',
}: GetListingsOptions = {}): Promise<ListingsResult> {
  const supabase = getSupabase()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase.from('businesses').select('*', { count: 'exact' })

  if (search.trim().length >= 2) {
    const q = search.trim()
    query = query.or(`name.ilike.%${q}%,city.ilike.%${q}%,category.ilike.%${q}%,subcategory.ilike.%${q}%`)
  }
  if (category) query = query.eq('category', category)
  if (city) query = query.eq('city', city)

  const validSortCols = ['created_at', 'updated_at', 'name', 'city', 'category', 'rating', 'review_count']
  const col = validSortCols.includes(sortBy) ? sortBy : 'created_at'
  query = query.order(col, { ascending: sortDir === 'asc' }).range(from, to)

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  const total = count ?? 0
  return {
    data: (data ?? []) as BusinessRow[],
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

export async function getListing(id: string): Promise<BusinessRow | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase.from('businesses').select('*').eq('id', id).single()
  if (error) return null
  return data as BusinessRow
}

export async function getDashboardStats() {
  const supabase = getSupabase()

  const [countRes, catRes, cityRes, recentRes] = await Promise.all([
    supabase.from('businesses').select('*', { count: 'exact', head: true }),
    supabase.from('businesses').select('category').limit(10000),
    supabase.from('businesses').select('city').limit(10000),
    supabase
      .from('businesses')
      .select('id, name, category, city, created_at, object_id')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  // Aggregate categories
  const catCounts: Record<string, number> = {}
  catRes.data?.forEach((r) => { catCounts[r.category] = (catCounts[r.category] ?? 0) + 1 })
  const byCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)

  // Aggregate cities
  const cityCounts: Record<string, number> = {}
  cityRes.data?.forEach((r) => { cityCounts[r.city] = (cityCounts[r.city] ?? 0) + 1 })
  const byCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)

  return {
    total: countRes.count ?? 0,
    byCategory,
    byCity,
    recent: (recentRes.data ?? []) as BusinessRow[],
  }
}

/** Get distinct categories and cities for filter dropdowns */
export async function getFilterOptions() {
  const supabase = getSupabase()
  const [catRes, cityRes] = await Promise.all([
    supabase.from('businesses').select('category').limit(10000),
    supabase.from('businesses').select('city').limit(10000),
  ])

  const categories = [...new Set(catRes.data?.map((r) => r.category) ?? [])].sort()
  const cities = [...new Set(cityRes.data?.map((r) => r.city) ?? [])].sort()
  return { categories, cities }
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export async function createListing(data: ListingFormData): Promise<ActionResult<{ id: string }>> {
  const supabase = getSupabase()

  const record = {
    object_id: makeObjectId(),
    name: data.name,
    slug: data.slug || makeSlug(data.name, data.city),
    category: data.category,
    subcategory: data.subcategory,
    city: data.city,
    address: data.address ?? null,
    phone: data.phone ?? null,
    email: data.email ?? null,
    website: data.website ?? null,
    description: data.description ?? null,
    short_description: data.short_description ?? (data.description?.substring(0, 160) ?? null),
    image_url: data.image_url ?? null,
    lat: data.lat ?? null,
    lng: data.lng ?? null,
    featured: data.featured ?? false,
    rating: data.rating ?? 0,
    review_count: data.review_count ?? 0,
  }

  const { data: inserted, error } = await supabase.from('businesses').insert(record).select().single()
  if (error) {
    console.error('[createListing]', error)
    return { success: false, error: error.code === '23505' ? 'Ce slug existe déjà.' : 'Erreur lors de la création.' }
  }

  await syncListingsToAlgolia([inserted])
  revalidatePath('/admin/listings')
  return { success: true, data: { id: inserted.id } }
}

export async function updateListing(id: string, data: ListingFormData): Promise<ActionResult> {
  const supabase = getSupabase()

  const updates = {
    name: data.name,
    slug: data.slug,
    category: data.category,
    subcategory: data.subcategory,
    city: data.city,
    address: data.address ?? null,
    phone: data.phone ?? null,
    email: data.email ?? null,
    website: data.website ?? null,
    description: data.description ?? null,
    short_description: data.short_description ?? (data.description?.substring(0, 160) ?? null),
    image_url: data.image_url ?? null,
    lat: data.lat ?? null,
    lng: data.lng ?? null,
    featured: data.featured ?? false,
    rating: data.rating ?? 0,
    review_count: data.review_count ?? 0,
    updated_at: new Date().toISOString(),
  }

  const { data: updated, error } = await supabase
    .from('businesses')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[updateListing]', error)
    return { success: false, error: error.code === '23505' ? 'Ce slug existe déjà.' : 'Erreur lors de la mise à jour.' }
  }

  await syncListingsToAlgolia([updated])
  revalidatePath('/admin/listings')
  revalidatePath(`/admin/listings/${id}/edit`)
  return { success: true }
}

export async function deleteListing(id: string): Promise<ActionResult> {
  const supabase = getSupabase()

  const { data: row } = await supabase.from('businesses').select('object_id').eq('id', id).single()
  const { error } = await supabase.from('businesses').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  if (row?.object_id) await removeFromAlgolia(row.object_id)
  revalidatePath('/admin/listings')
  return { success: true }
}

export async function bulkDeleteListings(ids: string[]): Promise<ActionResult<{ deleted: number }>> {
  if (ids.length === 0) return { success: false, error: 'No IDs provided.' }
  const supabase = getSupabase()

  const { data: rows } = await supabase
    .from('businesses')
    .select('object_id')
    .in('id', ids)

  const { error } = await supabase.from('businesses').delete().in('id', ids)
  if (error) return { success: false, error: error.message }

  const objectIds = rows?.map((r: any) => r.object_id).filter(Boolean) ?? []
  if (objectIds.length > 0) await removeMultipleFromAlgolia(objectIds)

  revalidatePath('/admin/listings')
  return { success: true, data: { deleted: ids.length } }
}

export async function bulkUpdateCategory(
  ids: string[],
  category: string,
  subcategory: string
): Promise<ActionResult> {
  if (ids.length === 0) return { success: false, error: 'No IDs provided.' }
  const supabase = getSupabase()

  const { error } = await supabase
    .from('businesses')
    .update({ category, subcategory, updated_at: new Date().toISOString() })
    .in('id', ids)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/listings')
  return { success: true }
}

// ─── Import ──────────────────────────────────────────────────────────────────

export async function checkDuplicates(
  records: Array<{ name: string; city: string }>
): Promise<Array<{ index: number; isDuplicate: boolean }>> {
  const supabase = getSupabase()
  const { data } = await supabase.from('businesses').select('name, city').limit(100000)

  const existing = new Set(
    data?.map((r: any) =>
      `${r.name.toLowerCase().trim()}|${r.city.toLowerCase().trim()}`
    ) ?? []
  )

  return records.map((r, index) => ({
    index,
    isDuplicate: existing.has(
      `${r.name.toLowerCase().trim()}|${r.city.toLowerCase().trim()}`
    ),
  }))
}

export async function importListings(
  records: Record<string, string>[],
  fieldMap: Record<string, string>,
  skipDuplicates: boolean
): Promise<ActionResult<{ imported: number; skipped: number; errors: number }>> {
  const supabase = getSupabase()

  // Apply field mapping
  const mapped = records.map((row) => {
    const out: Record<string, string> = {}
    for (const [csvCol, dbCol] of Object.entries(fieldMap)) {
      if (dbCol && row[csvCol] !== undefined) out[dbCol] = row[csvCol]
    }
    return out
  })

  // Check duplicates if needed
  let duplicateSet = new Set<number>()
  if (skipDuplicates) {
    const checks = await checkDuplicates(
      mapped.map((r) => ({ name: r.name ?? '', city: r.city ?? '' }))
    )
    duplicateSet = new Set(checks.filter((c) => c.isDuplicate).map((c) => c.index))
  }

  const toInsert = mapped
    .filter((_, i) => !duplicateSet.has(i))
    .filter((r) => r.name?.trim())
    .map((r) => ({
      object_id: `import-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: r.name.trim(),
      slug: makeSlug(r.name, r.city ?? 'belgique'),
      category: r.category ?? 'general',
      subcategory: r.subcategory ?? 'general',
      city: r.city?.trim() ?? 'belgique',
      address: r.address?.trim() || null,
      phone: r.phone?.trim() || null,
      email: r.email?.trim() || null,
      website: r.website?.trim() || null,
      description: r.description?.trim() || null,
      short_description: r.short_description?.trim() || r.description?.trim().substring(0, 160) || null,
      image_url: r.image_url?.trim() || null,
      featured: false,
      rating: parseFloat(r.rating ?? '0') || 0,
      review_count: parseInt(r.review_count ?? '0', 10) || 0,
      lat: r.lat ? parseFloat(r.lat) : null,
      lng: r.lng ? parseFloat(r.lng) : null,
    }))

  if (toInsert.length === 0) {
    return { success: true, data: { imported: 0, skipped: duplicateSet.size, errors: 0 } }
  }

  // Batch insert in chunks of 500
  const CHUNK = 500
  let imported = 0
  let errors = 0
  const allInserted: any[] = []

  for (let i = 0; i < toInsert.length; i += CHUNK) {
    const chunk = toInsert.slice(i, i + CHUNK)
    const { data: inserted, error } = await supabase.from('businesses').insert(chunk).select()
    if (error) {
      console.error('[importListings] chunk error:', error)
      errors += chunk.length
    } else {
      imported += inserted?.length ?? 0
      if (inserted) allInserted.push(...inserted)
    }
  }

  if (allInserted.length > 0) await syncListingsToAlgolia(allInserted)
  revalidatePath('/admin/listings')

  return {
    success: true,
    data: { imported, skipped: duplicateSet.size, errors },
  }
}

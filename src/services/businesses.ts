import { supabase, type BusinessRow } from '@/lib/supabase'
import { categories } from '../data/categories'
import { cities as citiesData } from '../data/cities'

export interface Business {
  objectID: string
  name: string
  slug: string
  category: string
  subcategory: string
  city: string
  address: string
  phone: string
  email: string
  website?: string
  description: string
  shortDescription: string
  tags: string[]
  featured: boolean
  rating: number
  reviewCount: number
  lat?: number
  lng?: number
  imageUrl?: string
}

function rowToBusiness(row: BusinessRow): Business {
  return {
    objectID: row.object_id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    subcategory: row.subcategory,
    city: row.city,
    address: row.address ?? '',
    phone: row.phone ?? '',
    email: row.email ?? '',
    website: row.website ?? undefined,
    description: row.description ?? '',
    shortDescription: row.short_description ?? '',
    tags: row.tags ?? [],
    featured: row.featured,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
    imageUrl: row.image_url ?? undefined,
  }
}

export async function getAllBusinesses(): Promise<Business[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .order('name')
  if (error) { console.error(error); return [] }
  return (data as BusinessRow[]).map(rowToBusiness)
}

export async function getBusinessBySlugAsync(slug: string): Promise<Business | null> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error || !data) return null
  return rowToBusiness(data as BusinessRow)
}

export async function getFeaturedBusinessesAsync(): Promise<Business[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('featured', true)
    .order('rating', { ascending: false })
  if (error) { console.error(error); return [] }
  return (data as BusinessRow[]).map(rowToBusiness)
}

export async function getBusinessesForCategoryCity(
  categorySlug: string,
  citySlug: string
): Promise<Business[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('category', categorySlug)
    .eq('city', citySlug)
    .order('rating', { ascending: false })
  if (error) { console.error(error); return [] }
  return (data as BusinessRow[]).map(rowToBusiness)
}

export async function getBusinessesForSubcategoryCity(
  subcategorySlug: string,
  citySlug: string
): Promise<Business[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('subcategory', subcategorySlug)
    .eq('city', citySlug)
    .order('rating', { ascending: false })
  if (error) { console.error(error); return [] }
  return (data as BusinessRow[]).map(rowToBusiness)
}

export async function getRelatedBusinesses(
  subcategorySlug: string,
  citySlug: string,
  excludeObjectId: string,
  limit = 3
): Promise<Business[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('subcategory', subcategorySlug)
    .eq('city', citySlug)
    .neq('object_id', excludeObjectId)
    .order('rating', { ascending: false })
    .limit(limit)
  if (error) { console.error(error); return [] }
  return (data as BusinessRow[]).map(rowToBusiness)
}

export async function getAllBusinessSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select('slug')
  if (error) { console.error(error); return [] }
  return (data as { slug: string }[]).map((r) => r.slug)
}

// Generate all valid category-city and subcategory-city slug combos
export function getAllSeoPageSlugs(): string[] {
  const slugs: string[] = []
  for (const cat of categories) {
    for (const city of citiesData) {
      slugs.push(`${cat.slug}-${city.slug}`)
    }
    for (const sub of cat.subcategories) {
      for (const city of citiesData) {
        slugs.push(`${sub.slug}-${city.slug}`)
      }
    }
  }
  return slugs
}

// Parse an SEO page slug like "transport-bruxelles" or "autocar-bruxelles"
export function parseSeoSlug(slug: string): {
  type: 'category-city' | 'subcategory-city'
  categorySlug: string
  subcategorySlug?: string
  citySlug: string
} | null {
  const matchedCity = citiesData.find(
    (city) => slug.endsWith(`-${city.slug}`) || slug === city.slug
  )
  if (!matchedCity) return null

  const prefix = slug.slice(0, slug.length - matchedCity.slug.length - 1)

  const matchedCategory = categories.find((c) => c.slug === prefix)
  if (matchedCategory) {
    return { type: 'category-city', categorySlug: matchedCategory.slug, citySlug: matchedCity.slug }
  }

  for (const cat of categories) {
    const sub = cat.subcategories.find((s) => s.slug === prefix)
    if (sub) {
      return {
        type: 'subcategory-city',
        categorySlug: cat.slug,
        subcategorySlug: sub.slug,
        citySlug: matchedCity.slug,
      }
    }
  }

  return null
}

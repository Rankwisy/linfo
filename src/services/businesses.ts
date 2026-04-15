import {
  businesses,
  getBusinessBySlug,
  getBusinessesByCategoryAndCity,
  getBusinessesBySubcategoryAndCity,
  getFeaturedBusinesses,
  type Business,
} from '@/data/businesses'
import { categories } from '../data/categories'
import { cities as citiesData } from '../data/cities'

export type { Business }

export async function getAllBusinesses(): Promise<Business[]> {
  return businesses
}

export async function getBusinessBySlugAsync(slug: string): Promise<Business | null> {
  return getBusinessBySlug(slug) ?? null
}

export async function getFeaturedBusinessesAsync(): Promise<Business[]> {
  return getFeaturedBusinesses()
}

export async function getBusinessesForCategoryCity(
  categorySlug: string,
  citySlug: string
): Promise<Business[]> {
  return getBusinessesByCategoryAndCity(categorySlug, citySlug)
}

export async function getBusinessesForSubcategoryCity(
  subcategorySlug: string,
  citySlug: string
): Promise<Business[]> {
  return getBusinessesBySubcategoryAndCity(subcategorySlug, citySlug)
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
  // Find which city slug matches the end of the url
  const matchedCity = citiesData.find((city) =>
    slug.endsWith(`-${city.slug}`) || slug === city.slug
  )
  if (!matchedCity) return null

  const prefix = slug.slice(0, slug.length - matchedCity.slug.length - 1)

  // Check if it's a top-level category
  const matchedCategory = categories.find((c) => c.slug === prefix)
  if (matchedCategory) {
    return {
      type: 'category-city',
      categorySlug: matchedCategory.slug,
      citySlug: matchedCity.slug,
    }
  }

  // Check if it's a subcategory
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

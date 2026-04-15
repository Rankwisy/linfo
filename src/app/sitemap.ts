import { MetadataRoute } from 'next'
import { getAllBusinessSlugs } from '@/services/businesses'
import { silos } from '@/data/silos'
import { cities } from '@/data/cities'

const BASE_URL = 'https://linfo.be'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const businessSlugs = await getAllBusinessSlugs()
  const now = new Date()

  // Static home
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
  ]

  // City hubs: /bruxelles, /anvers, ...
  const cityHubs: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${BASE_URL}/${city.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  // Silo hubs: /automobile-transport, /sport-loisirs, ...
  const siloHubs: MetadataRoute.Sitemap = silos.map((silo) => ({
    url: `${BASE_URL}/${silo.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Silo subcategory pages: /automobile-transport/taxi, ...
  const siloSubPages: MetadataRoute.Sitemap = silos.flatMap((silo) =>
    silo.subcategories.map((sub) => ({
      url: `${BASE_URL}/${silo.slug}/${sub.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  )

  // City × Silo: /bruxelles/automobile-transport, ...
  const citySiloPages: MetadataRoute.Sitemap = cities.flatMap((city) =>
    silos.map((silo) => ({
      url: `${BASE_URL}/${city.slug}/${silo.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  )

  // City × Silo × Subcategory: /bruxelles/automobile-transport/taxi, ...
  const citySubPages: MetadataRoute.Sitemap = cities.flatMap((city) =>
    silos.flatMap((silo) =>
      silo.subcategories.map((sub) => ({
        url: `${BASE_URL}/${city.slug}/${silo.slug}/${sub.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      }))
    )
  )

  // Company pages
  const companyPages: MetadataRoute.Sitemap = businessSlugs.map((slug) => ({
    url: `${BASE_URL}/company/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...cityHubs,
    ...siloHubs,
    ...siloSubPages,
    ...citySiloPages,
    ...citySubPages,
    ...companyPages,
  ]
}

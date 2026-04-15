import { MetadataRoute } from 'next'
import { getAllSeoPageSlugs } from '@/services/businesses'
import { businesses } from '@/data/businesses'

const BASE_URL = 'https://linfo.be'

export default function sitemap(): MetadataRoute.Sitemap {
  const seoSlugs = getAllSeoPageSlugs()
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]

  const seoPages: MetadataRoute.Sitemap = seoSlugs.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const companyPages: MetadataRoute.Sitemap = businesses.map((b) => ({
    url: `${BASE_URL}/company/${b.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...seoPages, ...companyPages]
}

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/ajouter-entreprise'],
    },
    sitemap: 'https://linfo.be/sitemap.xml',
  }
}

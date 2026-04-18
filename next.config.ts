import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Unsplash
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      // Google Places / Maps photos (Outscraper data: lh3–lh6)
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      // Google APIs — covers maps.googleapis.com, streetviewpixels-pa.googleapis.com, etc.
      { protocol: 'https', hostname: '**.googleapis.com' },
      // ImageKit (hero image + future uploads)
      { protocol: 'https', hostname: 'ik.imagekit.io' },
    ],
  },
  generateEtags: true,
  compress: true,

  async redirects() {
    const cities = ['bruxelles', 'anvers', 'gand', 'liege']

    // Old flat category-city → new hierarchical URLs
    const categoryMap: Record<string, string> = {
      transport: 'automobile-transport',
      sport: 'sport-loisirs',
      construction: 'immobilier-construction',
      services: 'services-professionnels',
    }

    // Old flat subcategory-city → new hierarchical URLs
    const subcategoryMap: Record<string, [string, string]> = {
      // [newSiloSlug, newSubSlug]
      taxi: ['automobile-transport', 'taxi'],
      autocar: ['automobile-transport', 'location-autocar'],
      demenagement: ['automobile-transport', 'demenagement'],
      'transport-marchandises': ['automobile-transport', 'transport-marchandises'],
      gym: ['sport-loisirs', 'gym-fitness'],
      piscine: ['sport-loisirs', 'piscine'],
      tennis: ['sport-loisirs', 'tennis'],
      football: ['sport-loisirs', 'football'],
      renovation: ['immobilier-construction', 'renovation'],
      toiture: ['immobilier-construction', 'toiture'],
      electricite: ['immobilier-construction', 'electricite'],
      plomberie: ['immobilier-construction', 'plomberie'],
      nettoyage: ['services-professionnels', 'nettoyage'],
      securite: ['services-professionnels', 'securite-gardiennage'],
      informatique: ['services-professionnels', 'informatique'],
      comptabilite: ['services-professionnels', 'comptabilite'],
    }

    const redirects = []

    // Category redirects: /transport-bruxelles → /bruxelles/automobile-transport
    for (const [oldCat, newSilo] of Object.entries(categoryMap)) {
      for (const city of cities) {
        redirects.push({
          source: `/${oldCat}-${city}`,
          destination: `/${city}/${newSilo}`,
          permanent: true,
        })
      }
    }

    // Subcategory redirects: /taxi-bruxelles → /bruxelles/automobile-transport/taxi
    for (const [oldSub, [newSilo, newSubSlug]] of Object.entries(subcategoryMap)) {
      for (const city of cities) {
        redirects.push({
          source: `/${oldSub}-${city}`,
          destination: `/${city}/${newSilo}/${newSubSlug}`,
          permanent: true,
        })
      }
    }

    return redirects
  },
}

export default nextConfig

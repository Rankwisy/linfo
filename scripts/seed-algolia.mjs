/**
 * Seed script — pushes all businesses to Algolia index
 *
 * Usage:
 *   1. Copy .env.local.example → .env.local and fill in your keys
 *   2. node scripts/seed-algolia.mjs
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

// Parse .env.local manually (no dotenv dependency needed)
try {
  const envPath = resolve(process.cwd(), '.env.local')
  const lines = readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const value = trimmed.slice(eqIdx + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
} catch {
  // .env.local may not exist in CI — rely on actual env vars
}

const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY
const INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'linfo_businesses'

if (!APP_ID || !ADMIN_KEY) {
  console.error('Missing NEXT_PUBLIC_ALGOLIA_APP_ID or ALGOLIA_ADMIN_KEY in .env.local')
  process.exit(1)
}

// Import business data — inline to avoid TS module resolution issues
const businesses = [
  {
    objectID: 'bru-autocar-001',
    name: 'Brussels Airport Express',
    slug: 'brussels-airport-express-bruxelles',
    category: 'transport',
    subcategory: 'autocar',
    city: 'bruxelles',
    description: 'Transport en autocar entre Bruxelles et l\'aéroport de Zaventem.',
    shortDescription: 'Transport en autocar entre Bruxelles et l\'aéroport.',
    tags: ['autocar', 'aéroport', 'transfert', 'groupe', 'transport'],
    featured: true,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    objectID: 'bru-autocar-002',
    name: 'BelCoach Services',
    slug: 'belcoach-services-bruxelles',
    category: 'transport',
    subcategory: 'autocar',
    city: 'bruxelles',
    description: 'Location d\'autocars pour excursions, événements et voyages en Europe.',
    shortDescription: 'Location d\'autocars pour excursions, événements et voyages.',
    tags: ['autocar', 'excursion', 'événement', 'voyage', 'groupe'],
    featured: false,
    rating: 4.5,
    reviewCount: 87,
  },
  {
    objectID: 'bru-taxi-001',
    name: 'Taxi Brussels Premium',
    slug: 'taxi-brussels-premium-bruxelles',
    category: 'transport',
    subcategory: 'taxi',
    city: 'bruxelles',
    description: 'Service de taxi haut de gamme à Bruxelles, disponible 24h/24.',
    shortDescription: 'Service de taxi premium à Bruxelles, disponible 24h/24.',
    tags: ['taxi', 'vtc', 'transfert', 'aéroport', 'bruxelles'],
    featured: true,
    rating: 4.7,
    reviewCount: 342,
  },
  {
    objectID: 'bru-taxi-002',
    name: 'Taxi Vert Bruxelles',
    slug: 'taxi-vert-bruxelles-bruxelles',
    category: 'transport',
    subcategory: 'taxi',
    city: 'bruxelles',
    description: 'L\'une des plus anciennes compagnies de taxi de Bruxelles.',
    shortDescription: 'Compagnie de taxi historique de Bruxelles.',
    tags: ['taxi', 'bruxelles', 'course'],
    featured: false,
    rating: 4.3,
    reviewCount: 218,
  },
  {
    objectID: 'bru-gym-001',
    name: 'Brussels Fitness Club',
    slug: 'brussels-fitness-club-bruxelles',
    category: 'sport',
    subcategory: 'gym',
    city: 'bruxelles',
    description: 'Centre de fitness avec 50+ cours collectifs, ouvert 7j/7.',
    shortDescription: 'Centre de fitness moderne avec 50+ cours collectifs.',
    tags: ['gym', 'fitness', 'musculation', 'cours collectifs'],
    featured: true,
    rating: 4.9,
    reviewCount: 456,
  },
  {
    objectID: 'bru-gym-002',
    name: 'FitZone Ixelles',
    slug: 'fitzone-ixelles-bruxelles',
    category: 'sport',
    subcategory: 'gym',
    city: 'bruxelles',
    description: 'Salle de sport boutique à Ixelles. CrossFit, yoga et HIIT.',
    shortDescription: 'Salle de sport boutique à Ixelles.',
    tags: ['gym', 'crossfit', 'yoga', 'hiit'],
    featured: false,
    rating: 4.6,
    reviewCount: 198,
  },
  {
    objectID: 'bru-gym-003',
    name: 'Basic-Fit Bruxelles Centre',
    slug: 'basic-fit-bruxelles-centre-bruxelles',
    category: 'sport',
    subcategory: 'gym',
    city: 'bruxelles',
    description: 'Salle de sport accessible à prix mini. Plus de 200 appareils.',
    shortDescription: 'Salle de sport accessible à prix mini.',
    tags: ['gym', 'fitness', 'pas cher', 'musculation'],
    featured: false,
    rating: 4.1,
    reviewCount: 512,
  },
  {
    objectID: 'bru-piscine-001',
    name: 'Piscine de Saint-Gilles',
    slug: 'piscine-de-saint-gilles-bruxelles',
    category: 'sport',
    subcategory: 'piscine',
    city: 'bruxelles',
    description: 'Piscine Art Nouveau classée, bassin 25m. Cours de natation.',
    shortDescription: 'Piscine Art Nouveau classée à Saint-Gilles.',
    tags: ['piscine', 'natation', 'aquatique', 'sport'],
    featured: true,
    rating: 4.4,
    reviewCount: 167,
  },
  {
    objectID: 'bru-dem-001',
    name: 'Brussels Moving Company',
    slug: 'brussels-moving-company-bruxelles',
    category: 'transport',
    subcategory: 'demenagement',
    city: 'bruxelles',
    description: 'Déménagements professionnels à Bruxelles. Emballage et assurance inclus.',
    shortDescription: 'Déménagements professionnels à Bruxelles.',
    tags: ['déménagement', 'transport', 'déménageur', 'bruxelles'],
    featured: false,
    rating: 4.5,
    reviewCount: 143,
  },
]

async function seed() {
  const url = `https://${APP_ID}-dsn.algolia.net/1/indexes/${INDEX_NAME}/batch`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Algolia-Application-Id': APP_ID,
      'X-Algolia-API-Key': ADMIN_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: businesses.map((b) => ({
        action: 'updateObject',
        body: b,
      })),
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('Algolia error:', err)
    process.exit(1)
  }

  const result = await response.json()
  console.log(`✅ Indexed ${businesses.length} businesses to "${INDEX_NAME}"`)
  console.log('Task IDs:', result.taskID)
}

seed().catch(console.error)

/**
 * seed-apify.mjs — Scrape Belgian businesses from Google Maps via Apify
 * and insert them into Supabase.
 *
 * Prerequisites:
 *   1. Add APIFY_API_TOKEN to .env.local
 *   2. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local
 *      (or use SUPABASE_SERVICE_ROLE_KEY for upserts without RLS)
 *   3. node scripts/seed-apify.mjs
 *
 * The script calls the Apify Google Maps Scraper actor for each
 * category × city combination and upserts results into the businesses table.
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

// ── Load .env.local ──────────────────────────────────────────────────────────
try {
  const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
  for (const line of lines) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    const key = t.slice(0, eq).trim()
    const val = t.slice(eq + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
} catch { /* rely on real env vars in CI */ }

const APIFY_TOKEN   = process.env.APIFY_API_TOKEN
const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!APIFY_TOKEN)  { console.error('Missing APIFY_API_TOKEN'); process.exit(1) }
if (!SUPABASE_URL) { console.error('Missing NEXT_PUBLIC_SUPABASE_URL'); process.exit(1) }
if (!SUPABASE_KEY) { console.error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY'); process.exit(1) }

// ── Config: what to scrape ───────────────────────────────────────────────────
const SEARCH_QUERIES = [
  { searchStringsArray: ['taxi Bruxelles'],          category: 'transport', subcategory: 'taxi',          city: 'bruxelles' },
  { searchStringsArray: ['autocar Bruxelles'],        category: 'transport', subcategory: 'autocar',       city: 'bruxelles' },
  { searchStringsArray: ['déménagement Bruxelles'],   category: 'transport', subcategory: 'demenagement',  city: 'bruxelles' },
  { searchStringsArray: ['salle de sport Bruxelles'], category: 'sport',     subcategory: 'gym',           city: 'bruxelles' },
  { searchStringsArray: ['piscine Bruxelles'],        category: 'sport',     subcategory: 'piscine',       city: 'bruxelles' },
  { searchStringsArray: ['taxi Anvers'],              category: 'transport', subcategory: 'taxi',          city: 'anvers'    },
  { searchStringsArray: ['gym Gand'],                 category: 'sport',     subcategory: 'gym',           city: 'gand'      },
  { searchStringsArray: ['rénovation Bruxelles'],     category: 'construction', subcategory: 'renovation', city: 'bruxelles' },
  { searchStringsArray: ['électricien Bruxelles'],    category: 'construction', subcategory: 'electricite',city: 'bruxelles' },
  { searchStringsArray: ['nettoyage Bruxelles'],      category: 'services',  subcategory: 'nettoyage',     city: 'bruxelles' },
]

const MAX_RESULTS_PER_QUERY = 10
// Apify actor for Google Maps — https://apify.com/compass/crawler-google-places
const ACTOR_ID = 'compass~crawler-google-places'

// ── Helpers ──────────────────────────────────────────────────────────────────
function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function runApifyActor(input) {
  const runRes = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${APIFY_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }
  )
  if (!runRes.ok) throw new Error(`Apify run failed: ${await runRes.text()}`)
  const { data: run } = await runRes.json()

  // Poll until finished
  let status = run.status
  while (!['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT'].includes(status)) {
    await new Promise((r) => setTimeout(r, 5000))
    const statusRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${run.id}?token=${APIFY_TOKEN}`
    )
    const { data } = await statusRes.json()
    status = data.status
    process.stdout.write('.')
  }
  console.log(`\nRun ${run.id}: ${status}`)

  if (status !== 'SUCCEEDED') throw new Error(`Actor run ${status}`)

  // Fetch dataset items
  const dataRes = await fetch(
    `https://api.apify.com/v2/actor-runs/${run.id}/dataset/items?token=${APIFY_TOKEN}&limit=${MAX_RESULTS_PER_QUERY}`
  )
  return await dataRes.json()
}

async function upsertToSupabase(rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/businesses`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify(rows),
  })
  if (!res.ok) {
    const err = await res.text()
    console.error('Supabase upsert error:', err)
  } else {
    console.log(`✅ Upserted ${rows.length} rows`)
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  for (const query of SEARCH_QUERIES) {
    const { searchStringsArray, category, subcategory, city } = query
    console.log(`\n🔍 Scraping: ${searchStringsArray[0]}`)

    try {
      const items = await runApifyActor({
        searchStringsArray,
        maxCrawledPlacesPerSearch: MAX_RESULTS_PER_QUERY,
        language: 'fr',
        countryCode: 'be',
        includeHistogram: false,
        includeOpeningHours: false,
        includePeopleAlsoSearch: false,
      })

      if (!items.length) { console.log('No results'); continue }

      const rows = items
        .filter((item) => item.title && item.address)
        .map((item) => {
          const objectId = `${city}-${subcategory}-${slugify(item.title).slice(0, 30)}`
          return {
            object_id: objectId,
            name: item.title,
            slug: `${slugify(item.title)}-${city}`,
            category,
            subcategory,
            city,
            address: item.address ?? null,
            phone: item.phone ?? null,
            email: item.email ?? null,
            website: item.website ?? null,
            description: item.description ?? item.categoryName ?? null,
            short_description: item.categoryName ?? null,
            tags: [subcategory, city, ...(item.categoryName ? [item.categoryName.toLowerCase()] : [])],
            featured: false,
            rating: item.totalScore ?? 0,
            review_count: item.reviewsCount ?? 0,
            lat: item.location?.lat ?? null,
            lng: item.location?.lng ?? null,
            image_url: item.imageUrl ?? null,
          }
        })

      await upsertToSupabase(rows)
    } catch (err) {
      console.error(`Error for "${searchStringsArray[0]}":`, err.message)
    }
  }

  console.log('\n🎉 Seeding complete!')
}

main().catch(console.error)

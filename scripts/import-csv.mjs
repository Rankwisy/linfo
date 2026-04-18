/**
 * One-shot CSV import script
 * Run from project root:  node scripts/import-csv.mjs
 *
 * Reads the Outscraper CSV, maps each row to the correct
 * category + subcategory + city slug, deduplicates against the
 * live Supabase DB (by place_id), and inserts new records in batches.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import Papa from 'papaparse'
import { randomUUID } from 'crypto'

// ─── Config ──────────────────────────────────────────────────────────────────

const SUPABASE_URL = 'https://hfrphfbcuhtxbgcyjkbc.supabase.co'
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcnBoZmJjdWh0eGJnY3lqa2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTA2NjIsImV4cCI6MjA5MDk4NjY2Mn0.mG-yBz7fqW3Ofs-2Id4LhydzXx_5e6OibMCtoeoEOEI'

const CSV_PATH =
  'C:\\Users\\Usuario\\Downloads\\Outscraper-20260417115443s7a_linfo.be_linfo2.csv'

const BATCH_SIZE = 100

// ─── Category / subcategory mapping (CSV query → DB fields) ──────────────────
// category   = businesses.category  (matches silo dbCategory)
// subcategory = businesses.subcategory (matches silo subcategory dbSubcategory)

const QUERY_MAP = {
  'web agencies Brussels Belgium':           { category: 'informatique',  subcategory: 'marketing-digital' },
  'accountants Antwerp Belgium':             { category: 'services',      subcategory: 'comptabilite' },
  'accountants Ghent Belgium':               { category: 'services',      subcategory: 'comptabilite' },
  'architects Brussels Belgium':             { category: 'construction',  subcategory: 'renovation' },
  'cafes Ghent Belgium':                     { category: 'restauration',  subcategory: 'restaurant' },
  'car rental Antwerp Belgium':              { category: 'transport',     subcategory: 'taxi' },
  'doctors Brussels Belgium':                { category: 'sante',         subcategory: 'medecine-generale' },
  'driving schools Brussels Belgium':        { category: 'education',     subcategory: 'formation-professionnelle' },
  'pharmacies Antwerp Belgium':              { category: 'sante',         subcategory: 'pharmacie' },
  'physiotherapy Ghent Belgium':             { category: 'sante',         subcategory: 'kinesitherapie' },
  'real estate agencies Brussels Belgium':   { category: 'construction',  subcategory: 'renovation' },
  'real estate agencies Liege Belgium':      { category: 'construction',  subcategory: 'renovation' },
  'spas Brussels Belgium':                   { category: 'beaute',        subcategory: 'spa' },
}

// ─── City normalisation (CSV city value → our slug) ──────────────────────────
// Brussels Region communes → bruxelles
// Antwerp metro  → anvers
// Ghent metro    → gand
// Liège area     → liege

const CITY_SLUG = {
  Brussels:                    'bruxelles',
  Bruxelles:                   'bruxelles',
  Brussel:                     'bruxelles',
  Anderlecht:                  'bruxelles',
  Auderghem:                   'bruxelles',
  Etterbeek:                   'bruxelles',
  Evere:                       'bruxelles',
  Forest:                      'bruxelles',
  Ixelles:                     'bruxelles',
  Jette:                       'bruxelles',
  'Saint-Gilles':              'bruxelles',
  'Saint-Josse-ten-Noode':     'bruxelles',
  Schaerbeek:                  'bruxelles',
  'Sint-Jans-Molenbeek':       'bruxelles',
  Uccle:                       'bruxelles',
  'Watermael-Boitsfort':       'bruxelles',
  'Woluwe-Saint-Lambert':      'bruxelles',
  'Woluwe-Saint-Pierre':       'bruxelles',
  Antwerp:                     'anvers',
  'Beveren-Kruibeke-Zwijndrecht': 'anvers',
  Boechout:                    'anvers',
  Schoten:                     'anvers',
  Stabroek:                    'anvers',
  Ghent:                       'gand',
  Destelbergen:                'gand',
  Evergem:                     'gand',
  Lievegem:                    'gand',
  'Sint-Martens-Latem':        'gand',
  'Liège':                     'liege',
  'Neupré':                    'liege',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
}

function clean(v) {
  const s = (v ?? '').trim()
  return s === '' ? null : s
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// 1. Parse CSV
console.log('Reading CSV…')
const csvText = readFileSync(CSV_PATH, 'utf-8')
const { data: rawRows, errors: parseErrors } = Papa.parse(csvText, {
  header: true,
  skipEmptyLines: true,
})
if (parseErrors.length) {
  console.warn('Parse warnings:', parseErrors.slice(0, 3))
}
console.log(`Parsed ${rawRows.length} rows`)

// 2. Deduplicate CSV by place_id (Outscraper sometimes returns the same
//    business twice when it appears in multiple queries)
const seenPlaceIds = new Set()
const uniqueRows = []
let csvDupes = 0
for (const row of rawRows) {
  const pid = row.place_id?.trim()
  if (!pid) { uniqueRows.push(row); continue }
  if (seenPlaceIds.has(pid)) { csvDupes++; continue }
  seenPlaceIds.add(pid)
  uniqueRows.push(row)
}
console.log(`CSV duplicates removed: ${csvDupes} → ${uniqueRows.length} unique`)

// 3. Fetch ALL existing object_ids AND slugs (paginated — Supabase caps at 1000/request)
console.log('Fetching existing DB records (paginated)…')
const existingIds   = new Set()
const existingSlugs = new Set()
const PAGE = 1000
let   page = 0
while (true) {
  const { data, error } = await supabase
    .from('businesses')
    .select('object_id, slug')
    .range(page * PAGE, (page + 1) * PAGE - 1)
  if (error) { console.error('Fetch error:', error.message); process.exit(1) }
  if (!data || data.length === 0) break
  for (const r of data) {
    existingIds.add(r.object_id)
    existingSlugs.add(r.slug)
  }
  if (data.length < PAGE) break
  page++
}
console.log(`Existing DB records: ${existingIds.size}`)

// 4. Build insert payload
const slugCounts = {}   // track slugs already allocated in this import run
const toInsert = []
const skipped = { noMapping: 0, noCity: 0, alreadyInDb: 0, noName: 0 }

for (const row of uniqueRows) {
  const query = row.query?.trim()
  const mapping = QUERY_MAP[query]
  if (!mapping) { skipped.noMapping++; continue }

  const citySlug = CITY_SLUG[row.city?.trim()]
  if (!citySlug) { skipped.noCity++; continue }

  const name = clean(row.name)
  if (!name) { skipped.noName++; continue }

  // Use Google place_id as stable object_id; fall back to UUID
  const objectId = row.place_id?.trim() || randomUUID()
  if (existingIds.has(objectId)) { skipped.alreadyInDb++; continue }

  // Build unique slug — check against both existing DB slugs and slugs
  // already allocated in this batch to avoid constraint violations
  const rawSlug = slugify(`${name}-${citySlug}`)
  let baseSlug = rawSlug
  let suffix = 1
  while (existingSlugs.has(baseSlug) || slugCounts[baseSlug]) {
    baseSlug = `${rawSlug}-${suffix++}`
  }
  slugCounts[baseSlug] = true
  existingSlugs.add(baseSlug)   // reserve it for future rows in this run

  const rating      = Math.min(5, Math.max(0, parseFloat(row.rating) || 0))
  const reviewCount = Math.max(0, parseInt(row.reviews)  || 0)
  const shortDesc   = (clean(row.website_description) ?? clean(row.description) ?? '').slice(0, 220)
  const fullDesc    = clean(row.description) ?? clean(row.website_description) ?? null
  const tags        = (row.subtypes ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 6)

  // Only use valid / receiving emails
  const emailStatus = (row['email.emails_validator.status'] ?? '').toUpperCase()
  const email       = emailStatus === 'RECEIVING' ? clean(row.email) : null

  toInsert.push({
    object_id:         objectId,
    name,
    slug:              baseSlug,
    category:          mapping.category,
    subcategory:       mapping.subcategory,
    city:              citySlug,
    address:           clean(row.address),
    phone:             clean(row.phone),
    email,
    website:           clean(row.website),
    description:       fullDesc,
    short_description: shortDesc || null,
    tags,
    featured:          false,
    rating,
    review_count:      reviewCount,
    lat:               parseFloat(row.latitude)  || null,
    lng:               parseFloat(row.longitude) || null,
    image_url:         clean(row.photo) ?? clean(row.logo) ?? null,
  })
}

console.log('\n── Summary before insert ───────────────────')
console.log(`  To insert:          ${toInsert.length}`)
console.log(`  Skipped (no map):   ${skipped.noMapping}`)
console.log(`  Skipped (no city):  ${skipped.noCity}`)
console.log(`  Skipped (in DB):    ${skipped.alreadyInDb}`)
console.log(`  Skipped (no name):  ${skipped.noName}`)
console.log('────────────────────────────────────────────\n')

if (toInsert.length === 0) {
  console.log('Nothing to insert. Done.')
  process.exit(0)
}

// 5. Insert in batches
let inserted = 0
let insertErrors = 0

for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
  const batch = toInsert.slice(i, i + BATCH_SIZE)
  const { error } = await supabase
    .from('businesses')
    .upsert(batch, { onConflict: 'object_id', ignoreDuplicates: true })
  if (error) {
    console.error(`  ✗ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, error.message)
    insertErrors += batch.length
  } else {
    inserted += batch.length
    console.log(`  ✓ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${inserted}/${toInsert.length} inserted`)
  }
}

console.log('\n════════════════════════════════════════════')
console.log(`  Inserted: ${inserted}`)
console.log(`  Errors:   ${insertErrors}`)
console.log('════════════════════════════════════════════')

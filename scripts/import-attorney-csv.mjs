/**
 * import-attorney-csv.mjs
 *
 * Imports Outscraper-20260418131659m22_attorney_+3.csv into the businesses table.
 *
 * City mapping via postal code (no reliable state field in BE data):
 *   1000-1999 → bruxelles
 *   2000-3999 → anvers   (Province d'Anvers + Brabant flamand + Limbourg)
 *   4000-7999 → liege    (Liège + Namur + Hainaut + Luxembourg)
 *   8000-8999 → anvers   (West-Flandre)
 *   9000-9999 → gand     (Flandre orientale)
 *
 * Quality filters:
 *   - country_code === 'BE'
 *   - Has name
 *   - Has phone OR website
 *   - business_status is empty or OPERATIONAL (row corruption drops others)
 *   - Unique by place_id (first occurrence wins after dedup)
 *
 * Run: node scripts/import-attorney-csv.mjs
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import readline from 'readline'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const supabase = createClient(
  'https://hfrphfbcuhtxbgcyjkbc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcnBoZmJjdWh0eGJnY3lqa2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTA2NjIsImV4cCI6MjA5MDk4NjY2Mn0.mG-yBz7fqW3Ofs-2Id4LhydzXx_5e6OibMCtoeoEOEI'
)

// ─── Postal code → City slug ──────────────────────────────────────────────────
function getCityFromPostal(postal) {
  const p = parseInt(postal)
  if (isNaN(p)) return null
  if (p >= 1000 && p <= 1999) return 'bruxelles'
  if (p >= 2000 && p <= 3999) return 'anvers'
  if (p >= 4000 && p <= 7999) return 'liege'
  if (p >= 8000 && p <= 8999) return 'anvers'   // West-Flandre → anvers
  if (p >= 9000 && p <= 9999) return 'gand'      // Flandre orientale → gand
  return null
}

// ─── Subtype → { category, subcategory } ─────────────────────────────────────
const SUBTYPE_MAP = {
  // ── Juridique / Avocat ──
  'lawyer':                         { category: 'juridique',     subcategory: 'avocat' },
  'advocate':                       { category: 'juridique',     subcategory: 'avocat' },
  'advocaat':                       { category: 'juridique',     subcategory: 'avocat' },
  'advocatenkantoor':               { category: 'juridique',     subcategory: 'avocat' },
  'law firm':                       { category: 'juridique',     subcategory: 'avocat' },
  'general practice attorney':      { category: 'juridique',     subcategory: 'avocat' },
  'criminal justice attorney':      { category: 'juridique',     subcategory: 'avocat' },
  'divorce lawyer':                 { category: 'juridique',     subcategory: 'avocat' },
  'divorce service':                { category: 'juridique',     subcategory: 'avocat' },
  'family law attorney':            { category: 'juridique',     subcategory: 'avocat' },
  'estate planning attorney':       { category: 'juridique',     subcategory: 'avocat' },
  'labor relations attorney':       { category: 'juridique',     subcategory: 'avocat' },
  'real estate attorney':           { category: 'juridique',     subcategory: 'avocat' },
  'social security attorney':       { category: 'juridique',     subcategory: 'avocat' },
  'legal services':                 { category: 'juridique',     subcategory: 'avocat' },
  'legal aid office':               { category: 'juridique',     subcategory: 'avocat' },
  'attorney referral service':      { category: 'juridique',     subcategory: 'avocat' },
  'immigration attorney':           { category: 'juridique',     subcategory: 'avocat' },
  'patent attorney':                { category: 'juridique',     subcategory: 'avocat' },
  'personal injury attorney':       { category: 'juridique',     subcategory: 'avocat' },
  'bankruptcy attorney':            { category: 'juridique',     subcategory: 'avocat' },
  'tax attorney':                   { category: 'juridique',     subcategory: 'conseil-financier' },
  'intellectual property attorney': { category: 'juridique',     subcategory: 'avocat' },
  'commercial agent':               { category: 'juridique',     subcategory: 'avocat' },
  // ── Juridique / Notaire ──
  'notary public':                  { category: 'juridique',     subcategory: 'notaire' },
  'notary':                         { category: 'juridique',     subcategory: 'notaire' },
  'notary office':                  { category: 'juridique',     subcategory: 'notaire' },
  'notaris':                        { category: 'juridique',     subcategory: 'notaire' },
  // ── Juridique / Assurance ──
  'insurance attorney':             { category: 'juridique',     subcategory: 'assurance' },
  'insurance agency':               { category: 'juridique',     subcategory: 'assurance' },
  'insurance broker':               { category: 'juridique',     subcategory: 'assurance' },
  'insurance company':              { category: 'juridique',     subcategory: 'assurance' },
  'insurance':                      { category: 'juridique',     subcategory: 'assurance' },
  // ── Juridique / Conseil financier ──
  'certified public accountant':    { category: 'juridique',     subcategory: 'conseil-financier' },
  'accounting firm':                { category: 'juridique',     subcategory: 'conseil-financier' },
  'chartered accountant':           { category: 'juridique',     subcategory: 'conseil-financier' },
  'bookkeeping service':            { category: 'juridique',     subcategory: 'conseil-financier' },
  'accountant':                     { category: 'juridique',     subcategory: 'conseil-financier' },
  'financial planner':              { category: 'juridique',     subcategory: 'conseil-financier' },
  'financial consultant':           { category: 'juridique',     subcategory: 'conseil-financier' },
  'tax advisor':                    { category: 'juridique',     subcategory: 'conseil-financier' },
  'tax consultant':                 { category: 'juridique',     subcategory: 'conseil-financier' },
  'tax preparation service':        { category: 'juridique',     subcategory: 'conseil-financier' },
  'financial advisor':              { category: 'juridique',     subcategory: 'conseil-financier' },
  // ── Services professionnels ──
  'business management consultant': { category: 'services',      subcategory: 'comptabilite' },
  'consultant':                     { category: 'services',      subcategory: 'comptabilite' },
  'business development service':   { category: 'services',      subcategory: 'comptabilite' },
  'business to business service':   { category: 'services',      subcategory: 'comptabilite' },
  'management consultant':          { category: 'services',      subcategory: 'comptabilite' },
  'corporate office':               { category: 'services',      subcategory: 'comptabilite' },
  'recruiter':                      { category: 'services',      subcategory: 'securite' },
  'employment agency':              { category: 'services',      subcategory: 'securite' },
  'temp agency':                    { category: 'services',      subcategory: 'securite' },
  'human resource consulting':      { category: 'services',      subcategory: 'comptabilite' },
  'security service':               { category: 'services',      subcategory: 'securite' },
  'security system supplier':       { category: 'services',      subcategory: 'securite' },
  'cleaning service':               { category: 'services',      subcategory: 'nettoyage' },
  'janitorial service':             { category: 'services',      subcategory: 'nettoyage' },
  'office cleaning service':        { category: 'services',      subcategory: 'nettoyage' },
  'translation service':            { category: 'services',      subcategory: 'comptabilite' },
  'notarial services':              { category: 'juridique',     subcategory: 'notaire' },
  // ── Informatique ──
  'website designer':               { category: 'informatique',  subcategory: 'developpement-web' },
  'web designer':                   { category: 'informatique',  subcategory: 'developpement-web' },
  'web developer':                  { category: 'informatique',  subcategory: 'developpement-web' },
  'software company':               { category: 'informatique',  subcategory: 'developpement-web' },
  'software developer':             { category: 'informatique',  subcategory: 'developpement-web' },
  'computer consultant':            { category: 'informatique',  subcategory: 'developpement-web' },
  'it services':                    { category: 'informatique',  subcategory: 'developpement-web' },
  'internet marketing service':     { category: 'informatique',  subcategory: 'marketing-digital' },
  'marketing agency':               { category: 'informatique',  subcategory: 'marketing-digital' },
  'seo company':                    { category: 'informatique',  subcategory: 'marketing-digital' },
  'advertising agency':             { category: 'informatique',  subcategory: 'marketing-digital' },
  'graphic designer':               { category: 'informatique',  subcategory: 'developpement-web' },
  'web hosting company':            { category: 'informatique',  subcategory: 'cloud-hosting' },
  'data recovery service':          { category: 'informatique',  subcategory: 'developpement-web' },
  'computer repair service':        { category: 'informatique',  subcategory: 'developpement-web' },
  'telecommunications service provider': { category: 'informatique', subcategory: 'cloud-hosting' },
  // ── Santé ──
  'doctor':                         { category: 'sante',         subcategory: 'medecine-generale' },
  'general practitioner':           { category: 'sante',         subcategory: 'medecine-generale' },
  'medical clinic':                 { category: 'sante',         subcategory: 'medecine-generale' },
  'family practice physician':      { category: 'sante',         subcategory: 'medecine-generale' },
  'dentist':                        { category: 'sante',         subcategory: 'dentiste' },
  'dental clinic':                  { category: 'sante',         subcategory: 'dentiste' },
  'orthodontist':                   { category: 'sante',         subcategory: 'dentiste' },
  'pharmacy':                       { category: 'sante',         subcategory: 'pharmacie' },
  'pharmacie':                      { category: 'sante',         subcategory: 'pharmacie' },
  'physical therapist':             { category: 'sante',         subcategory: 'kinesitherapie' },
  'physiotherapist':                { category: 'sante',         subcategory: 'kinesitherapie' },
  'physical therapy clinic':        { category: 'sante',         subcategory: 'kinesitherapie' },
  // ── Événementiel ──
  'event venue':                    { category: 'evenementiel',  subcategory: 'lieu-reception' },
  'banquet hall':                   { category: 'evenementiel',  subcategory: 'lieu-reception' },
  'conference center':              { category: 'evenementiel',  subcategory: 'lieu-reception' },
  'event planner':                  { category: 'evenementiel',  subcategory: 'organisation-evenements' },
  'wedding venue':                  { category: 'evenementiel',  subcategory: 'lieu-reception' },
  'party planner':                  { category: 'evenementiel',  subcategory: 'organisation-evenements' },
  'cultural center':                { category: 'evenementiel',  subcategory: 'lieu-reception' },
  'photographer':                   { category: 'evenementiel',  subcategory: 'photographe' },
  'photography studio':             { category: 'evenementiel',  subcategory: 'photographe' },
  'dj':                             { category: 'evenementiel',  subcategory: 'dj-animation' },
  // ── Beauté ──
  'hair salon':                     { category: 'beaute',        subcategory: 'coiffeur' },
  'hairdresser':                    { category: 'beaute',        subcategory: 'coiffeur' },
  'barber shop':                    { category: 'beaute',        subcategory: 'coiffeur' },
  'beauty salon':                   { category: 'beaute',        subcategory: 'esthetique' },
  'nail salon':                     { category: 'beaute',        subcategory: 'esthetique' },
  'massage spa':                    { category: 'beaute',        subcategory: 'spa' },
  'wellness center':                { category: 'beaute',        subcategory: 'spa' },
  'day spa':                        { category: 'beaute',        subcategory: 'spa' },
  // ── Construction ──
  'construction company':           { category: 'construction',  subcategory: 'renovation' },
  'general contractor':             { category: 'construction',  subcategory: 'renovation' },
  'electrician':                    { category: 'construction',  subcategory: 'electricite' },
  'plumber':                        { category: 'construction',  subcategory: 'plomberie' },
  'roofing contractor':             { category: 'construction',  subcategory: 'toiture' },
  'interior designer':              { category: 'construction',  subcategory: 'renovation' },
  'real estate agency':             { category: 'construction',  subcategory: 'renovation' },
  'real estate agent':              { category: 'construction',  subcategory: 'renovation' },
  // ── Transport ──
  'taxi service':                   { category: 'automobile',    subcategory: 'taxi' },
  'moving company':                 { category: 'automobile',    subcategory: 'demenagement' },
  'car dealer':                     { category: 'automobile',    subcategory: 'reparation-auto' },
  'auto repair shop':               { category: 'automobile',    subcategory: 'reparation-auto' },
  // ── Mariage ──
  'wedding photographer':           { category: 'mariage',       subcategory: 'photographe-mariage' },
  'bridal shop':                    { category: 'mariage',       subcategory: 'robe-mariee' },
  'wedding planner':                { category: 'mariage',       subcategory: 'wedding-planner' },
  'florist':                        { category: 'mariage',       subcategory: 'fleuriste-mariage' },
  'caterer':                        { category: 'mariage',       subcategory: 'traiteur-mariage' },
}

// ─── Map the first matching subtype to a category ─────────────────────────────
function mapCategory(subtypesRaw) {
  if (!subtypesRaw) return null
  const parts = subtypesRaw.split(',').map(s => s.trim().toLowerCase())
  for (const part of parts) {
    if (SUBTYPE_MAP[part]) return SUBTYPE_MAP[part]
  }
  return null
}

// ─── Slug generator ───────────────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

// ─── CSV row parser (state-machine, handles quoted commas & escaped quotes) ───
function parseCSVRow(line) {
  const fields = []
  let field = ''
  let inQuote = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      if (inQuote && line[i + 1] === '"') { field += '"'; i++ }
      else inQuote = !inQuote
    } else if (c === ',' && !inQuote) {
      fields.push(field); field = ''
    } else {
      field += c
    }
  }
  fields.push(field)
  return fields
}

// ─── Column indices (verified against header row) ────────────────────────────
const IDX = {
  name: 1, subtypes: 3, phone: 6, website: 7, address: 8,
  city: 10, postal: 14, countryCode: 16, email: 30,
  rating: 51, reviews: 52, photo: 62, logo: 64,
  description: 80, placeId: 88, lat: 45, lng: 46,
  status: 67,
}

// ─── Main ────────────────────────────────────────────────────────────────────
const CSV_PATH = path.join(__dirname, '..', '..', '..', 'Downloads',
  'Outscraper-20260418131659m22_attorney_+3.csv')

async function main() {
  console.log('📂 Reading CSV:', CSV_PATH)

  // ── Step 1: parse and filter ──
  const seen = new Set()           // place_id deduplication
  const slugCounts = {}            // slug collision counter
  const records = []

  const rl = readline.createInterface({
    input: fs.createReadStream(CSV_PATH),
    crlfDelay: Infinity,
  })

  let lineNum = 0
  let skippedCountry = 0, skippedQuality = 0, skippedCategory = 0, skippedDupe = 0

  for await (const line of rl) {
    lineNum++
    if (lineNum === 1) continue // header

    const row = parseCSVRow(line)

    // ── Country filter ──
    if (row[IDX.countryCode] !== 'BE') { skippedCountry++; continue }

    // ── Quality filter ──
    const name = (row[IDX.name] || '').trim()
    const phone = (row[IDX.phone] || '').trim()
    const website = (row[IDX.website] || '').trim()
    if (!name || (!phone && !website)) { skippedQuality++; continue }

    // ── Dedup by place_id ──
    const placeId = (row[IDX.placeId] || '').trim()
    if (!placeId || seen.has(placeId)) { skippedDupe++; continue }
    seen.add(placeId)

    // ── Category mapping ──
    const catMap = mapCategory(row[IDX.subtypes])
    if (!catMap) { skippedCategory++; continue }

    // ── City mapping via postal code ──
    const city = getCityFromPostal(row[IDX.postal])
    if (!city) { skippedCategory++; continue }

    // ── Build record ──
    const rating = parseFloat(row[IDX.rating]) || null
    const reviews = parseInt(row[IDX.reviews]) || 0
    const lat = parseFloat(row[IDX.lat]) || null
    const lng = parseFloat(row[IDX.lng]) || null

    // Short description: use description field (first 200 chars)
    const desc = (row[IDX.description] || '').trim()
    const shortDesc = desc.length > 0
      ? desc.slice(0, 200)
      : null

    // Image: prefer logo, fall back to photo
    const imageUrl = (row[IDX.logo] || row[IDX.photo] || '').trim() || null

    // ── Slug with collision handling ──
    const base = slugify(name) + '-' + city
    slugCounts[base] = (slugCounts[base] || 0) + 1
    const slug = slugCounts[base] === 1 ? base : `${base}-${slugCounts[base]}`

    records.push({
      object_id:        placeId,
      slug,
      name,
      city,
      category:         catMap.category,
      subcategory:      catMap.subcategory,
      phone:            phone || null,
      email:            (row[IDX.email] || '').trim() || null,
      website:          website || null,
      address:          (row[IDX.address] || '').trim() || null,
      shortDescription: shortDesc,
      imageUrl,
      rating,
      reviewCount:      reviews,
      latitude:         lat,
      longitude:        lng,
      source:           'outscraper',
    })
  }

  console.log(`\n📊 Parse complete:`)
  console.log(`   Total lines:        ${lineNum - 1}`)
  console.log(`   Skipped (country):  ${skippedCountry}`)
  console.log(`   Skipped (quality):  ${skippedQuality}`)
  console.log(`   Skipped (dupe):     ${skippedDupe}`)
  console.log(`   Skipped (no cat):   ${skippedCategory}`)
  console.log(`   ✅ Mapped records:  ${records.length}`)

  // Category breakdown
  const catBreakdown = {}
  records.forEach(r => {
    const k = `${r.category}/${r.subcategory}`
    catBreakdown[k] = (catBreakdown[k] || 0) + 1
  })
  console.log('\n📂 Category breakdown:')
  Object.entries(catBreakdown).sort((a, b) => b[1] - a[1]).forEach(([k, v]) =>
    console.log(`   ${k}: ${v}`)
  )

  const cityBreakdown = {}
  records.forEach(r => { cityBreakdown[r.city] = (cityBreakdown[r.city] || 0) + 1 })
  console.log('\n🏙️ City breakdown:')
  Object.entries(cityBreakdown).forEach(([k, v]) => console.log(`   ${k}: ${v}`))

  if (records.length === 0) {
    console.log('\n⚠️  Nothing to insert.')
    return
  }

  // ── Step 2: check existing object_ids ──
  console.log('\n🔍 Checking for existing records in DB...')
  const allIds = records.map(r => r.object_id)
  const existing = new Set()
  for (let i = 0; i < allIds.length; i += 1000) {
    const chunk = allIds.slice(i, i + 1000)
    const { data } = await supabase
      .from('businesses')
      .select('object_id')
      .in('object_id', chunk)
    if (data) data.forEach(r => existing.add(r.object_id))
  }
  console.log(`   Already in DB: ${existing.size}`)

  const toInsert = records.filter(r => !existing.has(r.object_id))
  console.log(`   To insert:     ${toInsert.length}`)

  if (toInsert.length === 0) {
    console.log('\n✅ All records already in DB.')
    return
  }

  // ── Step 3: upsert in chunks of 100 ──
  const CHUNK = 100
  let inserted = 0, errors = 0

  for (let i = 0; i < toInsert.length; i += CHUNK) {
    const chunk = toInsert.slice(i, i + CHUNK)
    const payload = chunk.map(r => ({
      object_id:         r.object_id,
      slug:              r.slug,
      name:              r.name,
      city:              r.city,
      category:          r.category,
      subcategory:       r.subcategory,
      phone:             r.phone,
      email:             r.email,
      website:           r.website,
      address:           r.address,
      short_description: r.shortDescription,
      image_url:         r.imageUrl,
      rating:            r.rating,
      review_count:      r.reviewCount,
      lat:               r.latitude,
      lng:               r.longitude,
      tags:              [],
      featured:          false,
    }))

    const { error } = await supabase
      .from('businesses')
      .upsert(payload, { onConflict: 'object_id' })

    if (error) {
      console.error(`❌ Chunk ${i / CHUNK + 1} error:`, error.message)
      errors++
    } else {
      inserted += chunk.length
      if (inserted % 1000 === 0 || i + CHUNK >= toInsert.length) {
        process.stdout.write(`\r   Inserted: ${inserted} / ${toInsert.length}   `)
      }
    }
  }

  console.log(`\n\n✅ Done! Inserted: ${inserted}, Errors: ${errors}`)
}

main().catch(console.error)

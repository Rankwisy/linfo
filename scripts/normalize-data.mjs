/**
 * Normalize and clean all businesses in the Supabase DB.
 * Run: node scripts/normalize-data.mjs
 *
 * Normalizes: phone, website, name, address, short_description, description
 * Only updates rows where something actually changed.
 * Updates in batches of 50 (one .update() call per changed row).
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hfrphfbcuhtxbgcyjkbc.supabase.co'
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcnBoZmJjdWh0eGJnY3lqa2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTA2NjIsImV4cCI6MjA5MDk4NjY2Mn0.mG-yBz7fqW3Ofs-2Id4LhydzXx_5e6OibMCtoeoEOEI'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ─── Normalizers ────────────────────────────────────────────────────────────

/**
 * Normalize a Belgian phone number to the format:
 *   +32 X XX XX XX   (mobile / 9-digit local)
 *   +32 X XXX XX XX  (some regions — kept as-is after basic cleaning)
 *
 * Rules (applied in order):
 *   1. null / empty string → null
 *   2. Strip all dots → spaces
 *   3. If starts with `32` (no +): prepend `+`
 *   4. If starts with `0` (Belgian local): replace leading `0` with `+32 `
 *   5. Collapse multiple spaces to one, trim
 *   6. Replace internal spacing with canonical `+32 X XX XX XX` when possible
 */
function normalizePhone(raw) {
  if (raw == null) return null
  let p = String(raw).trim()
  if (p === '') return null

  // Replace dots and dashes used as separators with spaces
  p = p.replace(/[.\-]/g, ' ')

  // Remove all characters that are not digits, +, or space
  p = p.replace(/[^\d+ ]/g, '')

  // Collapse multiple spaces
  p = p.replace(/ +/g, ' ').trim()

  // `32...` without + → add +
  if (/^32\d/.test(p)) {
    p = '+' + p
  }

  // Belgian local format `0X...` → `+32 X...`
  if (/^0\d/.test(p)) {
    p = '+32 ' + p.slice(1)
  }

  // At this point we expect something like `+32 X XX XX XX` or `+32X...`
  // Ensure there's a space after +32 if missing
  p = p.replace(/^\+32(\d)/, '+32 $1')

  // Collapse multiple spaces again after replacement
  p = p.replace(/ +/g, ' ').trim()

  // If the result doesn't look like a Belgian number at all, return as cleaned
  return p === '' ? null : p
}

/**
 * Normalize a website URL:
 *   - null / empty → null
 *   - Add https:// if no scheme
 *   - Remove trailing slash
 */
function normalizeWebsite(raw) {
  if (raw == null) return null
  let url = String(raw).trim()
  if (url === '') return null

  // Add scheme if missing
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url
  }

  // Remove trailing slash (but not for bare domains like https://example.com/)
  // Only strip if there is a path segment after the host
  try {
    const parsed = new URL(url)
    // Remove trailing slash from pathname unless it IS the root
    if (parsed.pathname !== '/' && parsed.pathname.endsWith('/')) {
      parsed.pathname = parsed.pathname.replace(/\/+$/, '')
    } else if (parsed.pathname === '/') {
      parsed.pathname = ''
    }
    url = parsed.toString()
    // Remove trailing slash that URL constructor may leave
    url = url.replace(/\/$/, '')
  } catch {
    // If URL is somehow invalid just strip trailing slash naively
    url = url.replace(/\/+$/, '')
  }

  return url === '' ? null : url
}

/**
 * Collapse multiple consecutive newlines to at most 2, then trim.
 */
function normalizeDescription(raw) {
  if (raw == null) return null
  let d = String(raw).trim()
  if (d === '') return null
  // Collapse 3+ newlines (with optional surrounding whitespace) to exactly 2
  d = d.replace(/(\r?\n\s*){3,}/g, '\n\n')
  return d
}

/**
 * Generate or normalize short_description:
 *   - If null/empty AND description exists: truncate description at last space
 *     before 200 chars and append `…`
 *   - Trim whitespace
 *   - Max 220 chars (hard truncate at last space before 220, add `…`)
 */
function normalizeShortDescription(rawShort, rawDesc) {
  let s = rawShort != null ? String(rawShort).trim() : ''

  if (s === '') {
    // Generate from description
    const desc = rawDesc != null ? String(rawDesc).trim() : ''
    if (desc === '') return null

    if (desc.length <= 200) {
      s = desc
    } else {
      // Find last space at or before index 199
      const cut = desc.lastIndexOf(' ', 199)
      s = (cut > 0 ? desc.slice(0, cut) : desc.slice(0, 200)) + '…'
    }
  }

  // Hard cap at 220 chars
  if (s.length > 220) {
    const cut = s.lastIndexOf(' ', 219)
    s = (cut > 0 ? s.slice(0, cut) : s.slice(0, 220)) + '…'
  }

  return s === '' ? null : s
}

// ─── Fetch all records (paginated) ─────────────────────────────────────────

async function fetchAll() {
  const PAGE = 1000
  let all = []
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from('businesses')
      .select(
        'object_id, name, address, phone, website, description, short_description'
      )
      .range(from, from + PAGE - 1)

    if (error) throw new Error(`Fetch error: ${error.message}`)
    if (!data || data.length === 0) break

    all = all.concat(data)
    process.stdout.write(`  Fetched ${all.length} records...\r`)

    if (data.length < PAGE) break
    from += PAGE
  }

  console.log(`\nFetched ${all.length} records total.`)
  return all
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== normalize-data.mjs ===')
  console.log('Fetching all businesses...')

  const rows = await fetchAll()

  const toUpdate = []
  let checked = 0

  for (const row of rows) {
    checked++

    const newName    = row.name    != null ? String(row.name).trim()    : null
    const newAddress = row.address != null ? String(row.address).trim() : null
    const newPhone   = normalizePhone(row.phone)
    const newWebsite = normalizeWebsite(row.website)
    const newDesc    = normalizeDescription(row.description)
    const newShort   = normalizeShortDescription(row.short_description, row.description)

    // Track what changed
    const changes = {}

    if (newName !== row.name)              changes.name              = newName
    if (newAddress !== row.address)        changes.address           = newAddress
    if (newPhone !== row.phone)            changes.phone             = newPhone
    if (newWebsite !== row.website)        changes.website           = newWebsite
    if (newDesc !== row.description)       changes.description       = newDesc
    if (newShort !== row.short_description) changes.short_description = newShort

    if (Object.keys(changes).length > 0) {
      toUpdate.push({ object_id: row.object_id, changes })
    }
  }

  console.log(`\nChecked: ${checked}`)
  console.log(`Rows needing update: ${toUpdate.length}`)

  if (toUpdate.length === 0) {
    console.log('Nothing to update. All data is already clean.')
    return
  }

  // ── Print summary of what will change ──
  const fieldCounts = {}
  for (const { changes } of toUpdate) {
    for (const field of Object.keys(changes)) {
      fieldCounts[field] = (fieldCounts[field] || 0) + 1
    }
  }
  console.log('\nChanges breakdown:')
  for (const [field, count] of Object.entries(fieldCounts)) {
    console.log(`  ${field}: ${count} row(s)`)
  }

  // ── Update in batches of 50 ──
  const BATCH = 50
  let updated = 0
  let errors  = 0

  console.log('\nUpdating...')

  for (let i = 0; i < toUpdate.length; i += BATCH) {
    const batch = toUpdate.slice(i, i + BATCH)

    // One .update() call per row (as required — Supabase JS doesn't support
    // batch update with different values per row in a single call)
    const promises = batch.map(({ object_id, changes }) =>
      supabase
        .from('businesses')
        .update(changes)
        .eq('object_id', object_id)
        .then(({ error }) => {
          if (error) {
            console.error(`  ERROR updating ${object_id}: ${error.message}`)
            errors++
          } else {
            updated++
            // Verbose log for phone / website / short_description changes
            const interesting = ['phone', 'website', 'short_description']
            const noted = interesting.filter(f => f in changes)
            if (noted.length > 0) {
              const detail = noted
                .map(f => `${f}: ${JSON.stringify(changes[f])}`)
                .join(', ')
              console.log(`  [${object_id}] ${detail}`)
            }
          }
        })
    )

    await Promise.all(promises)

    const done = Math.min(i + BATCH, toUpdate.length)
    process.stdout.write(`  Progress: ${done}/${toUpdate.length}\r`)
  }

  console.log(`\n\nDone.`)
  console.log(`  Updated: ${updated}`)
  if (errors > 0) console.log(`  Errors:  ${errors}`)
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})

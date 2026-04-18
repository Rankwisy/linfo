/**
 * Removes demo / seeded listings from the businesses table.
 *
 * Real businesses imported from Outscraper have Google place IDs → object_id starts with "ChIJ".
 * Demo records were manually seeded with IDs like:
 *   bru-taxi-001, bruxelles-toiture-046, anvers-autocar-088, gand-gym-101, liege-renovation-200 …
 *
 * Rule: delete every row where object_id does NOT start with "ChIJ".
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://hfrphfbcuhtxbgcyjkbc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcnBoZmJjdWh0eGJnY3lqa2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTA2NjIsImV4cCI6MjA5MDk4NjY2Mn0.mG-yBz7fqW3Ofs-2Id4LhydzXx_5e6OibMCtoeoEOEI'
)

// ── Step 1: preview what will be deleted ─────────────────────────────────────

console.log('Scanning for demo records…')

const PAGE = 1000
let page = 0
const demo = []
const real = []

while (true) {
  const { data, error } = await supabase
    .from('businesses')
    .select('object_id, name, city, category')
    .range(page * PAGE, (page + 1) * PAGE - 1)

  if (error) { console.error(error.message); process.exit(1) }
  if (!data || data.length === 0) break

  for (const r of data) {
    if (r.object_id.startsWith('ChIJ')) {
      real.push(r)
    } else {
      demo.push(r)
    }
  }

  if (data.length < PAGE) break
  page++
}

console.log(`\nTotal records:  ${real.length + demo.length}`)
console.log(`Real (ChIJ…):   ${real.length}`)
console.log(`Demo (to delete): ${demo.length}`)

if (demo.length === 0) {
  console.log('\nNo demo records found. Nothing to do.')
  process.exit(0)
}

console.log('\nDemo records to delete:')
for (const d of demo) {
  console.log(`  [${d.object_id}]  ${d.name}  (${d.city} / ${d.category})`)
}

// ── Step 2: delete in batches of 100 ─────────────────────────────────────────

const ids = demo.map((d) => d.object_id)
const BATCH = 100
let deleted = 0
let errors  = 0

console.log(`\nDeleting ${ids.length} demo records…`)

for (let i = 0; i < ids.length; i += BATCH) {
  const batch = ids.slice(i, i + BATCH)
  const { error } = await supabase
    .from('businesses')
    .delete()
    .in('object_id', batch)

  if (error) {
    console.error(`  ✗ Batch ${Math.floor(i / BATCH) + 1} failed:`, error.message)
    errors += batch.length
  } else {
    deleted += batch.length
    console.log(`  ✓ Deleted ${deleted}/${ids.length}`)
  }
}

console.log('\n════════════════════════════════════════')
console.log(`  Deleted:  ${deleted}`)
console.log(`  Errors:   ${errors}`)
console.log(`  Remaining: ${real.length} real businesses`)
console.log('════════════════════════════════════════')

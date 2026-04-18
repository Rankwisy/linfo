import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://hfrphfbcuhtxbgcyjkbc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcnBoZmJjdWh0eGJnY3lqa2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTA2NjIsImV4cCI6MjA5MDk4NjY2Mn0.mG-yBz7fqW3Ofs-2Id4LhydzXx_5e6OibMCtoeoEOEI'
)

const categories = [
  'transport', 'construction', 'sport', 'services',
  'sante', 'restauration', 'beaute', 'informatique',
  'juridique', 'education', 'energie', 'evenementiel',
]

const cities = ['bruxelles', 'anvers', 'gand', 'liege']

// Fetch all records once
const all = []
let page = 0
while (true) {
  const { data, error } = await supabase
    .from('businesses')
    .select('category, city')
    .range(page * 1000, (page + 1) * 1000 - 1)
  if (error || !data || data.length === 0) break
  all.push(...data)
  if (data.length < 1000) break
  page++
}

// Build count map
const counts = {}
for (const row of all) {
  const key = `${row.category}|${row.city}`
  counts[key] = (counts[key] || 0) + 1
}

const empty = []
const filled = []

for (const cat of categories) {
  for (const city of cities) {
    const n = counts[`${cat}|${city}`] || 0
    if (n === 0) empty.push({ cat, city })
    else filled.push({ cat, city, n })
  }
}

console.log(`\nTotal businesses in DB: ${all.length}`)
console.log(`\n✅ FILLED (${filled.length} combinations):`)
for (const f of filled) {
  console.log(`  ${f.city.padEnd(12)} ${f.cat.padEnd(15)} → ${f.n}`)
}

console.log(`\n❌ EMPTY (${empty.length} combinations):`)
for (const e of empty) {
  console.log(`  ${e.city.padEnd(12)} ${e.cat}`)
}

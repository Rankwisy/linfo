/**
 * Add a single client business to the DB.
 * Run: node scripts/add-client.mjs
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://hfrphfbcuhtxbgcyjkbc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcnBoZmJjdWh0eGJnY3lqa2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTA2NjIsImV4cCI6MjA5MDk4NjY2Mn0.mG-yBz7fqW3Ofs-2Id4LhydzXx_5e6OibMCtoeoEOEI'
)

const business = {
  object_id:         'limostar-bruxelles',
  name:              'LimoStar',
  slug:              'limostar-bruxelles',
  category:          'transport',
  subcategory:       'autocar',
  city:              'bruxelles',
  address:           'Avenue Louise 65, 1050 Bruxelles',
  phone:             '+32 2 512 01 01',
  email:             'info@limostar.be',
  website:           'https://limostar.be',
  description:       'LimoStar est une entreprise de location d\'autocar, minibus et minivan avec chauffeur à Bruxelles. Spécialisée dans les transferts aéroport, les visites touristiques, les événements et les déplacements professionnels, LimoStar propose une flotte moderne (coach 50 places, midibus 30 places, minibus 16 places, minivan 8 places) équipée Wi-Fi et chargeurs. Chauffeurs professionnels multilingues, tarifs fixes transparents, disponibilité 24h/24.',
  short_description: 'Location d\'autocar, minibus et minivan avec chauffeur à Bruxelles. Transferts aéroport, événements, visites touristiques et déplacements d\'affaires.',
  tags:              ['autocar', 'minibus', 'chauffeur', 'transfert aeroport', 'evenement'],
  featured:          true,
  rating:            4.8,
  review_count:      0,
  lat:               50.8333,
  lng:               4.3667,
  image_url:         null,
}

// Check it doesn't already exist
const { data: existing } = await supabase
  .from('businesses')
  .select('object_id')
  .eq('object_id', business.object_id)
  .single()

if (existing) {
  console.log('LimoStar already exists in the DB — updating…')
  const { error } = await supabase
    .from('businesses')
    .update(business)
    .eq('object_id', business.object_id)
  if (error) { console.error('Update failed:', error.message); process.exit(1) }
  console.log('✓ LimoStar updated successfully')
} else {
  const { error } = await supabase
    .from('businesses')
    .insert(business)
  if (error) { console.error('Insert failed:', error.message); process.exit(1) }
  console.log('✓ LimoStar inserted successfully')
}

console.log(`  Slug:     /company/limostar-bruxelles`)
console.log(`  Category: transport / autocar`)
console.log(`  City:     bruxelles`)
console.log(`  Featured: true`)

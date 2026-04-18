/**
 * Import cleaned_seo_directory.csv into the businesses table.
 *
 * Region mapping (user instruction):
 *   Flandre cities  → city = 'anvers'
 *   Wallonie cities → city = 'liege'
 *   Brussels        → city = 'bruxelles'
 *   (Gand stays empty — no data from this CSV)
 *
 * Run: node scripts/import-seo-directory.mjs
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const supabase = createClient(
  'https://hfrphfbcuhtxbgcyjkbc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcnBoZmJjdWh0eGJnY3lqa2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTA2NjIsImV4cCI6MjA5MDk4NjY2Mn0.mG-yBz7fqW3Ofs-2Id4LhydzXx_5e6OibMCtoeoEOEI'
)

// ─── City → Region mapping ────────────────────────────────────────────────────
// Flandre = anvers | Wallonie = liege | Brussels = bruxelles

const FLANDRE_CITIES = new Set([
  'zonhoven','ternat','zedelgem','ypres','ieper','geraardsbergen','affligem',
  'lummen','maasmechelen','heuvelland','poperinge','poperinghe','lede','lanaken',
  'aalst','vleteren','dilbeek','lennik','torhout','beringen','zonnebeke',
  'langemark-poelkapelle','houthalen-helchteren','asse','denderleeuw',
  'lichtervelde','zutendaal','dilsen-stokkem','roosdaal','liedekerke','herzele',
  'lierde','veurne','oostkamp','loppem','ieper 1','meldert (o.-vl)',
  'sint-niklaas','gent','ghent','bruges','brugge','antwerp','antwerpen',
  'kortrijk','hasselt','leuven','mechelen','roeselare','turnhout','genk',
  'sint-truiden','tongeren','diest','tielt','waregem','oudenaarde','eeklo',
  'dendermonde','wetteren','ninove','aarschot','herentals','mol','westerlo',
  'balen','tessenderlo','leopoldsburg','peer','maaseik','kinrooi',
  'as','bilzen','hoeselt','nieuwerkerken','borgloon','heers','alken',
  'wellen','riemst','voeren','herstappe','comines-warneton',
])

const WALLONIE_CITIES = new Set([
  'hotton','frasnes-lez-anvaing','burg-reuland','ath','leuze-en-hainaut',
  'st vith','namur','beloeil','gouvy','gesves','andenne','lessines','amel',
  'saint-vith/sankt-vith','saint-vith','chaumont-gistoux','assesse','perwez',
  'blegny','huy','hannut','yvoir','silly','chievres','chièvres','lens',
  'enghien','jurbise','ellezelles','saint-ghislain','mons','liège','liege',
  'charleroi','verviers','seraing','mouscron','la louvière','tournai',
  'herstal','ans','flémalle','grâce-hollogne','wavre','arlon','marche-en-famenne',
  'bastogne','philippeville','dinant','ciney','rochefort','florenville',
  'virton','neufchâteau','houffalize','libramont-chevigny','bertrix',
  'bouillon','etalle','habay','tintigny','messancy','aubange','attert',
  'musson','meix-devant-virton','saint-léger','rouvroy','virton',
  'flobecq','brugelette','chièvres','jurbise','soignies','braine-le-comte',
  'rebecq','tubize','nivelles','ottignies-louvain-la-neuve','wavre',
  'genappe','court-saint-etienne','chastre','gembloux','eghezée',
  'fernelmont','jodoigne','orp-jauche','ramillies','berloz',
  'braives','burdinne','crisnée','faimes','geer','grâce-hollogne',
  'héron','lincent','modave','nandrin','ouffet','saint-georges-sur-meuse',
  'tinlot','villers-le-bouillet','wanze','anthisnes','aywaille','clavier',
  'comblain-au-pont','esneux','ferrières','hamoir','lierneux','manhay',
  'marche-en-famenne','rendeux','spa','stoumont','theux','trois-ponts',
  'waimes','gesves','ohey','profondeville','havelange','somme-leuze',
  'nassogne','durbuy','erezée','hotton','la roche-en-ardenne','paliseul',
  'saint-ode','tenneville','vielsalm','büllingen','burg-reuland','butgenbach',
  'eupen','kelmis','lontzen','malmedy','plombières','raeren','welkenraedt',
  'amel','waimes','leuze','bernissart','belœil','beloeil','leuze-en-hainaut',
  'antoing','brunehaut','celles','ere','péruwelz','rumes','mont-de-l\'enclus',
])

const BRUSSELS_CITIES = new Set([
  'brussels','bruxelles','schaerbeek','anderlecht','molenbeek','ixelles',
  'forest','etterbeek','woluwe','uccle','jette','koekelberg','berchem',
  'evere','ganshoren','laeken','neder-over-heembeek',
])

function getCitySlug(rawCity) {
  const key = rawCity.toLowerCase().trim()
  if (BRUSSELS_CITIES.has(key)) return 'bruxelles'
  if (FLANDRE_CITIES.has(key))  return 'anvers'
  if (WALLONIE_CITIES.has(key)) return 'liege'
  return null // unmappable
}

// ─── English category → DB category + subcategory ────────────────────────────

const CATEGORY_MAP = {
  // ── Beauté ──
  'beauty salon':              { category: 'beaute', subcategory: 'esthetique' },
  'beautician':                { category: 'beaute', subcategory: 'esthetique' },
  'beauty product supplier':   { category: 'beaute', subcategory: 'esthetique' },
  'hair salon':                { category: 'beaute', subcategory: 'coiffeur' },
  'hairdresser':               { category: 'beaute', subcategory: 'coiffeur' },
  'barber shop':               { category: 'beaute', subcategory: 'coiffeur' },
  'hair extension technician': { category: 'beaute', subcategory: 'coiffeur' },
  'nail salon':                { category: 'beaute', subcategory: 'esthetique' },
  'eyebrow bar':               { category: 'beaute', subcategory: 'esthetique' },
  'facial spa':                { category: 'beaute', subcategory: 'esthetique' },
  'make-up artist':            { category: 'beaute', subcategory: 'esthetique' },
  'permanent make-up clinic':  { category: 'beaute', subcategory: 'esthetique' },
  'skin care clinic':          { category: 'beaute', subcategory: 'esthetique' },
  'teeth whitening service':   { category: 'beaute', subcategory: 'esthetique' },
  'hair removal service':      { category: 'beaute', subcategory: 'esthetique' },
  'laser hair removal service':{ category: 'beaute', subcategory: 'esthetique' },
  'wellness center':           { category: 'beaute', subcategory: 'spa' },
  'day spa':                   { category: 'beaute', subcategory: 'spa' },
  'spa':                       { category: 'beaute', subcategory: 'spa' },
  'spa and health club':       { category: 'beaute', subcategory: 'spa' },
  'massage service':           { category: 'beaute', subcategory: 'spa' },
  'massage spa':               { category: 'beaute', subcategory: 'spa' },
  'massage therapist':         { category: 'beaute', subcategory: 'spa' },
  'sports massage therapist':  { category: 'beaute', subcategory: 'spa' },
  'sauna':                     { category: 'beaute', subcategory: 'spa' },
  'foot care':                 { category: 'beaute', subcategory: 'esthetique' },
  'plastic surgery clinic':    { category: 'beaute', subcategory: 'esthetique' },
  'wellness hotel':            { category: 'beaute', subcategory: 'spa' },

  // ── Construction / Rénovation ──
  'construction company':          { category: 'construction', subcategory: 'renovation' },
  'general contractor':            { category: 'construction', subcategory: 'renovation' },
  'contractor':                    { category: 'construction', subcategory: 'renovation' },
  'building firm':                 { category: 'construction', subcategory: 'renovation' },
  'custom home builder':           { category: 'construction', subcategory: 'renovation' },
  'home builder':                  { category: 'construction', subcategory: 'renovation' },
  'interior construction contractor': { category: 'construction', subcategory: 'renovation' },
  'interior designer':             { category: 'construction', subcategory: 'renovation' },
  'interior fitting contractor':   { category: 'construction', subcategory: 'renovation' },
  'bathroom remodeler':            { category: 'construction', subcategory: 'renovation' },
  'kitchen remodeler':             { category: 'construction', subcategory: 'renovation' },
  'building restoration service':  { category: 'construction', subcategory: 'renovation' },
  'water damage restoration service': { category: 'construction', subcategory: 'renovation' },
  'dry wall contractor':           { category: 'construction', subcategory: 'renovation' },
  'stucco contractor':             { category: 'construction', subcategory: 'renovation' },
  'masonry contractor':            { category: 'construction', subcategory: 'renovation' },
  'tile contractor':               { category: 'construction', subcategory: 'renovation' },
  'flooring contractor':           { category: 'construction', subcategory: 'renovation' },
  'deck builder':                  { category: 'construction', subcategory: 'renovation' },
  'fence contractor':              { category: 'construction', subcategory: 'renovation' },
  'railing contractor':            { category: 'construction', subcategory: 'renovation' },
  'stair contractor':              { category: 'construction', subcategory: 'renovation' },
  'garage builder':                { category: 'construction', subcategory: 'renovation' },
  'shed builder':                  { category: 'construction', subcategory: 'renovation' },
  'handyman/handywoman/handyperson': { category: 'construction', subcategory: 'renovation' },
  'paving contractor':             { category: 'construction', subcategory: 'renovation' },
  'excavating contractor':         { category: 'construction', subcategory: 'renovation' },
  'earth works company':           { category: 'construction', subcategory: 'renovation' },
  'demolition contractor':         { category: 'construction', subcategory: 'renovation' },
  'concrete contractor':           { category: 'construction', subcategory: 'renovation' },
  'waterproofing service':         { category: 'construction', subcategory: 'renovation' },
  'siding contractor':             { category: 'construction', subcategory: 'renovation' },
  'skylight contractor':           { category: 'construction', subcategory: 'renovation' },
  'carport and pergola builder':   { category: 'construction', subcategory: 'renovation' },
  'chimney services':              { category: 'construction', subcategory: 'renovation' },
  'pond contractor':               { category: 'construction', subcategory: 'renovation' },
  'log home builder':              { category: 'construction', subcategory: 'renovation' },
  'antique furniture restoration service': { category: 'construction', subcategory: 'renovation' },
  'woodworker':                    { category: 'construction', subcategory: 'renovation' },
  'cabinet maker':                 { category: 'construction', subcategory: 'renovation' },
  'carpenter':                     { category: 'construction', subcategory: 'renovation' },
  'millwork shop':                 { category: 'construction', subcategory: 'renovation' },
  'door supplier':                 { category: 'construction', subcategory: 'renovation' },
  'door manufacturer':             { category: 'construction', subcategory: 'renovation' },
  'door shop':                     { category: 'construction', subcategory: 'renovation' },
  'window supplier':               { category: 'construction', subcategory: 'renovation' },
  'window installation service':   { category: 'construction', subcategory: 'renovation' },
  'pvc windows supplier':          { category: 'construction', subcategory: 'renovation' },
  'aluminum supplier':             { category: 'construction', subcategory: 'renovation' },
  'glass repair service':          { category: 'construction', subcategory: 'renovation' },
  'glazier':                       { category: 'construction', subcategory: 'renovation' },
  'roofing contractor':            { category: 'construction', subcategory: 'toiture' },
  'electrician':                   { category: 'construction', subcategory: 'electricite' },
  'electrical engineer':           { category: 'construction', subcategory: 'electricite' },
  'plumber':                       { category: 'construction', subcategory: 'plomberie' },
  'real estate agency':            { category: 'construction', subcategory: 'renovation' },
  'real estate agent':             { category: 'construction', subcategory: 'renovation' },
  'real estate developer':         { category: 'construction', subcategory: 'renovation' },
  'real estate consultant':        { category: 'construction', subcategory: 'renovation' },
  'real estate rental agency':     { category: 'construction', subcategory: 'renovation' },
  'industrial real estate agency': { category: 'construction', subcategory: 'renovation' },
  'property management company':   { category: 'construction', subcategory: 'renovation' },

  // ── Énergie ──
  'heating contractor':          { category: 'energie', subcategory: 'pompe-chaleur' },
  'hvac contractor':             { category: 'energie', subcategory: 'pompe-chaleur' },
  'air conditioning contractor': { category: 'energie', subcategory: 'pompe-chaleur' },
  'air conditioning repair service': { category: 'energie', subcategory: 'pompe-chaleur' },
  'boiler supplier':             { category: 'energie', subcategory: 'pompe-chaleur' },
  'furnace repair service':      { category: 'energie', subcategory: 'pompe-chaleur' },
  'insulation contractor':       { category: 'energie', subcategory: 'isolation' },
  'solar energy company':        { category: 'energie', subcategory: 'panneaux-solaires' },
  'solar energy equipment supplier': { category: 'energie', subcategory: 'panneaux-solaires' },
  'solar energy system service': { category: 'energie', subcategory: 'panneaux-solaires' },
  'solar hot water system supplier': { category: 'energie', subcategory: 'panneaux-solaires' },
  'green energy supplier':       { category: 'energie', subcategory: 'panneaux-solaires' },
  'waste management service':    { category: 'energie', subcategory: 'gestion-dechets' },
  'sanitation service':          { category: 'energie', subcategory: 'gestion-dechets' },
  'sewage disposal service':     { category: 'energie', subcategory: 'gestion-dechets' },

  // ── Restauration ──
  'restaurant':              { category: 'restauration', subcategory: 'restaurant' },
  'brasserie':               { category: 'restauration', subcategory: 'restaurant' },
  'cafe':                    { category: 'restauration', subcategory: 'restaurant' },
  'coffee shop':             { category: 'restauration', subcategory: 'restaurant' },
  'bistro':                  { category: 'restauration', subcategory: 'restaurant' },
  'bar':                     { category: 'restauration', subcategory: 'restaurant' },
  'pub':                     { category: 'restauration', subcategory: 'restaurant' },
  'diner':                   { category: 'restauration', subcategory: 'restaurant' },
  'gastropub':               { category: 'restauration', subcategory: 'restaurant' },
  'beer hall':               { category: 'restauration', subcategory: 'restaurant' },
  'wine bar':                { category: 'restauration', subcategory: 'restaurant' },
  'fast food restaurant':    { category: 'restauration', subcategory: 'restaurant' },
  'fine dining restaurant':  { category: 'restauration', subcategory: 'restaurant' },
  'takeout restaurant':      { category: 'restauration', subcategory: 'livraison-repas' },
  'pizza restaurant':        { category: 'restauration', subcategory: 'restaurant' },
  'pizza takeaway':          { category: 'restauration', subcategory: 'livraison-repas' },
  'chinese restaurant':      { category: 'restauration', subcategory: 'restaurant' },
  'italian restaurant':      { category: 'restauration', subcategory: 'restaurant' },
  'mediterranean restaurant':{ category: 'restauration', subcategory: 'restaurant' },
  'tapas restaurant':        { category: 'restauration', subcategory: 'restaurant' },
  'thai restaurant':         { category: 'restauration', subcategory: 'restaurant' },
  'breakfast restaurant':    { category: 'restauration', subcategory: 'restaurant' },
  'sandwich shop':           { category: 'restauration', subcategory: 'restaurant' },
  'frituur':                 { category: 'restauration', subcategory: 'restaurant' },
  'ice cream shop':          { category: 'restauration', subcategory: 'restaurant' },
  'bakery':                  { category: 'restauration', subcategory: 'boulangerie' },
  'caterer':                 { category: 'restauration', subcategory: 'traiteur' },
  'mobile caterer':          { category: 'restauration', subcategory: 'traiteur' },
  'catering food and drink supplier': { category: 'restauration', subcategory: 'traiteur' },
  'children\'s party buffet':{ category: 'restauration', subcategory: 'traiteur' },
  'butcher shop':            { category: 'restauration', subcategory: 'boulangerie' },
  'butcher shop deli':       { category: 'restauration', subcategory: 'boulangerie' },

  // ── Juridique / Finance ──
  'lawyer':                    { category: 'juridique', subcategory: 'avocat' },
  'law firm':                  { category: 'juridique', subcategory: 'avocat' },
  'business attorney':         { category: 'juridique', subcategory: 'avocat' },
  'general practice attorney': { category: 'juridique', subcategory: 'avocat' },
  'criminal justice attorney': { category: 'juridique', subcategory: 'avocat' },
  'estate planning attorney':  { category: 'juridique', subcategory: 'avocat' },
  'trial attorney':            { category: 'juridique', subcategory: 'avocat' },
  'notary public':             { category: 'juridique', subcategory: 'notaire' },
  'insurance broker':          { category: 'juridique', subcategory: 'assurance' },
  'auto insurance agency':     { category: 'juridique', subcategory: 'assurance' },
  'financial consultant':      { category: 'juridique', subcategory: 'conseil-financier' },
  'investment service':        { category: 'juridique', subcategory: 'conseil-financier' },
  'mortgage broker':           { category: 'juridique', subcategory: 'conseil-financier' },
  'credit counseling service': { category: 'juridique', subcategory: 'conseil-financier' },

  // ── Services professionnels ──
  'certified public accountant': { category: 'services', subcategory: 'comptabilite' },
  'accountant':                  { category: 'services', subcategory: 'comptabilite' },
  'tax consultant':              { category: 'services', subcategory: 'comptabilite' },
  'landscaper':                  { category: 'services', subcategory: 'nettoyage' },
  'gardener':                    { category: 'services', subcategory: 'nettoyage' },
  'cleaning service':            { category: 'services', subcategory: 'nettoyage' },
  'house cleaning service':      { category: 'services', subcategory: 'nettoyage' },
  'cleaners':                    { category: 'services', subcategory: 'nettoyage' },
  'laundry service':             { category: 'services', subcategory: 'nettoyage' },
  'window cleaning service':     { category: 'services', subcategory: 'nettoyage' },
  'pest control service':        { category: 'services', subcategory: 'nettoyage' },
  'computer consultant':         { category: 'services', subcategory: 'informatique' },
  'computer service':            { category: 'services', subcategory: 'informatique' },
  'computer support and services': { category: 'services', subcategory: 'informatique' },
  'website designer':            { category: 'services', subcategory: 'informatique' },
  'internet service provider':   { category: 'services', subcategory: 'informatique' },
  'marketing consultant':        { category: 'services', subcategory: 'informatique' },
  'advertising agency':          { category: 'services', subcategory: 'informatique' },

  // ── Santé ──
  'nursing home':          { category: 'sante', subcategory: 'medecine-generale' },
  'retirement home':       { category: 'sante', subcategory: 'medecine-generale' },
  'retirement community':  { category: 'sante', subcategory: 'medecine-generale' },
  'aged care':             { category: 'sante', subcategory: 'medecine-generale' },
  'assisted living facility': { category: 'sante', subcategory: 'medecine-generale' },
  'home health care service': { category: 'sante', subcategory: 'medecine-generale' },
  'health consultant':     { category: 'sante', subcategory: 'medecine-generale' },
  'nutritionist':          { category: 'sante', subcategory: 'medecine-generale' },
  'counselor':             { category: 'sante', subcategory: 'medecine-generale' },

  // ── Sport ──
  'gym':                       { category: 'sport', subcategory: 'gym' },
  'fitness center':            { category: 'sport', subcategory: 'gym' },
  'physical fitness program':  { category: 'sport', subcategory: 'gym' },
  'personal trainer':          { category: 'sport', subcategory: 'gym' },
  'swimming pool':             { category: 'sport', subcategory: 'piscine' },
  'swimming facility':         { category: 'sport', subcategory: 'piscine' },
  'outdoor swimming pool':     { category: 'sport', subcategory: 'piscine' },
  'yoga instructor':           { category: 'sport', subcategory: 'gym' },
  'adventure sports center':   { category: 'sport', subcategory: 'gym' },
  'bicycle repair shop':       { category: 'sport', subcategory: 'gym' },

  // ── Événementiel ──
  'cabin rental agency':         { category: 'evenementiel', subcategory: 'lieu-reception' },
  'holiday home':                { category: 'evenementiel', subcategory: 'lieu-reception' },
  'self-catering accommodation': { category: 'evenementiel', subcategory: 'lieu-reception' },
  'vacation home rental agency': { category: 'evenementiel', subcategory: 'lieu-reception' },
  'group accommodation':         { category: 'evenementiel', subcategory: 'lieu-reception' },
  'cottage':                     { category: 'evenementiel', subcategory: 'lieu-reception' },
  'lodge':                       { category: 'evenementiel', subcategory: 'lieu-reception' },
  'hostel':                      { category: 'evenementiel', subcategory: 'lieu-reception' },
  'hotel':                       { category: 'evenementiel', subcategory: 'lieu-reception' },
  'bed & breakfast':             { category: 'evenementiel', subcategory: 'lieu-reception' },
  'banquet hall':                { category: 'evenementiel', subcategory: 'lieu-reception' },
  'event venue':                 { category: 'evenementiel', subcategory: 'lieu-reception' },
  'festival hall':               { category: 'evenementiel', subcategory: 'lieu-reception' },
  'function room facility':      { category: 'evenementiel', subcategory: 'lieu-reception' },
  'wedding venue':               { category: 'mariage', subcategory: 'salle-mariage' },
  'event planner':               { category: 'evenementiel', subcategory: 'organisation-evenements' },
  'event management company':    { category: 'evenementiel', subcategory: 'organisation-evenements' },
  'children\'s party service':   { category: 'evenementiel', subcategory: 'organisation-evenements' },
  'photography service':         { category: 'evenementiel', subcategory: 'photographe' },

  // ── Mariage ──
  'florist': { category: 'mariage', subcategory: 'fleuriste-mariage' },

  // ── Éducation ──
  'learning center':      { category: 'education', subcategory: 'formation-professionnelle' },
  'coaching center':      { category: 'education', subcategory: 'formation-professionnelle' },
  'business school':      { category: 'education', subcategory: 'formation-professionnelle' },

  // ── Transport ──
  'moving service':           { category: 'transport', subcategory: 'demenagement' },
  'moving and storage service':{ category: 'transport', subcategory: 'demenagement' },
  'trucking company':         { category: 'transport', subcategory: 'transport-marchandises' },
  'courier service':          { category: 'transport', subcategory: 'transport-marchandises' },
  'delivery service':         { category: 'transport', subcategory: 'transport-marchandises' },
  'bus company':              { category: 'transport', subcategory: 'autocar' },
}

function mapCategory(rawCategory) {
  // rawCategory may be comma-separated; try each in order
  const parts = rawCategory.split(',').map(s => s.trim().toLowerCase())
  for (const part of parts) {
    if (CATEGORY_MAP[part]) return CATEGORY_MAP[part]
  }
  return null // skip unmappable
}

// ─── CSV parser ───────────────────────────────────────────────────────────────

function parseCSV(content) {
  const lines = content.trim().split('\n')
  const headers = parseCSVLine(lines[0])
  return lines.slice(1).map(l => {
    const vals = parseCSVLine(l)
    return Object.fromEntries(headers.map((h, i) => [h, (vals[i] ?? '').trim()]))
  })
}

function parseCSVLine(line) {
  const result = []; let cur = '', inQ = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') { inQ = !inQ }
    else if (c === ',' && !inQ) { result.push(cur); cur = '' }
    else cur += c
  }
  result.push(cur)
  return result
}

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const csvPath = path.join(__dirname, '..', '..', '..', 'Downloads', 'cleaned_seo_directory.csv')
const content = fs.readFileSync(csvPath, 'utf8')
const rows = parseCSV(content)

// 1. Deduplicate by slug
const seen = new Set()
const unique = rows.filter(r => {
  if (seen.has(r.slug)) return false
  seen.add(r.slug)
  return true
})
console.log(`CSV rows: ${rows.length} → Unique by slug: ${unique.length}`)

// 2. Map + filter
const mapped = []
const skipped = { noCity: 0, noCategory: 0 }

for (const r of unique) {
  const citySlug = getCitySlug(r.city)
  if (!citySlug) { skipped.noCity++; continue }

  const catMap = mapCategory(r.category)
  if (!catMap) { skipped.noCategory++; continue }

  const baseSlug = r.slug || slugify(r.name)
  const slug = `${baseSlug}-${citySlug}`
  const objectId = `dir-${slug}`

  mapped.push({
    object_id:         objectId,
    name:              r.name,
    slug,
    category:          catMap.category,
    subcategory:       catMap.subcategory,
    city:              citySlug,
    address:           r.address || null,
    phone:             r.phone || null,
    website:           r.website || null,
    description:       r.meta_description || null,
    short_description: r.meta_description
      ? r.meta_description.slice(0, 200)
      : null,
    tags:              [],
    featured:          false,
    rating:            null,
    review_count:      0,
    lat:               null,
    lng:               null,
    image_url:         null,
  })
}

console.log(`Mapped: ${mapped.length}`)
console.log(`Skipped — no city mapping: ${skipped.noCity}`)
console.log(`Skipped — no category mapping: ${skipped.noCategory}`)

// City/category breakdown
const breakdown = {}
for (const b of mapped) {
  const key = `${b.city} | ${b.category}`
  breakdown[key] = (breakdown[key] || 0) + 1
}
console.log('\nBreakdown by city × category:')
Object.entries(breakdown).sort().forEach(([k, n]) => console.log(`  ${String(n).padStart(3)}  ${k}`))

// 3. Fetch existing object_ids (paginated)
console.log('\nFetching existing object_ids from DB...')
const existingIds = new Set()
let page = 0
while (true) {
  const { data, error } = await supabase
    .from('businesses')
    .select('object_id')
    .range(page * 1000, (page + 1) * 1000 - 1)
  if (error) { console.error('DB error:', error.message); process.exit(1) }
  if (!data || data.length === 0) break
  data.forEach(r => existingIds.add(r.object_id))
  if (data.length < 1000) break
  page++
}
console.log(`Existing records in DB: ${existingIds.size}`)

// 4. Also check slug collisions
const existingSlugs = new Set()
page = 0
while (true) {
  const { data, error } = await supabase
    .from('businesses')
    .select('slug')
    .range(page * 1000, (page + 1) * 1000 - 1)
  if (error) { console.error('DB error:', error.message); process.exit(1) }
  if (!data || data.length === 0) break
  data.forEach(r => existingSlugs.add(r.slug))
  if (data.length < 1000) break
  page++
}

// 5. Deduplicate against DB + within batch (slug collision)
const batchSlugs = new Set()
const toInsert = []
let dupObject = 0, dupSlug = 0

for (const b of mapped) {
  if (existingIds.has(b.object_id)) { dupObject++; continue }
  if (existingSlugs.has(b.slug) || batchSlugs.has(b.slug)) {
    // Append counter to make slug unique
    let counter = 2
    let newSlug = `${b.slug}-${counter}`
    while (existingSlugs.has(newSlug) || batchSlugs.has(newSlug)) {
      counter++
      newSlug = `${b.slug}-${counter}`
    }
    b.slug = newSlug
    dupSlug++
  }
  batchSlugs.add(b.slug)
  toInsert.push(b)
}

console.log(`\nAlready in DB (skipped): ${dupObject}`)
console.log(`Slug collisions (renamed): ${dupSlug}`)
console.log(`Ready to insert: ${toInsert.length}`)

if (toInsert.length === 0) {
  console.log('\nNothing to insert. Done.')
  process.exit(0)
}

// 6. Batch upsert in chunks of 100
const CHUNK = 100
let inserted = 0, errors = 0

for (let i = 0; i < toInsert.length; i += CHUNK) {
  const chunk = toInsert.slice(i, i + CHUNK)
  const { error } = await supabase
    .from('businesses')
    .upsert(chunk, { onConflict: 'object_id', ignoreDuplicates: true })
  if (error) {
    console.error(`  Chunk ${i}–${i + CHUNK} error:`, error.message)
    errors++
  } else {
    inserted += chunk.length
    process.stdout.write(`\r  Progress: ${inserted}/${toInsert.length}`)
  }
}

console.log(`\n\n✅ Done. Inserted: ${inserted}  Errors: ${errors}`)

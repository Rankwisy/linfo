'use server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60)
}

export async function submitBusiness(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const city = (formData.get('city') as string)?.trim()
  const category = (formData.get('category') as string)?.trim()
  const subcategory = (formData.get('subcategory') as string)?.trim()
  const address = (formData.get('address') as string)?.trim() || null
  const phone = (formData.get('phone') as string)?.trim() || null
  const email = (formData.get('email') as string)?.trim() || null
  const website = (formData.get('website') as string)?.trim() || null
  const description = (formData.get('description') as string)?.trim() || null

  if (!name || !city || !category || !subcategory) {
    return { success: false, error: 'Champs obligatoires manquants.' }
  }

  const baseSlug = slugify(name) + '-' + slugify(city)
  const objectId = `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`

  // Try slug, append random suffix if conflict
  const slug = baseSlug + '-' + Math.random().toString(36).substring(2, 5)

  const { error } = await supabase.from('businesses').insert({
    object_id: objectId,
    name,
    slug,
    category,
    subcategory,
    city,
    address,
    phone,
    email,
    website,
    description,
    short_description: description ? description.substring(0, 120) : null,
    featured: false,
    rating: 0,
    review_count: 0,
  })

  if (error) {
    console.error('Submit error:', error)
    return { success: false, error: 'Une erreur est survenue. Réessayez.' }
  }

  return { success: true }
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Row type matching the businesses table in Supabase
export interface BusinessRow {
  id: string
  object_id: string
  name: string
  slug: string
  category: string
  subcategory: string
  city: string
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
  description: string | null
  short_description: string | null
  tags: string[]
  featured: boolean
  rating: number
  review_count: number
  lat: number | null
  lng: number | null
  image_url: string | null
  created_at: string
  updated_at: string
}

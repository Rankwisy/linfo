import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fullResyncToAlgolia } from '@/lib/admin/algolia'

export async function POST() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const result = await fullResyncToAlgolia(supabase)
  return NextResponse.json(result)
}

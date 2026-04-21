'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2Icon } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Props {
  id: string
  title: string
}

export function DeletePostButton({ id, title }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Supprimer l'article "${title}" ? Cette action est irréversible.`)) return
    setLoading(true)
    await supabase.from('blog_posts').delete().eq('id', id)
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50"
    >
      <Trash2Icon size={12} />
      {loading ? '...' : 'Supprimer'}
    </button>
  )
}

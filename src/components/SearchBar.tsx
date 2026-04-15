'use client'
import { SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { businesses } from '@/data/businesses'
import { cities } from '@/data/cities'
import { categories } from '@/data/categories'

interface Suggestion {
  label: string
  href: string
  type: 'business' | 'category' | 'city'
}

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleChange = (value: string) => {
    setQuery(value)
    if (value.trim().length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }

    const q = value.toLowerCase()
    const results: Suggestion[] = []

    // Match businesses
    businesses
      .filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.subcategory.includes(q) ||
          b.tags.some((t) => t.includes(q))
      )
      .slice(0, 3)
      .forEach((b) =>
        results.push({
          label: `${b.name} — ${b.city}`,
          href: `/company/${b.slug}`,
          type: 'business',
        })
      )

    // Match category-city combos
    categories
      .filter((c) => c.name.toLowerCase().includes(q) || c.slug.includes(q))
      .slice(0, 2)
      .forEach((c) =>
        results.push({
          label: `${c.name} à Bruxelles`,
          href: `/${c.slug}-bruxelles`,
          type: 'category',
        })
      )

    // Match subcategory-city
    categories
      .flatMap((c) => c.subcategories)
      .filter((s) => s.name.toLowerCase().includes(q) || s.slug.includes(q))
      .slice(0, 2)
      .forEach((s) =>
        results.push({
          label: `${s.name} à Bruxelles`,
          href: `/${s.slug}-bruxelles`,
          type: 'category',
        })
      )

    setSuggestions(results.slice(0, 6))
    setOpen(results.length > 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/recherche?q=${encodeURIComponent(query)}`)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex items-center gap-0 rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
        <div className="flex items-center pl-4 text-gray-400">
          <SearchIcon size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Rechercher une entreprise, taxi, gym..."
          className="flex-1 px-4 py-3.5 text-gray-800 placeholder-gray-400 outline-none text-base bg-transparent"
          autoComplete="off"
        />
        <button
          type="submit"
          className="px-6 py-3.5 bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          Rechercher
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                router.push(s.href)
                setOpen(false)
                setQuery('')
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <span className="text-xs uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0">
                {s.type === 'business' ? 'Entreprise' : 'Catégorie'}
              </span>
              <span className="text-sm text-gray-700">{s.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

import Link from 'next/link'
import type { BlogPost } from '@/services/blog'
import { CalendarIcon, UserIcon } from 'lucide-react'

const CATEGORY_COLORS: Record<string, string> = {
  Juridique:  'bg-gray-100 text-gray-700',
  Mariage:    'bg-rose-50 text-rose-700',
  Rénovation: 'bg-emerald-50 text-emerald-700',
  Santé:      'bg-teal-50 text-teal-700',
  Business:   'bg-purple-50 text-purple-700',
  Transport:  'bg-amber-50 text-amber-700',
  Général:    'bg-blue-50 text-blue-700',
}

const CATEGORY_GRADIENT: Record<string, string> = {
  Juridique:  'from-slate-500 to-slate-700',
  Mariage:    'from-rose-400 to-rose-600',
  Rénovation: 'from-emerald-400 to-emerald-600',
  Santé:      'from-teal-400 to-teal-600',
  Business:   'from-purple-400 to-purple-600',
  Transport:  'from-amber-400 to-amber-600',
  Général:    'from-blue-400 to-blue-600',
}

const CATEGORY_EMOJI: Record<string, string> = {
  Juridique: '⚖️', Mariage: '💍', Rénovation: '🏗️',
  Santé: '🏥', Business: '💼', Transport: '🚗', Général: '📝',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-BE', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

interface Props {
  post: BlogPost
}

export function BlogCard({ post }: Props) {
  const catColor = CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS['Général']
  const gradient = CATEGORY_GRADIENT[post.category] ?? CATEGORY_GRADIENT['Général']
  const emoji = CATEGORY_EMOJI[post.category] ?? '📝'

  return (
    <article className="group flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:shadow-md hover:border-blue-200 transition-all">

      {/* Cover image or gradient fallback */}
      <Link href={`/blog/${post.slug}`} className="block">
        {post.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image_url}
            alt={post.title}
            className="h-44 w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={`h-44 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-5xl">{emoji}</span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">

        {/* Category badge */}
        <span className={`mb-3 inline-block self-start rounded-full px-2.5 py-0.5 text-xs font-medium ${catColor}`}>
          {post.category}
        </span>

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h2 className="mb-2 font-semibold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Meta + CTA */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <UserIcon size={11} />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <CalendarIcon size={11} />
              {formatDate(post.created_at)}
            </span>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="shrink-0 text-xs font-medium text-blue-600 hover:underline"
          >
            Lire →
          </Link>
        </div>
      </div>
    </article>
  )
}

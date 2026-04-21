'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { BlogPost } from '@/services/blog'

const CATEGORIES = ['Général', 'Juridique', 'Mariage', 'Rénovation', 'Santé', 'Business', 'Transport', 'Événementiel', 'Beauté']

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}

interface Props {
  post?: BlogPost  // undefined = create mode
}

export function BlogPostForm({ post }: Props) {
  const isEdit = Boolean(post)
  const router = useRouter()

  const [title, setTitle]       = useState(post?.title ?? '')
  const [slug, setSlug]         = useState(post?.slug ?? '')
  const [excerpt, setExcerpt]   = useState(post?.excerpt ?? '')
  const [content, setContent]   = useState(post?.content ?? '')
  const [imageUrl, setImageUrl] = useState(post?.image_url ?? '')
  const [category, setCategory] = useState(post?.category ?? 'Général')
  const [tags, setTags]         = useState(post?.tags?.join(', ') ?? '')
  const [author, setAuthor]     = useState(post?.author ?? 'Équipe linfo.be')
  const [published, setPublished] = useState(post?.published ?? false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!isEdit) setSlug(slugify(val))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!title.trim() || !slug.trim()) {
      setError('Le titre et le slug sont obligatoires.')
      return
    }

    setLoading(true)
    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: content.trim() || null,
      image_url: imageUrl.trim() || null,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      author: author.trim() || 'Équipe linfo.be',
      published,
    }

    let err = null
    if (isEdit && post) {
      const res = await supabase.from('blog_posts').update(payload).eq('id', post.id)
      err = res.error
    } else {
      const res = await supabase.from('blog_posts').insert(payload)
      err = res.error
    }

    setLoading(false)
    if (err) { setError(err.message); return }
    router.push('/admin/blog')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Title + Slug */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Titre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="Comment choisir un avocat en Belgique"
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Slug (URL) <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center rounded-lg border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 overflow-hidden">
            <span className="px-3 py-2.5 text-xs text-slate-400 bg-slate-50 border-r border-slate-200 shrink-0">/blog/</span>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
              required
            />
          </div>
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Résumé</label>
        <textarea
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          rows={2}
          placeholder="Court résumé affiché dans la liste d'articles..."
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
        />
      </div>

      {/* Content (HTML) */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Contenu <span className="text-xs text-slate-400 font-normal">(HTML accepté)</span>
        </label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={18}
          placeholder={`<h2>Introduction</h2>\n<p>Votre contenu ici...</p>`}
          className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-mono focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-y"
        />
        <p className="mt-1 text-xs text-slate-400">Utilisez les balises HTML : &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;&lt;li&gt;, &lt;a href=&quot;&quot;&gt;</p>
      </div>

      {/* Image + Category + Author */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Auteur</label>
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Tags <span className="text-xs text-slate-400 font-normal">(séparés par des virgules)</span>
        </label>
        <input
          type="text"
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="avocat, belgique, conseil juridique"
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Published toggle + Submit */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setPublished(!published)}
            className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer ${published ? 'bg-blue-600' : 'bg-slate-200'}`}
          >
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${published ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
          <span className="text-sm font-medium text-slate-700">
            {published ? '✅ Publié' : '📝 Brouillon'}
          </span>
        </label>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer l\'article'}
          </button>
        </div>
      </div>

    </form>
  )
}

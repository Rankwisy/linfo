import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getPostBySlug, getAllPublishedSlugs, getPublishedPosts } from '@/services/blog'
import { BlogCard } from '@/components/blog/BlogCard'
import { CalendarIcon, UserIcon, TagIcon } from 'lucide-react'

export const revalidate = 60

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} | Blog linfo.be`,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `https://linfo.be/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      url: `https://linfo.be/blog/${slug}`,
      siteName: 'linfo.be',
      type: 'article',
      publishedTime: post.created_at,
      authors: [post.author],
      ...(post.image_url ? { images: [{ url: post.image_url, alt: post.title }] } : {}),
    },
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  Juridique:  'bg-gray-100 text-gray-700',
  Mariage:    'bg-rose-50 text-rose-700',
  Rénovation: 'bg-emerald-50 text-emerald-700',
  Santé:      'bg-teal-50 text-teal-700',
  Business:   'bg-purple-50 text-purple-700',
  Transport:  'bg-amber-50 text-amber-700',
  Général:    'bg-blue-50 text-blue-700',
}

const CATEGORY_EMOJI: Record<string, string> = {
  Juridique: '⚖️', Mariage: '💍', Rénovation: '🏗️',
  Santé: '🏥', Business: '💼', Transport: '🚗', Général: '📝',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-BE', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const allPosts = await getPublishedPosts()
  const related = allPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3)

  const catColor = CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS['Général']
  const catEmoji = CATEGORY_EMOJI[post.category] ?? '📝'

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-4 py-14 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <span className={`inline-block mb-4 rounded-full px-3 py-1 text-xs font-semibold ${catColor}`}>
            {catEmoji} {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">{post.title}</h1>
          {post.excerpt && (
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">{post.excerpt}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-blue-300">
            <span className="flex items-center gap-1.5">
              <UserIcon size={14} />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarIcon size={14} />
              {formatDate(post.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Cover image */}
      {post.image_url && (
        <div className="mx-auto max-w-4xl px-4 -mt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-lg"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Breadcrumb */}
        <nav className="mb-8 flex gap-2 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue-600">Accueil</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-blue-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-700 truncate max-w-xs">{post.title}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_260px] gap-12">

          {/* Article content */}
          <article>
            {post.content ? (
              <div
                className="prose prose-gray prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-gray-900
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-p:text-gray-600 prose-p:leading-relaxed
                  prose-strong:text-gray-900
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-ul:text-gray-600 prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <p className="text-gray-500 italic">Contenu non disponible.</p>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
                <TagIcon size={14} className="text-gray-400 shrink-0" />
                {post.tags.map((tag) => (
                  <span key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-6 self-start">

            {/* Author card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Auteur</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{post.author}</p>
                  <p className="text-xs text-gray-500">Rédacteur linfo.be</p>
                </div>
              </div>
            </div>

            {/* Category card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Catégorie</p>
              <Link
                href={`/blog?category=${post.category}`}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors hover:opacity-80 ${catColor}`}
              >
                <span>{catEmoji}</span> {post.category}
              </Link>
            </div>

            {/* CTA */}
            <div className="rounded-2xl bg-blue-600 p-5 text-white text-center">
              <p className="font-semibold mb-1 text-sm">Trouvez un professionnel</p>
              <p className="text-xs text-blue-100 mb-3">Accédez à l&apos;annuaire complet</p>
              <Link href="/bruxelles"
                className="block rounded-lg bg-white px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors">
                Parcourir l&apos;annuaire
              </Link>
            </div>
          </aside>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Articles similaires</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 text-center">
          <Link href="/blog"
            className="inline-block rounded-full border border-blue-200 px-6 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
            ← Retour au blog
          </Link>
        </div>
      </main>

      <Footer />
    </>
  )
}

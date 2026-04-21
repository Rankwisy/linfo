import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getPublishedPosts } from '@/services/blog'
import { BlogCard } from '@/components/blog/BlogCard'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog — Conseils et guides pour les professionnels en Belgique | linfo.be',
  description:
    'Découvrez nos articles sur le droit, le mariage, la rénovation, la santé et les services professionnels en Belgique. Conseils pratiques et guides experts.',
  alternates: { canonical: 'https://linfo.be/blog' },
  openGraph: {
    title: 'Blog linfo.be — Conseils pour les professionnels en Belgique',
    description: 'Guides pratiques, actualités et conseils pour trouver les meilleurs professionnels en Belgique.',
    url: 'https://linfo.be/blog',
    siteName: 'linfo.be',
    type: 'website',
  },
}

const CATEGORIES = ['Tous', 'Juridique', 'Mariage', 'Rénovation', 'Santé', 'Business', 'Transport']

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-4 py-14 text-white text-center">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300">Blog linfo.be</p>
          <h1 className="text-4xl font-extrabold mb-3">Conseils &amp; Guides</h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Actualités, guides pratiques et conseils d&apos;experts pour les professionnels et particuliers en Belgique.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Breadcrumb */}
        <nav className="mb-8 flex gap-2 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue-600">Accueil</Link>
          <span>/</span>
          <span className="text-gray-700">Blog</span>
        </nav>

        {/* Category filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium cursor-pointer transition-colors ${
                cat === 'Tous'
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Post grid */}
        {posts.length === 0 ? (
          <div className="py-24 text-center text-gray-400">
            <p className="text-5xl mb-4">✍️</p>
            <p className="text-lg font-medium text-gray-500">Aucun article publié pour le moment.</p>
            <p className="text-sm mt-1">Revenez bientôt !</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}

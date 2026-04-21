import Link from 'next/link'
import { getAllPostsAdmin } from '@/services/blog'
import { PlusCircleIcon, PencilIcon, EyeIcon } from 'lucide-react'
import { DeletePostButton } from '@/components/blog/DeletePostButton'

export const dynamic = 'force-dynamic'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-BE', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default async function AdminBlogPage() {
  const posts = await getAllPostsAdmin()

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Articles de blog</h1>
          <p className="text-sm text-slate-500 mt-1">{posts.length} article{posts.length !== 1 ? 's' : ''} au total</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <PlusCircleIcon size={16} />
          Nouvel article
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center">
          <p className="text-4xl mb-3">✍️</p>
          <p className="text-slate-500 font-medium">Aucun article.</p>
          <Link href="/admin/blog/new"
            className="mt-4 inline-block text-sm text-blue-600 hover:underline">
            Créer le premier article →
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left">
                <th className="px-5 py-3 font-semibold text-slate-600">Titre</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Catégorie</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Statut</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Date</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr key={post.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i === posts.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-slate-900 line-clamp-1">{post.title}</span>
                    <span className="block text-xs text-slate-400 mt-0.5">/blog/{post.slug}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      post.published
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {post.published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs">
                    {formatDate(post.created_at)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      {post.published && (
                        <Link href={`/blog/${post.slug}`} target="_blank"
                          className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors">
                          <EyeIcon size={12} /> Voir
                        </Link>
                      )}
                      <Link href={`/admin/blog/${post.id}/edit`}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors">
                        <PencilIcon size={12} /> Éditer
                      </Link>
                      <DeletePostButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

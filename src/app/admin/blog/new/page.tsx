import Link from 'next/link'
import { ChevronLeftIcon } from 'lucide-react'
import { BlogPostForm } from '@/components/blog/BlogPostForm'

export default function NewBlogPostPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/blog"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4">
          <ChevronLeftIcon size={15} /> Retour aux articles
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Nouvel article</h1>
        <p className="text-sm text-slate-500 mt-1">Créez un nouvel article de blog</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <BlogPostForm />
      </div>
    </div>
  )
}

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeftIcon } from 'lucide-react'
import { getPostByIdAdmin } from '@/services/blog'
import { BlogPostForm } from '@/components/blog/BlogPostForm'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ id: string }> }

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params
  const post = await getPostByIdAdmin(id)
  if (!post) notFound()

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/blog"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4">
          <ChevronLeftIcon size={15} /> Retour aux articles
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Modifier l&apos;article</h1>
        <p className="text-sm text-slate-500 mt-1 line-clamp-1">{post.title}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <BlogPostForm post={post} />
      </div>
    </div>
  )
}

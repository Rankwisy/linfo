import { supabase } from '@/lib/supabase'

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string | null
  image_url: string | null
  category: string
  tags: string[]
  published: boolean
  author: string
  created_at: string
  updated_at: string
}

// ── Public ────────────────────────────────────────────────────────────────────

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data ?? []
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  if (error) return null
  return data
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('published', true)
  return data?.map((r) => r.slug) ?? []
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data ?? []
}

// ── Admin (all posts, including drafts) ───────────────────────────────────────

export async function getAllPostsAdmin(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data ?? []
}

export async function getPostByIdAdmin(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function createPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(post)
    .select()
    .single()
  if (error) { console.error(error); return null }
  return data
}

export async function updatePost(id: string, post: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(post)
    .eq('id', id)
    .select()
    .single()
  if (error) { console.error(error); return null }
  return data
}

export async function deletePost(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)
  return !error
}

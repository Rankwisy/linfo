import Link from 'next/link'
import { categories } from '@/data/categories'

interface CategoryGridProps {
  citySlug?: string
}

export default function CategoryGrid({ citySlug = 'bruxelles' }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/${cat.slug}-${citySlug}`}
          className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5"
        >
          <span className="text-4xl">{cat.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {cat.name}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {cat.subcategories.length} sous-catégories
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

import Link from 'next/link'
import { silos } from '@/data/silos'
import { getSiloIcon } from '@/lib/icon-registry'
import { Icon } from '@/components/ui/icon'

interface CategoryGridProps {
  citySlug?: string
}

export default function CategoryGrid({ citySlug = 'bruxelles' }: CategoryGridProps) {
  const featured = silos.slice(0, 12)

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {featured.map((silo) => {
        const { icon, color, bgColor } = getSiloIcon(silo.slug)
        return (
          <Link
            key={silo.slug}
            href={`/${citySlug}/${silo.slug}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5"
          >
            {/* Icon container */}
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${bgColor} transition-colors group-hover:bg-blue-50`}>
              <Icon icon={icon} size="xl" className={`${color} group-hover:text-blue-600 transition-colors`} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                {silo.name}
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {silo.subcategories.length} sous-catégories
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

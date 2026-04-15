import type { Business } from '@/services/businesses'
import BusinessCard from './BusinessCard'

interface BusinessListProps {
  businesses: Business[]
  title?: string
}

export default function BusinessList({ businesses, title }: BusinessListProps) {
  if (businesses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
        <p className="text-gray-500">Aucune entreprise trouvée pour cette sélection.</p>
        <p className="mt-1 text-sm text-gray-400">Revenez bientôt, de nouvelles entreprises s&apos;ajoutent chaque semaine.</p>
      </div>
    )
  }

  return (
    <div>
      {title && (
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{title}</h2>
      )}
      <div className="flex flex-col gap-4">
        {businesses.map((b) => (
          <BusinessCard key={b.objectID} business={b} />
        ))}
      </div>
    </div>
  )
}

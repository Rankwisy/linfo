import Link from 'next/link'
import { cities } from '@/data/cities'

export default function CityGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cities.map((city) => (
        <Link
          key={city.slug}
          href={`/transport-${city.slug}`}
          className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="relative z-10">
            <h3 className="text-lg font-bold">{city.name}</h3>
            <p className="mt-1 text-xs text-blue-200">{city.region}</p>
          </div>
          <div className="absolute -bottom-3 -right-3 text-6xl opacity-10 select-none">
            📍
          </div>
        </Link>
      ))}
    </div>
  )
}

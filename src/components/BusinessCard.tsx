'use client'
import Link from 'next/link'
import { StarIcon, PhoneIcon, MapPinIcon } from 'lucide-react'
import type { Business } from '@/services/businesses'

interface BusinessCardProps {
  business: Business
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const { name, slug, shortDescription, category, subcategory, city, phone, rating, reviewCount, featured } = business

  return (
    <Link href={`/company/${slug}`} className="group block">
      <div className="relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
        {featured && (
          <span className="absolute top-3 right-3 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
            En vedette
          </span>
        )}

        <div className="flex items-start gap-4">
          {/* Avatar placeholder */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-lg">
            {name.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {name}
            </h3>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                {subcategory}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MapPinIcon size={11} />
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{shortDescription}</p>

            <div className="mt-3 flex items-center justify-between">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <StarIcon size={14} className="fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-gray-800">{rating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({reviewCount})</span>
              </div>

              {/* Phone */}
              {phone && (
                <span
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600"
                  onClick={(e) => e.preventDefault()}
                >
                  <PhoneIcon size={11} />
                  {phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

'use client'
import Link from 'next/link'
import Image from 'next/image'
import { StarIcon, PhoneIcon, MapPinIcon, GlobeIcon } from 'lucide-react'
import type { Business } from '@/services/businesses'
import { getCategoryIcon } from '@/lib/icon-registry'
import { Icon } from '@/components/ui/icon'

const subcategoryLabel: Record<string, string> = {
  taxi: 'Taxi', autocar: 'Autocar', demenagement: 'Déménagement',
  'transport-marchandises': 'Transport marchandises',
  'reparation-auto': 'Réparation auto',
  gym: 'Gym & Fitness', piscine: 'Piscine', tennis: 'Tennis', football: 'Football',
  renovation: 'Rénovation', toiture: 'Toiture', electricite: 'Électricité', plomberie: 'Plomberie',
  nettoyage: 'Nettoyage', securite: 'Sécurité', informatique: 'Informatique', comptabilite: 'Comptabilité',
  'medecine-generale': 'Médecine', dentiste: 'Dentiste', pharmacie: 'Pharmacie', kinesitherapie: 'Kiné',
  restaurant: 'Restaurant', 'livraison-repas': 'Livraison repas', traiteur: 'Traiteur', boulangerie: 'Boulangerie',
  coiffeur: 'Coiffeur', esthetique: 'Esthétique', spa: 'Spa & Massage', 'mode-vetements': 'Mode',
  avocat: 'Avocat', notaire: 'Notaire', assurance: 'Assurance', 'conseil-financier': 'Conseil financier',
}

function getDomain(website?: string): string | null {
  if (!website) return null
  try {
    return new URL(website).hostname.replace('www.', '')
  } catch {
    return null
  }
}

interface BusinessCardProps {
  business: Business
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const { name, slug, shortDescription, category, subcategory, city, phone, rating, reviewCount, featured, imageUrl, website } = business
  const { icon, color, bgColor } = getCategoryIcon(category)
  const label = subcategoryLabel[subcategory] ?? subcategory
  const domain = getDomain(website)

  return (
    <Link href={`/company/${slug}`} className="group block">
      <div className="relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
        {featured && (
          <span className="absolute top-3 right-3 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
            En vedette
          </span>
        )}

        <div className="flex items-start gap-4">
          {/* Avatar: business image or category icon */}
          <div className={`relative h-14 w-14 shrink-0 rounded-xl overflow-hidden ${imageUrl ? '' : bgColor} flex items-center justify-center`}>
            {imageUrl ? (
              <Image src={imageUrl} alt={name} fill className="object-cover" />
            ) : (
              <Icon icon={icon} size="lg" className={color} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-listing-title text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {name}
            </h3>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                <Icon icon={icon} size="xs" className="text-blue-600" />
                {label}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MapPinIcon size={11} strokeWidth={1.75} aria-hidden />
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </span>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-2">{shortDescription}</p>

            <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <StarIcon size={14} strokeWidth={1.75} className="fill-amber-400 text-amber-400" aria-hidden />
                <span className="text-sm font-semibold text-gray-800">{rating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({reviewCount})</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Domain */}
                {domain && (
                  <span className="flex items-center gap-1 text-xs text-blue-500">
                    <GlobeIcon size={11} strokeWidth={1.75} aria-hidden />
                    {domain}
                  </span>
                )}
                {/* Phone */}
                {phone && (
                  <span
                    className="flex items-center gap-1 text-xs text-gray-500"
                    onClick={(e) => e.preventDefault()}
                  >
                    <PhoneIcon size={11} strokeWidth={1.75} aria-hidden />
                    {phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

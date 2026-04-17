import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRightIcon, ExternalLinkIcon } from 'lucide-react'
import { getListing } from '@/lib/admin/actions'
import ListingForm from '@/components/admin/listing-form'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const listing = await getListing(id)
  return { title: listing ? `Edit: ${listing.name}` : 'Edit Listing' }
}

export default async function EditListingPage({ params }: Props) {
  const { id } = await params
  const listing = await getListing(id)
  if (!listing) notFound()

  return (
    <div className="p-8 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/admin" className="hover:text-gray-600">Admin</Link>
        <ChevronRightIcon size={12} />
        <Link href="/admin/listings" className="hover:text-gray-600">Listings</Link>
        <ChevronRightIcon size={12} />
        <span className="text-gray-700 font-medium truncate max-w-[200px]">{listing.name}</span>
      </nav>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{listing.name}</h1>
          <p className="text-gray-400 text-sm mt-0.5 capitalize">
            {listing.category} · {listing.city}
          </p>
        </div>
        <Link
          href={`/company/${listing.slug}`}
          target="_blank"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <ExternalLinkIcon size={13} />
          View public page
        </Link>
      </div>

      <ListingForm mode="edit" listing={listing} />
    </div>
  )
}

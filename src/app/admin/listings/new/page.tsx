import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRightIcon } from 'lucide-react'
import ListingForm from '@/components/admin/listing-form'

export const metadata: Metadata = { title: 'Add Listing' }

export default function NewListingPage() {
  return (
    <div className="p-8 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/admin" className="hover:text-gray-600">Admin</Link>
        <ChevronRightIcon size={12} />
        <Link href="/admin/listings" className="hover:text-gray-600">Listings</Link>
        <ChevronRightIcon size={12} />
        <span className="text-gray-700 font-medium">New Listing</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Add a new listing</h1>
        <p className="text-gray-400 text-sm mt-0.5">Fill in the details below to add a business to the directory.</p>
      </div>

      <ListingForm mode="create" />
    </div>
  )
}

import type { Metadata } from 'next'
import ImportWizard from '@/components/admin/import-wizard'

export const metadata: Metadata = { title: 'Import / Export' }

export default function ImportPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Import / Export</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          Bulk-import listings from a CSV file with field mapping and duplicate detection.
        </p>
      </div>
      <ImportWizard />
    </div>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { RefreshCwIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react'

interface Props { configured: boolean }

export default function AlgoliaSettings({ configured }: Props) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ synced?: number; error?: string } | null>(null)

  async function handleResync() {
    setResult(null)
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/algolia-resync', { method: 'POST' })
        const json = await res.json()
        setResult(json)
      } catch (err: any) {
        setResult({ error: err.message })
      }
    })
  }

  if (!configured) {
    return (
      <p className="text-xs text-gray-400">
        Add the environment variables above and redeploy to enable Algolia sync.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleResync}
        disabled={isPending}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
      >
        <RefreshCwIcon size={14} className={isPending ? 'animate-spin' : ''} />
        {isPending ? 'Syncing all listings…' : 'Full resync to Algolia'}
      </button>
      {result && (
        <div
          className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
            result.error
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}
        >
          {result.error ? (
            <><AlertCircleIcon size={14} /> {result.error}</>
          ) : (
            <><CheckCircleIcon size={14} /> Synced {result.synced?.toLocaleString('fr-BE')} listings.</>
          )}
        </div>
      )}
    </div>
  )
}

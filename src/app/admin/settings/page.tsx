import type { Metadata } from 'next'
import { isAlgoliaConfigured, fullResyncToAlgolia } from '@/lib/admin/algolia'
import { createClient } from '@supabase/supabase-js'
import AlgoliaSettings from '@/components/admin/algolia-settings'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const algoliaOk = isAlgoliaConfigured()

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-400 text-sm mt-0.5">Admin configuration and integrations</p>
      </div>

      <div className="space-y-6">
        {/* Algolia */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-800">Algolia Search</h3>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                algoliaOk
                  ? 'bg-green-50 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${algoliaOk ? 'bg-green-500' : 'bg-gray-400'}`} />
              {algoliaOk ? 'Connected' : 'Not configured'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-5">
            Configure the environment variables below, then resync to make all listings instantly searchable.
          </p>

          <div className="space-y-3 font-mono text-xs bg-gray-50 rounded-lg p-4 border border-gray-100 mb-5">
            {[
              ['ALGOLIA_APP_ID', 'Your Algolia App ID'],
              ['ALGOLIA_ADMIN_KEY', 'Admin API key (server-side only)'],
              ['ALGOLIA_INDEX_NAME', 'Index name (default: businesses)'],
              ['NEXT_PUBLIC_ALGOLIA_APP_ID', 'Same App ID (for client search)'],
              ['NEXT_PUBLIC_ALGOLIA_SEARCH_KEY', 'Search-only API key (public)'],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-start gap-3">
                <span className="text-blue-600 shrink-0">{key}</span>
                <span className="text-gray-400"># {desc}</span>
              </div>
            ))}
          </div>

          <AlgoliaSettings configured={algoliaOk} />
        </div>

        {/* Supabase */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-800">Supabase Database</h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Connected
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Your data is stored in Supabase. The admin uses the service role key to bypass RLS.
          </p>
          <div className="font-mono text-xs bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-2">
            <div className="flex gap-3">
              <span className="text-blue-600">NEXT_PUBLIC_SUPABASE_URL</span>
              <span className="text-gray-400"># Your project URL</span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              <span className="text-gray-400"># Anon key</span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600">SUPABASE_SERVICE_ROLE_KEY</span>
              <span className="text-gray-400"># Service role (admin, server-side only)</span>
            </div>
          </div>
        </div>

        {/* Admin access */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">Admin Access</h3>
          <p className="text-xs text-gray-400 mb-4">
            The admin panel at <code className="font-mono bg-gray-100 px-1 rounded">/admin</code> has
            no authentication by default. Protect it using Next.js Middleware or Vercel authentication.
          </p>
          <div className="font-mono text-xs bg-gray-50 rounded-lg p-4 border border-gray-100 text-gray-600">
            <p className="font-semibold text-gray-700 mb-2"># middleware.ts (example with basic auth)</p>
            <p>{"import { NextRequest, NextResponse } from 'next/server'"}</p>
            <p>{"export function middleware(req: NextRequest) {"}</p>
            <p className="pl-4">{"const auth = req.headers.get('authorization')"}</p>
            <p className="pl-4">{"if (!auth || auth !== `Basic ${btoa(process.env.ADMIN_PASSWORD!)}`) {"}</p>
            <p className="pl-8">{"return new NextResponse('Unauthorized', { status: 401,"}</p>
            <p className="pl-8">{"  headers: { 'WWW-Authenticate': 'Basic realm=\"Admin\"' }})"}</p>
            <p className="pl-4">{"}"}</p>
            <p>{"}"}</p>
            <p>{"export const config = { matcher: ['/admin/:path*'] }"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Algolia admin utilities (server-side only).
 * All functions gracefully no-op when env vars are not configured.
 *
 * Required env vars:
 *   ALGOLIA_APP_ID          — your Algolia app ID
 *   ALGOLIA_ADMIN_KEY       — admin API key (server-only, never expose client-side)
 *   ALGOLIA_INDEX_NAME      — index name (default: "businesses")
 *
 * For client-side search in the admin table, also set:
 *   NEXT_PUBLIC_ALGOLIA_APP_ID
 *   NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
 */

import { algoliasearch } from 'algoliasearch'

const INDEX_NAME = process.env.ALGOLIA_INDEX_NAME ?? 'businesses'

function getClient() {
  const appId = process.env.ALGOLIA_APP_ID
  const adminKey = process.env.ALGOLIA_ADMIN_KEY
  if (!appId || !adminKey) return null
  return algoliasearch(appId, adminKey)
}

export function isAlgoliaConfigured() {
  return !!(process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_ADMIN_KEY)
}

/** Index or update one or more records. */
export async function syncListingsToAlgolia(records: Record<string, unknown>[]) {
  if (records.length === 0) return { synced: 0 }
  const client = getClient()
  if (!client) return { synced: 0 }

  try {
    await client.saveObjects({
      indexName: INDEX_NAME,
      objects: records.map((r) => ({
        ...r,
        objectID: (r.object_id as string) ?? (r.id as string),
      })),
    })
    return { synced: records.length }
  } catch (err) {
    console.error('[Algolia] syncListingsToAlgolia error:', err)
    return { synced: 0 }
  }
}

/** Delete a single record by object_id. */
export async function removeFromAlgolia(objectId: string) {
  const client = getClient()
  if (!client) return
  try {
    await client.deleteObject({ indexName: INDEX_NAME, objectID: objectId })
  } catch (err) {
    console.error('[Algolia] removeFromAlgolia error:', err)
  }
}

/** Delete multiple records. */
export async function removeMultipleFromAlgolia(objectIds: string[]) {
  if (objectIds.length === 0) return
  const client = getClient()
  if (!client) return
  try {
    await Promise.all(
      objectIds.map((id) => client.deleteObject({ indexName: INDEX_NAME, objectID: id }))
    )
  } catch (err) {
    console.error('[Algolia] removeMultipleFromAlgolia error:', err)
  }
}

/**
 * Full re-index: fetches all records from Supabase in 1 000-row batches
 * and uploads them to Algolia.
 */
export async function fullResyncToAlgolia(
  supabase: { from: (t: string) => any }
): Promise<{ synced: number; error?: string }> {
  const client = getClient()
  if (!client) return { synced: 0, error: 'Algolia not configured' }

  let page = 0
  const pageSize = 1000
  let total = 0

  try {
    while (true) {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .range(page * pageSize, (page + 1) * pageSize - 1)

      if (error) throw error
      if (!data || data.length === 0) break

      await client.saveObjects({
        indexName: INDEX_NAME,
        objects: data.map((r: Record<string, unknown>) => ({
          ...r,
          objectID: (r.object_id as string) ?? (r.id as string),
        })),
      })

      total += data.length
      if (data.length < pageSize) break
      page++
    }
    return { synced: total }
  } catch (err: any) {
    console.error('[Algolia] fullResyncToAlgolia error:', err)
    return { synced: total, error: err?.message ?? 'Unknown error' }
  }
}

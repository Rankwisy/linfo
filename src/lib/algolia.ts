import { liteClient as algoliasearch } from 'algoliasearch/lite'

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || ''
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ''

export const INDEX_NAME =
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'linfo_businesses'

export const algoliaClient = algoliasearch(appId, searchKey)

export const isAlgoliaConfigured = Boolean(appId && searchKey)

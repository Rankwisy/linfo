import { z } from 'zod'

const optionalUrl = z
  .string()
  .optional()
  .nullable()
  .transform((v) => v?.trim() || null)
  .refine((v) => !v || /^https?:\/\/.+/.test(v), { message: 'URL invalide (ex: https://...)' })

const optionalEmail = z
  .string()
  .optional()
  .nullable()
  .transform((v) => v?.trim() || null)
  .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), { message: 'Email invalide' })

export const listingSchema = z.object({
  // ── Identity ────────────────────────────────────────────────────────────────
  name: z.string().min(2, 'Minimum 2 caractères').max(200, 'Maximum 200 caractères').trim(),
  slug: z
    .string()
    .min(2, 'Minimum 2 caractères')
    .max(100, 'Maximum 100 caractères')
    .regex(/^[a-z0-9-]+$/, 'Slug : minuscules, chiffres et tirets uniquement'),
  category: z.string().min(1, 'Catégorie requise'),
  subcategory: z.string().min(1, 'Sous-catégorie requise'),
  city: z.string().min(1, 'Ville requise'),

  // ── Contact ─────────────────────────────────────────────────────────────────
  address: z.string().max(300).optional().nullable().transform((v) => v?.trim() || null),
  phone: z.string().max(30).optional().nullable().transform((v) => v?.trim() || null),
  email: optionalEmail,
  website: optionalUrl,

  // ── Content ─────────────────────────────────────────────────────────────────
  description: z.string().max(5000).optional().nullable().transform((v) => v?.trim() || null),
  short_description: z
    .string()
    .max(160, 'Maximum 160 caractères')
    .optional()
    .nullable()
    .transform((v) => v?.trim() || null),
  image_url: optionalUrl,

  // ── Location ────────────────────────────────────────────────────────────────
  lat: z.coerce.number().min(-90).max(90).optional().nullable(),
  lng: z.coerce.number().min(-180).max(180).optional().nullable(),

  // ── Flags ───────────────────────────────────────────────────────────────────
  featured: z.boolean(),
  rating: z.coerce.number().min(0).max(5),
  review_count: z.coerce.number().min(0),
})

export type ListingFormData = z.infer<typeof listingSchema>

// Partial schema for updates (all optional)
export const listingUpdateSchema = listingSchema.partial()
export type ListingUpdateData = z.infer<typeof listingUpdateSchema>

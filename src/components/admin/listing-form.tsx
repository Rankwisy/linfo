'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  BuildingIcon,
  PhoneIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  TagIcon,
  SaveIcon,
  XIcon,
  RefreshCwIcon,
  StarIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from 'lucide-react'
import { listingSchema, type ListingFormData } from '@/lib/admin/validators'
import { createListing, updateListing } from '@/lib/admin/actions'
import { silos } from '@/data/silos'
import { cities } from '@/data/cities'
import type { BusinessRow } from '@/lib/supabase'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60)
}

function makeSlug(name: string, city: string): string {
  if (!name && !city) return ''
  const sfx = Math.random().toString(36).substring(2, 5)
  return `${slugify(name)}-${slugify(city)}-${sfx}`
}

// ─── Field wrappers ───────────────────────────────────────────────────────────

function Field({
  label,
  error,
  required,
  hint,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircleIcon size={11} /> {error}
        </p>
      )}
    </div>
  )
}

function Input({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-300 ${className}`}
    />
  )
}

function SectionHeader({ num, title, icon: Icon }: { num: number; title: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold shrink-0">
        {num}
      </span>
      <Icon size={15} className="text-gray-400" />
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  mode: 'create' | 'edit'
  listing?: BusinessRow
}

export default function ListingForm({ mode, listing }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [serverSuccess, setServerSuccess] = useState(false)

  // Find the compound category::subcategory value for the existing listing
  const existingCatValue = listing
    ? `${listing.category}::${listing.subcategory}`
    : ''
  const [catValue, setCatValue] = useState(existingCatValue)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema) as any,
    defaultValues: listing
      ? {
          name: listing.name,
          slug: listing.slug,
          category: listing.category,
          subcategory: listing.subcategory,
          city: listing.city,
          address: listing.address ?? '',
          phone: listing.phone ?? '',
          email: listing.email ?? '',
          website: listing.website ?? '',
          description: listing.description ?? '',
          short_description: listing.short_description ?? '',
          image_url: listing.image_url ?? '',
          lat: listing.lat ?? undefined,
          lng: listing.lng ?? undefined,
          featured: listing.featured ?? false,
          rating: listing.rating ?? 0,
          review_count: listing.review_count ?? 0,
        }
      : {
          featured: false,
          rating: 0,
          review_count: 0,
        },
  })

  const watchName = watch('name')
  const watchCity = watch('city')
  const watchDesc = watch('description')

  // Auto-generate slug for new listings only
  useEffect(() => {
    if (mode === 'create' && watchName && watchCity) {
      setValue('slug', makeSlug(watchName, watchCity), { shouldValidate: false })
    }
  }, [mode, watchName, watchCity, setValue])

  // Auto-fill short_description from description
  useEffect(() => {
    if (watchDesc && !listing?.short_description) {
      setValue('short_description', watchDesc.substring(0, 160), { shouldValidate: false })
    }
  }, [watchDesc, listing, setValue])

  // Handle category select
  function handleCatChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    setCatValue(val)
    if (val) {
      const [cat, sub] = val.split('::')
      setValue('category', cat, { shouldValidate: true })
      setValue('subcategory', sub ?? cat, { shouldValidate: true })
    }
  }

  // Submit
  const onSubmit = (data: ListingFormData) => {
    setServerError(null)
    startTransition(async () => {
      const result =
        mode === 'create'
          ? await createListing(data)
          : await updateListing(listing!.id, data)

      if (result.success) {
        setServerSuccess(true)
        if (mode === 'create') {
          const id = (result as any).data?.id
          router.push(id ? `/admin/listings/${id}/edit` : '/admin/listings')
        }
      } else {
        setServerError(result.error)
      }
    })
  }

  if (serverSuccess && mode === 'edit') {
    return (
      <div className="flex items-center gap-3 px-6 py-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
        <CheckCircleIcon size={18} />
        Listing updated successfully.
        <button
          onClick={() => setServerSuccess(false)}
          className="ml-auto text-green-500 hover:text-green-700"
        >
          <XIcon size={14} />
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Server error */}
      {serverError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          <AlertCircleIcon size={15} />
          {serverError}
        </div>
      )}

      {/* ── Section 1: Business Info ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <SectionHeader num={1} title="Business Information" icon={BuildingIcon} />
        <div className="space-y-4">
          <Field label="Business name" required error={errors.name?.message}>
            <Input {...register('name')} placeholder="Ex: Taxi Express Bruxelles" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="City" required error={errors.city?.message}>
              <select
                {...register('city')}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select city…</option>
                {cities.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Category" required error={errors.category?.message ?? errors.subcategory?.message}>
              <select
                value={catValue}
                onChange={handleCatChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select category…</option>
                {silos.map((silo) => (
                  <optgroup key={silo.slug} label={`${silo.icon} ${silo.name}`}>
                    {silo.subcategories.map((sub) => (
                      <option
                        key={sub.slug}
                        value={`${silo.dbCategory ?? silo.slug}::${sub.dbSubcategory ?? sub.slug}`}
                      >
                        {sub.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Address">
            <Input {...register('address')} placeholder="Rue de la Loi 1, 1000 Bruxelles" />
          </Field>

          <Field
            label="Short description"
            hint="Max 160 characters — shown in listing cards."
            error={errors.short_description?.message}
          >
            <Input
              {...register('short_description')}
              placeholder="One-line summary of the business…"
              maxLength={160}
            />
          </Field>

          <Field label="Full description" error={errors.description?.message}>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Detailed description of services, opening hours, zones…"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-300"
            />
          </Field>

          {/* Flags row */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('featured')} className="rounded border-gray-300 text-amber-500" />
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <StarIcon size={13} className="text-amber-400" /> Featured
              </span>
            </label>
            <Field label="Rating (0–5)" error={errors.rating?.message}>
              <Input {...register('rating')} type="number" step="0.1" min="0" max="5" className="w-20" />
            </Field>
            <Field label="Review count" error={errors.review_count?.message}>
              <Input {...register('review_count')} type="number" min="0" className="w-24" />
            </Field>
          </div>
        </div>
      </div>

      {/* ── Section 2: Contact ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <SectionHeader num={2} title="Contact Information" icon={PhoneIcon} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone" error={errors.phone?.message}>
            <div className="relative">
              <PhoneIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <Input {...register('phone')} placeholder="+32 2 000 00 00" className="pl-8" />
            </div>
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <div className="relative">
              <MailIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <Input {...register('email')} type="email" placeholder="contact@business.be" className="pl-8" />
            </div>
          </Field>
          <Field label="Website" error={errors.website?.message}>
            <div className="relative">
              <GlobeIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <Input {...register('website')} type="url" placeholder="https://www.business.be" className="pl-8" />
            </div>
          </Field>
          <Field label="Image URL" error={errors.image_url?.message}>
            <Input {...register('image_url')} type="url" placeholder="https://cdn.example.com/photo.jpg" />
          </Field>
        </div>
      </div>

      {/* ── Section 3: Location ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <SectionHeader num={3} title="Location Coordinates" icon={MapPinIcon} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Latitude" hint="Ex: 50.8503" error={errors.lat?.message}>
            <Input {...register('lat')} type="number" step="any" placeholder="50.8503" />
          </Field>
          <Field label="Longitude" hint="Ex: 4.3517" error={errors.lng?.message}>
            <Input {...register('lng')} type="number" step="any" placeholder="4.3517" />
          </Field>
        </div>
      </div>

      {/* ── Section 4: SEO ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <SectionHeader num={4} title="SEO & URL" icon={TagIcon} />
        <div className="space-y-4">
          <Field
            label="Slug"
            required
            hint="Used in the public URL: /company/{slug}"
            error={errors.slug?.message}
          >
            <div className="flex gap-2">
              <Input {...register('slug')} placeholder="business-name-brussels-abc" className="font-mono text-xs" />
              {mode === 'create' && (
                <button
                  type="button"
                  onClick={() =>
                    setValue('slug', makeSlug(watchName ?? '', watchCity ?? ''), { shouldValidate: true })
                  }
                  className="px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors shrink-0"
                  title="Regenerate slug"
                >
                  <RefreshCwIcon size={13} />
                </button>
              )}
            </div>
          </Field>
        </div>
      </div>

      {/* ── Submit ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pb-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <SaveIcon size={14} />
          {isPending
            ? 'Saving…'
            : mode === 'create'
            ? 'Create Listing'
            : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/listings')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <XIcon size={13} />
          Cancel
        </button>
        {mode === 'edit' && !isDirty && (
          <span className="text-xs text-gray-400 ml-2">No unsaved changes</span>
        )}
      </div>
    </form>
  )
}

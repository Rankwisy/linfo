/**
 * Icon registry for linfo.be
 *
 * Single source of truth mapping:
 *   - silo slug → Lucide icon + Tailwind color/bg tokens
 *   - DB category slug → same shape (for BusinessCard)
 *
 * All icons are from Lucide React (tree-shakable, accessible SVGs).
 * Adding a new silo: add one entry here — every consumer updates automatically.
 */

import {
  CarIcon,
  Building2Icon,
  DumbbellIcon,
  WrenchIcon,
  HeartIcon,
  UtensilsIcon,
  ScissorsIcon,
  MonitorIcon,
  ScaleIcon,
  BookOpenIcon,
  LeafIcon,
  CalendarIcon,
  type LucideIcon,
} from 'lucide-react'

export interface SiloIconDef {
  icon: LucideIcon
  /** Tailwind text-color class for the icon itself */
  color: string
  /** Tailwind bg-color class for the icon container */
  bgColor: string
}

/* ── Silo registry (keyed by silo slug) ────────────────────────────────────── */

export const siloIconRegistry: Record<string, SiloIconDef> = {
  'automobile-transport': {
    icon: CarIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  'immobilier-construction': {
    icon: Building2Icon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  'sport-loisirs': {
    icon: DumbbellIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  'services-professionnels': {
    icon: WrenchIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  'sante-bien-etre': {
    icon: HeartIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  'restauration-alimentation': {
    icon: UtensilsIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  'beaute-mode': {
    icon: ScissorsIcon,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
  'informatique-technologies': {
    icon: MonitorIcon,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  'finance-juridique': {
    icon: ScaleIcon,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  'education-formation': {
    icon: BookOpenIcon,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
  'energie-environnement': {
    icon: LeafIcon,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  'evenementiel-culture': {
    icon: CalendarIcon,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
  },
}

/* ── DB category registry (keyed by businesses.category value) ─────────────── */
/*
   The businesses table uses shorter category strings (transport, sport, etc.).
   Map those to the same icon shapes so BusinessCard can look up cleanly.
*/

export const categoryIconRegistry: Record<string, SiloIconDef> = {
  transport:    siloIconRegistry['automobile-transport'],
  construction: siloIconRegistry['immobilier-construction'],
  sport:        siloIconRegistry['sport-loisirs'],
  services:     siloIconRegistry['services-professionnels'],
  sante:        siloIconRegistry['sante-bien-etre'],
  restauration: siloIconRegistry['restauration-alimentation'],
  beaute:       siloIconRegistry['beaute-mode'],
  informatique: siloIconRegistry['informatique-technologies'],
  juridique:    siloIconRegistry['finance-juridique'],
  education:    siloIconRegistry['education-formation'],
  energie:      siloIconRegistry['energie-environnement'],
  evenementiel: siloIconRegistry['evenementiel-culture'],
}

/** Fallback when no match is found */
const FALLBACK: SiloIconDef = {
  icon: Building2Icon,
  color: 'text-gray-500',
  bgColor: 'bg-gray-50',
}

export function getSiloIcon(siloSlug: string): SiloIconDef {
  return siloIconRegistry[siloSlug] ?? FALLBACK
}

export function getCategoryIcon(dbCategory: string): SiloIconDef {
  return categoryIconRegistry[dbCategory] ?? FALLBACK
}

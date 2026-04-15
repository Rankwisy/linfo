export interface Subcategory {
  slug: string
  name: string
  description: string
}

export interface Category {
  slug: string
  name: string
  icon: string
  color: string
  description: string
  subcategories: Subcategory[]
}

export const categories: Category[] = [
  {
    slug: 'transport',
    name: 'Transport',
    icon: '🚌',
    color: 'bg-blue-100 text-blue-700',
    description: 'Services de transport pour particuliers et professionnels en Belgique.',
    subcategories: [
      {
        slug: 'autocar',
        name: 'Autocar',
        description: 'Location d\'autocars et services de transport de groupe en Belgique.',
      },
      {
        slug: 'taxi',
        name: 'Taxi',
        description: 'Services de taxi et VTC disponibles dans les grandes villes belges.',
      },
      {
        slug: 'demenagement',
        name: 'Déménagement',
        description: 'Entreprises de déménagement professionnel en Belgique.',
      },
      {
        slug: 'transport-marchandises',
        name: 'Transport de marchandises',
        description: 'Logistique et transport de marchandises B2B en Belgique.',
      },
    ],
  },
  {
    slug: 'sport',
    name: 'Sport',
    icon: '⚽',
    color: 'bg-green-100 text-green-700',
    description: 'Clubs sportifs, salles de fitness et infrastructures sportives en Belgique.',
    subcategories: [
      {
        slug: 'gym',
        name: 'Gym & Fitness',
        description: 'Salles de sport et centres de fitness en Belgique.',
      },
      {
        slug: 'piscine',
        name: 'Piscine',
        description: 'Piscines publiques et privées en Belgique.',
      },
      {
        slug: 'tennis',
        name: 'Tennis',
        description: 'Clubs de tennis et terrains disponibles en Belgique.',
      },
      {
        slug: 'football',
        name: 'Football',
        description: 'Clubs de football et académies sportives en Belgique.',
      },
    ],
  },
  {
    slug: 'construction',
    name: 'Construction',
    icon: '🏗️',
    color: 'bg-orange-100 text-orange-700',
    description: 'Entrepreneurs et professionnels du bâtiment en Belgique.',
    subcategories: [
      {
        slug: 'renovation',
        name: 'Rénovation',
        description: 'Entreprises de rénovation résidentielle et commerciale en Belgique.',
      },
      {
        slug: 'toiture',
        name: 'Toiture',
        description: 'Couvreurs et spécialistes de toiture en Belgique.',
      },
      {
        slug: 'electricite',
        name: 'Électricité',
        description: 'Électriciens certifiés pour particuliers et entreprises en Belgique.',
      },
      {
        slug: 'plomberie',
        name: 'Plomberie',
        description: 'Plombiers professionnels disponibles en Belgique.',
      },
    ],
  },
  {
    slug: 'services',
    name: 'Services',
    icon: '🛠️',
    color: 'bg-purple-100 text-purple-700',
    description: 'Services aux entreprises et aux particuliers en Belgique.',
    subcategories: [
      {
        slug: 'nettoyage',
        name: 'Nettoyage',
        description: 'Entreprises de nettoyage résidentiel et commercial en Belgique.',
      },
      {
        slug: 'securite',
        name: 'Sécurité',
        description: 'Sociétés de gardiennage et systèmes de sécurité en Belgique.',
      },
      {
        slug: 'informatique',
        name: 'Informatique',
        description: 'Support informatique et services IT pour entreprises en Belgique.',
      },
      {
        slug: 'comptabilite',
        name: 'Comptabilité',
        description: 'Comptables et experts-comptables agréés en Belgique.',
      },
    ],
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function getSubcategoryBySlug(slug: string): { category: Category; subcategory: Subcategory } | undefined {
  for (const category of categories) {
    const subcategory = category.subcategories.find((s) => s.slug === slug)
    if (subcategory) return { category, subcategory }
  }
  return undefined
}

export function getAllSubcategorySlugs(): string[] {
  return categories.flatMap((c) => c.subcategories.map((s) => s.slug))
}

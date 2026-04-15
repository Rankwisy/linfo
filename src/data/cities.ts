export interface City {
  slug: string
  name: string
  nameFr: string
  region: string
  population: number
  description: string
}

export const cities: City[] = [
  {
    slug: 'bruxelles',
    name: 'Bruxelles',
    nameFr: 'Bruxelles',
    region: 'Région de Bruxelles-Capitale',
    population: 1_200_000,
    description:
      'Capitale de la Belgique et siège des institutions européennes, Bruxelles est un hub économique et multiculturel incontournable.',
  },
  {
    slug: 'anvers',
    name: 'Anvers',
    nameFr: 'Anvers',
    region: 'Province d\'Anvers, Flandre',
    population: 520_000,
    description:
      'Deuxième ville de Belgique, Anvers est un centre mondial du commerce de diamants et possède l\'un des plus grands ports d\'Europe.',
  },
  {
    slug: 'gand',
    name: 'Gand',
    nameFr: 'Gand',
    region: 'Province de Flandre-Orientale',
    population: 260_000,
    description:
      'Ville universitaire et culturelle, Gand combine un riche patrimoine médiéval avec une économie dynamique et innovante.',
  },
  {
    slug: 'liege',
    name: 'Liège',
    nameFr: 'Liège',
    region: 'Province de Liège, Wallonie',
    population: 200_000,
    description:
      'Troisième ville wallonne, Liège est un important carrefour économique et logistique au cœur de l\'Europe.',
  },
]

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug)
}

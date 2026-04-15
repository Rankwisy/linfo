export interface Business {
  objectID: string
  name: string
  slug: string
  category: string
  subcategory: string
  city: string
  address: string
  phone: string
  email: string
  website?: string
  description: string
  shortDescription: string
  tags: string[]
  featured: boolean
  rating: number
  reviewCount: number
  lat?: number
  lng?: number
}

export const businesses: Business[] = [
  // --- TRANSPORT / AUTOCAR ---
  {
    objectID: 'bru-autocar-001',
    name: 'Brussels Airport Express',
    slug: 'brussels-airport-express-bruxelles',
    category: 'transport',
    subcategory: 'autocar',
    city: 'bruxelles',
    address: 'Rue de la Loi 42, 1000 Bruxelles',
    phone: '+32 2 500 10 20',
    email: 'info@bruxellsairportexpress.be',
    website: 'https://example.be',
    description:
      'Brussels Airport Express est le spécialiste du transport en autocar entre Bruxelles et l\'aéroport de Zaventem. Nous proposons des services réguliers, des transferts privés et des solutions pour groupes. Notre flotte moderne assure confort et ponctualité pour tous vos déplacements professionnels et touristiques. Disponible 7j/7 et 24h/24, notre service clientèle est à votre disposition pour tout renseignement.',
    shortDescription: 'Transport en autocar entre Bruxelles et l\'aéroport. Services réguliers et privés.',
    tags: ['autocar', 'aéroport', 'transfert', 'groupe', 'transport'],
    featured: true,
    rating: 4.8,
    reviewCount: 124,
    lat: 50.8503,
    lng: 4.3517,
  },
  {
    objectID: 'bru-autocar-002',
    name: 'BelCoach Services',
    slug: 'belcoach-services-bruxelles',
    category: 'transport',
    subcategory: 'autocar',
    city: 'bruxelles',
    address: 'Avenue Louise 205, 1050 Bruxelles',
    phone: '+32 2 640 30 40',
    email: 'contact@belcoach.be',
    description:
      'BelCoach Services est une entreprise de transport en autocar basée à Bruxelles. Nous offrons des solutions de transport pour les excursions scolaires, les événements d\'entreprise et les voyages touristiques à travers la Belgique et l\'Europe. Notre équipe de conducteurs professionnels garantit sécurité et confort à bord.',
    shortDescription: 'Location d\'autocars pour excursions, événements et voyages en Europe.',
    tags: ['autocar', 'excursion', 'événement', 'voyage', 'groupe'],
    featured: false,
    rating: 4.5,
    reviewCount: 87,
    lat: 50.8228,
    lng: 4.3800,
  },
  // --- TRANSPORT / TAXI ---
  {
    objectID: 'bru-taxi-001',
    name: 'Taxi Brussels Premium',
    slug: 'taxi-brussels-premium-bruxelles',
    category: 'transport',
    subcategory: 'taxi',
    city: 'bruxelles',
    address: 'Place De Brouckère 12, 1000 Bruxelles',
    phone: '+32 2 349 49 49',
    email: 'booking@taxibrussels.be',
    website: 'https://example.be',
    description:
      'Taxi Brussels Premium vous propose un service de taxi haut de gamme dans toute la capitale belge. Réservez votre taxi en ligne ou par téléphone pour des transferts aéroport, des trajets professionnels ou des sorties en ville. Nos chauffeurs parlent français, néerlandais et anglais. Service disponible 24h/24 et 7j/7.',
    shortDescription: 'Service de taxi premium à Bruxelles, disponible 24h/24 et 7j/7.',
    tags: ['taxi', 'vtc', 'transfert', 'aéroport', 'bruxelles'],
    featured: true,
    rating: 4.7,
    reviewCount: 342,
    lat: 50.8503,
    lng: 4.3531,
  },
  {
    objectID: 'bru-taxi-002',
    name: 'Taxi Vert Bruxelles',
    slug: 'taxi-vert-bruxelles-bruxelles',
    category: 'transport',
    subcategory: 'taxi',
    city: 'bruxelles',
    address: 'Boulevard Anspach 65, 1000 Bruxelles',
    phone: '+32 2 349 49 50',
    email: 'info@taxivert.be',
    description:
      'Taxi Vert Bruxelles est l\'une des plus anciennes compagnies de taxi de la capitale. Avec une flotte de plus de 200 véhicules, nous assurons des courses rapides et fiables dans toute la région bruxelloise. Paiement par carte bancaire accepté dans tous nos véhicules.',
    shortDescription: 'Compagnie de taxi historique de Bruxelles. Flotte de 200 véhicules.',
    tags: ['taxi', 'bruxelles', 'course', 'paiement carte'],
    featured: false,
    rating: 4.3,
    reviewCount: 218,
    lat: 50.8489,
    lng: 4.3480,
  },
  // --- SPORT / GYM ---
  {
    objectID: 'bru-gym-001',
    name: 'Brussels Fitness Club',
    slug: 'brussels-fitness-club-bruxelles',
    category: 'sport',
    subcategory: 'gym',
    city: 'bruxelles',
    address: 'Chaussée de Waterloo 1500, 1180 Bruxelles',
    phone: '+32 2 374 12 34',
    email: 'info@brusselsfitness.be',
    website: 'https://example.be',
    description:
      'Brussels Fitness Club est le centre de fitness de référence à Bruxelles. Nous proposons plus de 50 cours collectifs par semaine, des équipements de pointe et un suivi personnalisé par nos coaches certifiés. Salle ouverte 7j/7 de 6h à 23h. Abonnements flexibles sans engagement disponibles.',
    shortDescription: 'Centre de fitness moderne avec 50+ cours collectifs. Ouvert 7j/7.',
    tags: ['gym', 'fitness', 'musculation', 'cours collectifs', 'sport'],
    featured: true,
    rating: 4.9,
    reviewCount: 456,
    lat: 50.8140,
    lng: 4.3650,
  },
  {
    objectID: 'bru-gym-002',
    name: 'FitZone Ixelles',
    slug: 'fitzone-ixelles-bruxelles',
    category: 'sport',
    subcategory: 'gym',
    city: 'bruxelles',
    address: 'Rue du Bailli 28, 1050 Bruxelles',
    phone: '+32 2 511 22 33',
    email: 'contact@fitzone.be',
    description:
      'FitZone Ixelles est une salle de sport boutique au cœur d\'Ixelles. Spécialisés en CrossFit, yoga et HIIT, nos entraîneurs passionnés vous accompagnent vers vos objectifs. Sessions en petits groupes pour un suivi optimal. Premier cours gratuit pour les nouveaux membres.',
    shortDescription: 'Salle de sport boutique à Ixelles. CrossFit, yoga et HIIT.',
    tags: ['gym', 'crossfit', 'yoga', 'hiit', 'fitness', 'ixelles'],
    featured: false,
    rating: 4.6,
    reviewCount: 198,
    lat: 50.8325,
    lng: 4.3680,
  },
  {
    objectID: 'bru-gym-003',
    name: 'Basic-Fit Bruxelles Centre',
    slug: 'basic-fit-bruxelles-centre-bruxelles',
    category: 'sport',
    subcategory: 'gym',
    city: 'bruxelles',
    address: 'Rue Neuve 45, 1000 Bruxelles',
    phone: '+32 2 217 00 10',
    email: 'bruxelles.centre@basic-fit.com',
    website: 'https://example.be',
    description:
      'Basic-Fit Bruxelles Centre vous offre un accès à une salle de sport équipée au meilleur prix. Plus de 200 appareils de cardio et musculation, accès aux douches et vestiaires. Abonnement à partir de 19,99€/mois avec accès à tous les clubs Basic-Fit en Europe.',
    shortDescription: 'Salle de sport accessible à prix mini. Plus de 200 appareils.',
    tags: ['gym', 'fitness', 'pas cher', 'musculation', 'cardio'],
    featured: false,
    rating: 4.1,
    reviewCount: 512,
    lat: 50.8534,
    lng: 4.3580,
  },
  // --- SPORT / PISCINE ---
  {
    objectID: 'bru-piscine-001',
    name: 'Piscine de Saint-Gilles',
    slug: 'piscine-de-saint-gilles-bruxelles',
    category: 'sport',
    subcategory: 'piscine',
    city: 'bruxelles',
    address: 'Rue du Fort 38, 1060 Saint-Gilles',
    phone: '+32 2 536 02 10',
    email: 'piscine@saint-gilles.irisnet.be',
    description:
      'La Piscine de Saint-Gilles est un bâtiment Art Nouveau classé, offrant un bassin de 25m pour la natation sportive et récréative. Des cours de natation pour tous les âges sont proposés tout au long de l\'année. Tarifs préférentiels pour les habitants de Saint-Gilles.',
    shortDescription: 'Piscine Art Nouveau classée à Saint-Gilles. Cours de natation pour tous.',
    tags: ['piscine', 'natation', 'aquatique', 'sport', 'bruxelles'],
    featured: true,
    rating: 4.4,
    reviewCount: 167,
    lat: 50.8267,
    lng: 4.3420,
  },
  // --- TRANSPORT / DEMENAGEMENT ---
  {
    objectID: 'bru-dem-001',
    name: 'Brussels Moving Company',
    slug: 'brussels-moving-company-bruxelles',
    category: 'transport',
    subcategory: 'demenagement',
    city: 'bruxelles',
    address: 'Chaussée de Haecht 200, 1030 Bruxelles',
    phone: '+32 2 215 88 77',
    email: 'info@bruxellsmoving.be',
    description:
      'Brussels Moving Company est votre partenaire de confiance pour tous vos déménagements à Bruxelles et en Belgique. Nous prenons en charge l\'emballage, le transport et le déballage de vos effets personnels. Devis gratuit sous 24h. Assurance incluse dans tous nos forfaits.',
    shortDescription: 'Déménagements professionnels à Bruxelles. Emballage et assurance inclus.',
    tags: ['déménagement', 'transport', 'déménageur', 'bruxelles', 'belgique'],
    featured: false,
    rating: 4.5,
    reviewCount: 143,
    lat: 50.8650,
    lng: 4.3750,
  },
]

export function getBusinessBySlug(slug: string): Business | undefined {
  return businesses.find((b) => b.slug === slug)
}

export function getBusinessesByCategory(category: string): Business[] {
  return businesses.filter((b) => b.category === category)
}

export function getBusinessesBySubcategory(subcategory: string): Business[] {
  return businesses.filter((b) => b.subcategory === subcategory)
}

export function getBusinessesByCity(city: string): Business[] {
  return businesses.filter((b) => b.city === city)
}

export function getBusinessesByCategoryAndCity(category: string, city: string): Business[] {
  return businesses.filter((b) => b.category === category && b.city === city)
}

export function getBusinessesBySubcategoryAndCity(subcategory: string, city: string): Business[] {
  return businesses.filter((b) => b.subcategory === subcategory && b.city === city)
}

export function getFeaturedBusinesses(): Business[] {
  return businesses.filter((b) => b.featured)
}

export interface SiloSubcategory {
  slug: string
  name: string
  description: string
  dbCategory?: string    // maps to `category` column in businesses table
  dbSubcategory?: string // maps to `subcategory` column in businesses table
}

export interface Silo {
  slug: string
  name: string
  icon: string
  color: string
  bgColor: string
  description: string
  dbCategory?: string // if entire silo maps to one DB category
  subcategories: SiloSubcategory[]
}

export const silos: Silo[] = [
  {
    slug: 'automobile-transport',
    name: 'Automobile & Transport',
    icon: '🚗',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    description: 'Services de transport, taxis, autocars, déménagement et logistique en Belgique.',
    dbCategory: 'transport',
    subcategories: [
      {
        slug: 'taxi',
        name: 'Taxi & VTC',
        description: 'Services de taxi et VTC disponibles 24h/24 et 7j/7 dans toute la Belgique.',
        dbCategory: 'transport',
        dbSubcategory: 'taxi',
      },
      {
        slug: 'location-autocar',
        name: 'Location d\'autocar',
        description: 'Location d\'autocars pour groupes, événements, excursions et transferts.',
        dbCategory: 'transport',
        dbSubcategory: 'autocar',
      },
      {
        slug: 'demenagement',
        name: 'Déménagement',
        description: 'Entreprises de déménagement professionnel pour particuliers et entreprises.',
        dbCategory: 'transport',
        dbSubcategory: 'demenagement',
      },
      {
        slug: 'transport-marchandises',
        name: 'Transport de marchandises',
        description: 'Logistique, fret et transport de marchandises B2B en Belgique.',
        dbCategory: 'transport',
        dbSubcategory: 'transport-marchandises',
      },
    ],
  },
  {
    slug: 'immobilier-construction',
    name: 'Immobilier & Construction',
    icon: '🏗️',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    description: 'Entrepreneurs, rénovation, toiture, plomberie, électricité et agences immobilières.',
    dbCategory: 'construction',
    subcategories: [
      {
        slug: 'renovation',
        name: 'Rénovation',
        description: 'Rénovation résidentielle et commerciale : cuisine, salle de bain, intérieur.',
        dbCategory: 'construction',
        dbSubcategory: 'renovation',
      },
      {
        slug: 'toiture',
        name: 'Toiture',
        description: 'Couvreurs et spécialistes de toiture, réparation et pose de couvertures.',
        dbCategory: 'construction',
        dbSubcategory: 'toiture',
      },
      {
        slug: 'plomberie',
        name: 'Plomberie',
        description: 'Plombiers professionnels pour particuliers et entreprises, interventions urgentes.',
        dbCategory: 'construction',
        dbSubcategory: 'plomberie',
      },
      {
        slug: 'electricite',
        name: 'Électricité',
        description: 'Électriciens certifiés pour installations, rénovations et dépannages électriques.',
        dbCategory: 'construction',
        dbSubcategory: 'electricite',
      },
    ],
  },
  {
    slug: 'sport-loisirs',
    name: 'Sport & Loisirs',
    icon: '⚽',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    description: 'Salles de sport, clubs, piscines, tennis, football et activités sportives.',
    dbCategory: 'sport',
    subcategories: [
      {
        slug: 'gym-fitness',
        name: 'Gym & Fitness',
        description: 'Salles de sport, centres de fitness, musculation et cours collectifs.',
        dbCategory: 'sport',
        dbSubcategory: 'gym',
      },
      {
        slug: 'piscine',
        name: 'Piscine',
        description: 'Piscines publiques et privées, aquafitness et natation.',
        dbCategory: 'sport',
        dbSubcategory: 'piscine',
      },
      {
        slug: 'tennis',
        name: 'Tennis',
        description: 'Clubs de tennis, padel et terrains de jeu en Belgique.',
        dbCategory: 'sport',
        dbSubcategory: 'tennis',
      },
      {
        slug: 'football',
        name: 'Football',
        description: 'Clubs de football, académies et infrastructure de jeu.',
        dbCategory: 'sport',
        dbSubcategory: 'football',
      },
    ],
  },
  {
    slug: 'services-professionnels',
    name: 'Services Professionnels',
    icon: '🛠️',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    description: 'Nettoyage, sécurité, informatique, comptabilité et services aux entreprises.',
    dbCategory: 'services',
    subcategories: [
      {
        slug: 'nettoyage',
        name: 'Nettoyage',
        description: 'Entreprises de nettoyage résidentiel, commercial et industriel.',
        dbCategory: 'services',
        dbSubcategory: 'nettoyage',
      },
      {
        slug: 'securite-gardiennage',
        name: 'Sécurité & Gardiennage',
        description: 'Sociétés de gardiennage, surveillance et systèmes de sécurité.',
        dbCategory: 'services',
        dbSubcategory: 'securite',
      },
      {
        slug: 'informatique',
        name: 'Informatique & IT',
        description: 'Support informatique, maintenance PC et services IT pour entreprises.',
        dbCategory: 'services',
        dbSubcategory: 'informatique',
      },
      {
        slug: 'comptabilite',
        name: 'Comptabilité & Finance',
        description: 'Comptables, experts-comptables et conseillers fiscaux agréés.',
        dbCategory: 'services',
        dbSubcategory: 'comptabilite',
      },
    ],
  },
  {
    slug: 'sante-bien-etre',
    name: 'Santé & Bien-être',
    icon: '🏥',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    description: 'Médecins, dentistes, pharmacies, kinésithérapie et services médicaux.',
    subcategories: [
      {
        slug: 'medecine-generale',
        name: 'Médecine Générale',
        description: 'Médecins généralistes et spécialistes.',
      },
      {
        slug: 'dentiste',
        name: 'Dentiste',
        description: 'Cabinets dentaires et orthodontie.',
      },
      {
        slug: 'pharmacie',
        name: 'Pharmacie',
        description: 'Pharmacies de garde et parapharmacies.',
      },
      {
        slug: 'kinesitherapie',
        name: 'Kinésithérapie',
        description: 'Kinés, physiothérapeutes et ostéopathes.',
      },
    ],
  },
  {
    slug: 'restauration-alimentation',
    name: 'Restauration & Alimentation',
    icon: '🍽️',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    description: 'Restaurants, traiteurs, livraison de repas, boulangeries et épiceries.',
    subcategories: [
      {
        slug: 'restaurant',
        name: 'Restaurant',
        description: 'Restaurants, brasseries et cuisines du monde.',
      },
      {
        slug: 'livraison-repas',
        name: 'Livraison de repas',
        description: 'Services de livraison à domicile et takeaway.',
      },
      {
        slug: 'traiteur',
        name: 'Traiteur',
        description: 'Traiteurs pour mariages, événements et réceptions.',
      },
      {
        slug: 'boulangerie',
        name: 'Boulangerie',
        description: 'Boulangeries artisanales et pâtisseries.',
      },
    ],
  },
  {
    slug: 'beaute-mode',
    name: 'Beauté & Mode',
    icon: '💄',
    color: 'text-pink-700',
    bgColor: 'bg-pink-50',
    description: 'Coiffeurs, instituts de beauté, spa, massage et boutiques de mode.',
    subcategories: [
      {
        slug: 'coiffeur',
        name: 'Coiffeur',
        description: 'Salons de coiffure pour hommes et femmes.',
      },
      {
        slug: 'esthetique',
        name: 'Esthétique',
        description: 'Instituts de beauté, soins du visage et du corps.',
      },
      {
        slug: 'spa',
        name: 'Spa & Massage',
        description: 'Centres de spa, massages et relaxation.',
      },
      {
        slug: 'mode-vetements',
        name: 'Mode & Vêtements',
        description: 'Boutiques de mode, prêt-à-porter et accessoires.',
      },
    ],
  },
  {
    slug: 'informatique-technologies',
    name: 'Informatique & Technologies',
    icon: '💻',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    description: 'Développement web, cybersécurité, cloud et agences digitales.',
    subcategories: [
      {
        slug: 'developpement-web',
        name: 'Développement Web',
        description: 'Développeurs, agences web et création de sites internet.',
      },
      {
        slug: 'cybersecurite',
        name: 'Cybersécurité',
        description: 'Experts en sécurité informatique et protection des données.',
      },
      {
        slug: 'cloud-hosting',
        name: 'Cloud & Hébergement',
        description: 'Services cloud, hébergement web et infogérance.',
      },
      {
        slug: 'marketing-digital',
        name: 'Marketing Digital',
        description: 'Agences SEO, Google Ads, réseaux sociaux et e-mail marketing.',
      },
    ],
  },
  {
    slug: 'finance-juridique',
    name: 'Finance & Juridique',
    icon: '⚖️',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    description: 'Avocats, notaires, conseillers financiers, assurances et banques.',
    subcategories: [
      {
        slug: 'avocat',
        name: 'Avocat',
        description: 'Cabinets d\'avocats en droit civil, pénal, commercial et familial.',
      },
      {
        slug: 'notaire',
        name: 'Notaire',
        description: 'Études notariales pour actes immobiliers, successions et contrats.',
      },
      {
        slug: 'assurance',
        name: 'Assurance',
        description: 'Courtiers en assurance auto, habitation, santé et vie.',
      },
      {
        slug: 'conseil-financier',
        name: 'Conseil Financier',
        description: 'Conseillers en gestion de patrimoine et investissements.',
      },
    ],
  },
  {
    slug: 'education-formation',
    name: 'Éducation & Formation',
    icon: '📚',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
    description: 'Cours particuliers, langues, formations professionnelles et crèches.',
    subcategories: [
      {
        slug: 'cours-particuliers',
        name: 'Cours Particuliers',
        description: 'Soutien scolaire à domicile pour tous niveaux.',
      },
      {
        slug: 'langues',
        name: 'Cours de Langues',
        description: 'Écoles de langues : anglais, néerlandais, français, arabe...',
      },
      {
        slug: 'formation-professionnelle',
        name: 'Formation Professionnelle',
        description: 'Centres de formation continue et reconversion professionnelle.',
      },
      {
        slug: 'creche-garderie',
        name: 'Crèche & Garderie',
        description: 'Structures d\'accueil pour nourrissons et enfants.',
      },
    ],
  },
  {
    slug: 'energie-environnement',
    name: 'Énergie & Environnement',
    icon: '♻️',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    description: 'Panneaux solaires, isolation, pompes à chaleur et éco-solutions.',
    subcategories: [
      {
        slug: 'panneaux-solaires',
        name: 'Panneaux Solaires',
        description: 'Installation et entretien de panneaux photovoltaïques.',
      },
      {
        slug: 'isolation',
        name: 'Isolation',
        description: 'Isolation thermique, acoustique et économies d\'énergie.',
      },
      {
        slug: 'pompe-chaleur',
        name: 'Pompe à Chaleur',
        description: 'Installation et entretien de pompes à chaleur air-eau.',
      },
      {
        slug: 'gestion-dechets',
        name: 'Gestion des Déchets',
        description: 'Collecte, tri et traitement des déchets professionnels.',
      },
    ],
  },
  {
    slug: 'evenementiel-culture',
    name: 'Événementiel & Culture',
    icon: '🎭',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    description: 'Organisation d\'événements, lieux de réception, photographes et artistes.',
    subcategories: [
      {
        slug: 'organisation-evenements',
        name: 'Organisation d\'Événements',
        description: 'Agences événementielles pour mariages, séminaires et galas.',
      },
      {
        slug: 'lieu-reception',
        name: 'Lieu de Réception',
        description: 'Salles, châteaux et domaines pour événements privés et professionnels.',
      },
      {
        slug: 'photographe',
        name: 'Photographe',
        description: 'Photographes professionnels pour mariages, portraits et événements.',
      },
      {
        slug: 'dj-animation',
        name: 'DJ & Animation',
        description: 'DJs, animateurs et groupes musicaux pour soirées et réceptions.',
      },
    ],
  },
]

export function getSiloBySlug(slug: string): Silo | undefined {
  return silos.find((s) => s.slug === slug)
}

export function getSiloSubcategoryBySlug(
  subSlug: string
): { silo: Silo; subcategory: SiloSubcategory } | undefined {
  for (const silo of silos) {
    const subcategory = silo.subcategories.find((s) => s.slug === subSlug)
    if (subcategory) return { silo, subcategory }
  }
  return undefined
}

export function getSiloSubcategoryInSilo(
  siloSlug: string,
  subSlug: string
): SiloSubcategory | undefined {
  const silo = getSiloBySlug(siloSlug)
  return silo?.subcategories.find((s) => s.slug === subSlug)
}

export const siloSlugs = silos.map((s) => s.slug)

// Silos that have actual DB data
export const activeSilos = silos.filter((s) => s.dbCategory)

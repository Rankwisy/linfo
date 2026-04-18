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
  // ── 1. Automobile & Transport ──────────────────────────────────────────────
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
        name: "Location d'autocar",
        description: "Location d'autocars pour groupes, événements, excursions et transferts.",
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
      {
        slug: 'reparation-auto',
        name: 'Réparation automobile',
        description: 'Garages, mécaniciens et centres de réparation auto en Belgique.',
        dbCategory: 'transport',
        dbSubcategory: 'reparation-auto',
      },
    ],
  },

  // ── 2. Mariage (PRIORITÉ #1) ───────────────────────────────────────────────
  {
    slug: 'mariage',
    name: 'Mariage',
    icon: '💍',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    description:
      'Salles de mariage, traiteurs, photographes, wedding planners, robes de mariée et fleuristes en Belgique.',
    dbCategory: 'mariage',
    subcategories: [
      {
        slug: 'salle-mariage',
        name: 'Salle de mariage',
        description:
          'Salles et domaines de réception pour mariages, fêtes et événements privés en Belgique.',
        dbCategory: 'mariage',
        dbSubcategory: 'salle-mariage',
      },
      {
        slug: 'traiteur-mariage',
        name: 'Traiteur mariage',
        description:
          'Traiteurs spécialisés mariage : repas gastronomiques, cocktails et buffets pour vos invités.',
        dbCategory: 'mariage',
        dbSubcategory: 'traiteur-mariage',
      },
      {
        slug: 'photographe-mariage',
        name: 'Photographe & Vidéaste',
        description:
          'Photographes et vidéastes professionnels pour immortaliser votre mariage en Belgique.',
        dbCategory: 'mariage',
        dbSubcategory: 'photographe-mariage',
      },
      {
        slug: 'wedding-planner',
        name: 'Wedding Planner',
        description:
          "Organisateurs de mariage pour coordonner chaque détail de votre jour J en toute sérénité.",
        dbCategory: 'mariage',
        dbSubcategory: 'wedding-planner',
      },
      {
        slug: 'robe-mariee',
        name: 'Robe de mariée & Costume',
        description:
          'Boutiques de robes de mariée et costumes sur-mesure pour mariés et témoins.',
        dbCategory: 'mariage',
        dbSubcategory: 'robe-mariee',
      },
      {
        slug: 'fleuriste-mariage',
        name: 'Fleuriste mariage',
        description:
          "Fleuristes créateurs de bouquets de mariée, décorations florales et centres de table.",
        dbCategory: 'mariage',
        dbSubcategory: 'fleuriste-mariage',
      },
    ],
  },

  // ── 3. Immobilier & Construction ───────────────────────────────────────────
  {
    slug: 'immobilier-construction',
    name: 'Immobilier & Construction',
    icon: '🏗️',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    description:
      'Entrepreneurs, rénovation, toiture, plomberie, électricité et agences immobilières.',
    dbCategory: 'construction',
    subcategories: [
      {
        slug: 'renovation',
        name: 'Rénovation',
        description:
          'Rénovation résidentielle et commerciale : cuisine, salle de bain, intérieur.',
        dbCategory: 'construction',
        dbSubcategory: 'renovation',
      },
      {
        slug: 'toiture',
        name: 'Toiture',
        description:
          'Couvreurs et spécialistes de toiture, réparation et pose de couvertures.',
        dbCategory: 'construction',
        dbSubcategory: 'toiture',
      },
      {
        slug: 'plomberie',
        name: 'Plomberie',
        description:
          'Plombiers professionnels pour particuliers et entreprises, interventions urgentes.',
        dbCategory: 'construction',
        dbSubcategory: 'plomberie',
      },
      {
        slug: 'electricite',
        name: 'Électricité',
        description:
          'Électriciens certifiés pour installations, rénovations et dépannages électriques.',
        dbCategory: 'construction',
        dbSubcategory: 'electricite',
      },
    ],
  },

  // ── 4. Santé & Bien-être ──────────────────────────────────────────────────
  {
    slug: 'sante-bien-etre',
    name: 'Santé & Bien-être',
    icon: '🏥',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    description: 'Médecins, dentistes, pharmacies, kinésithérapie et services médicaux.',
    dbCategory: 'sante',
    subcategories: [
      {
        slug: 'medecine-generale',
        name: 'Médecine Générale',
        description: 'Médecins généralistes et spécialistes.',
        dbCategory: 'sante',
        dbSubcategory: 'medecine-generale',
      },
      {
        slug: 'dentiste',
        name: 'Dentiste',
        description: 'Cabinets dentaires et orthodontie.',
        dbCategory: 'sante',
        dbSubcategory: 'dentiste',
      },
      {
        slug: 'pharmacie',
        name: 'Pharmacie',
        description: 'Pharmacies de garde et parapharmacies.',
        dbCategory: 'sante',
        dbSubcategory: 'pharmacie',
      },
      {
        slug: 'kinesitherapie',
        name: 'Kinésithérapie',
        description: 'Kinés, physiothérapeutes et ostéopathes.',
        dbCategory: 'sante',
        dbSubcategory: 'kinesitherapie',
      },
    ],
  },

  // ── 5. Finance & Juridique ────────────────────────────────────────────────
  {
    slug: 'finance-juridique',
    name: 'Finance & Juridique',
    icon: '⚖️',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    description: 'Avocats, notaires, conseillers financiers, assurances et banques.',
    dbCategory: 'juridique',
    subcategories: [
      {
        slug: 'avocat',
        name: 'Avocat',
        description: "Cabinets d'avocats en droit civil, pénal, commercial et familial.",
        dbCategory: 'juridique',
        dbSubcategory: 'avocat',
      },
      {
        slug: 'notaire',
        name: 'Notaire',
        description: 'Études notariales pour actes immobiliers, successions et contrats.',
        dbCategory: 'juridique',
        dbSubcategory: 'notaire',
      },
      {
        slug: 'assurance',
        name: 'Assurance',
        description: 'Courtiers en assurance auto, habitation, santé et vie.',
        dbCategory: 'juridique',
        dbSubcategory: 'assurance',
      },
      {
        slug: 'conseil-financier',
        name: 'Conseil Financier',
        description: 'Conseillers en gestion de patrimoine et investissements.',
        dbCategory: 'juridique',
        dbSubcategory: 'conseil-financier',
      },
    ],
  },

  // ── 6. Énergie & Environnement ────────────────────────────────────────────
  {
    slug: 'energie-environnement',
    name: 'Énergie & Environnement',
    icon: '♻️',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    description: 'Panneaux solaires, isolation, pompes à chaleur et éco-solutions.',
    dbCategory: 'energie',
    subcategories: [
      {
        slug: 'panneaux-solaires',
        name: 'Panneaux Solaires',
        description: 'Installation et entretien de panneaux photovoltaïques.',
        dbCategory: 'energie',
        dbSubcategory: 'panneaux-solaires',
      },
      {
        slug: 'isolation',
        name: 'Isolation',
        description: "Isolation thermique, acoustique et économies d'énergie.",
        dbCategory: 'energie',
        dbSubcategory: 'isolation',
      },
      {
        slug: 'pompe-chaleur',
        name: 'Pompe à Chaleur',
        description: "Installation et entretien de pompes à chaleur air-eau.",
        dbCategory: 'energie',
        dbSubcategory: 'pompe-chaleur',
      },
      {
        slug: 'gestion-dechets',
        name: 'Gestion des Déchets',
        description: 'Collecte, tri et traitement des déchets professionnels.',
        dbCategory: 'energie',
        dbSubcategory: 'gestion-dechets',
      },
    ],
  },

  // ── 7. Services Professionnels ────────────────────────────────────────────
  {
    slug: 'services-professionnels',
    name: 'Services Professionnels',
    icon: '🛠️',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    description:
      'Nettoyage, sécurité, informatique, comptabilité et services aux entreprises.',
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

  // ── 8. Restauration & Alimentation ───────────────────────────────────────
  {
    slug: 'restauration-alimentation',
    name: 'Restauration & Alimentation',
    icon: '🍽️',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    description:
      'Restaurants, traiteurs, livraison de repas, boulangeries et épiceries.',
    dbCategory: 'restauration',
    subcategories: [
      {
        slug: 'restaurant',
        name: 'Restaurant',
        description: 'Restaurants, brasseries et cuisines du monde.',
        dbCategory: 'restauration',
        dbSubcategory: 'restaurant',
      },
      {
        slug: 'livraison-repas',
        name: 'Livraison de repas',
        description: 'Services de livraison à domicile et takeaway.',
        dbCategory: 'restauration',
        dbSubcategory: 'livraison-repas',
      },
      {
        slug: 'traiteur',
        name: 'Traiteur',
        description: 'Traiteurs pour mariages, événements et réceptions.',
        dbCategory: 'restauration',
        dbSubcategory: 'traiteur',
      },
      {
        slug: 'boulangerie',
        name: 'Boulangerie',
        description: 'Boulangeries artisanales et pâtisseries.',
        dbCategory: 'restauration',
        dbSubcategory: 'boulangerie',
      },
    ],
  },

  // ── 9. Beauté & Mode ──────────────────────────────────────────────────────
  {
    slug: 'beaute-mode',
    name: 'Beauté & Mode',
    icon: '💄',
    color: 'text-pink-700',
    bgColor: 'bg-pink-50',
    description: 'Coiffeurs, instituts de beauté, spa, massage et boutiques de mode.',
    dbCategory: 'beaute',
    subcategories: [
      {
        slug: 'coiffeur',
        name: 'Coiffeur',
        description: 'Salons de coiffure pour hommes et femmes.',
        dbCategory: 'beaute',
        dbSubcategory: 'coiffeur',
      },
      {
        slug: 'esthetique',
        name: 'Esthétique',
        description: 'Instituts de beauté, soins du visage et du corps.',
        dbCategory: 'beaute',
        dbSubcategory: 'esthetique',
      },
      {
        slug: 'spa',
        name: 'Spa & Massage',
        description: 'Centres de spa, massages et relaxation.',
        dbCategory: 'beaute',
        dbSubcategory: 'spa',
      },
      {
        slug: 'mode-vetements',
        name: 'Mode & Vêtements',
        description: 'Boutiques de mode, prêt-à-porter et accessoires.',
        dbCategory: 'beaute',
        dbSubcategory: 'mode-vetements',
      },
    ],
  },

  // ── 10. Informatique & Technologies ──────────────────────────────────────
  {
    slug: 'informatique-technologies',
    name: 'Informatique & Technologies',
    icon: '💻',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    description: 'Développement web, cybersécurité, cloud et agences digitales.',
    dbCategory: 'informatique',
    subcategories: [
      {
        slug: 'developpement-web',
        name: 'Développement Web',
        description: 'Développeurs, agences web et création de sites internet.',
        dbCategory: 'informatique',
        dbSubcategory: 'developpement-web',
      },
      {
        slug: 'cybersecurite',
        name: 'Cybersécurité',
        description: 'Experts en sécurité informatique et protection des données.',
        dbCategory: 'informatique',
        dbSubcategory: 'cybersecurite',
      },
      {
        slug: 'cloud-hosting',
        name: 'Cloud & Hébergement',
        description: 'Services cloud, hébergement web et infogérance.',
        dbCategory: 'informatique',
        dbSubcategory: 'cloud-hosting',
      },
      {
        slug: 'marketing-digital',
        name: 'Marketing Digital',
        description: 'Agences SEO, Google Ads, réseaux sociaux et e-mail marketing.',
        dbCategory: 'informatique',
        dbSubcategory: 'marketing-digital',
      },
    ],
  },

  // ── 11. Éducation & Formation ─────────────────────────────────────────────
  {
    slug: 'education-formation',
    name: 'Éducation & Formation',
    icon: '📚',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
    description:
      'Cours particuliers, langues, formations professionnelles et crèches.',
    dbCategory: 'education',
    subcategories: [
      {
        slug: 'cours-particuliers',
        name: 'Cours Particuliers',
        description: 'Soutien scolaire à domicile pour tous niveaux.',
        dbCategory: 'education',
        dbSubcategory: 'cours-particuliers',
      },
      {
        slug: 'langues',
        name: 'Cours de Langues',
        description: 'Écoles de langues : anglais, néerlandais, français, arabe...',
        dbCategory: 'education',
        dbSubcategory: 'langues',
      },
      {
        slug: 'formation-professionnelle',
        name: 'Formation Professionnelle',
        description: 'Centres de formation continue et reconversion professionnelle.',
        dbCategory: 'education',
        dbSubcategory: 'formation-professionnelle',
      },
      {
        slug: 'creche-garderie',
        name: 'Crèche & Garderie',
        description: "Structures d'accueil pour nourrissons et enfants.",
        dbCategory: 'education',
        dbSubcategory: 'creche-garderie',
      },
    ],
  },

  // ── 12. Sport & Loisirs ───────────────────────────────────────────────────
  {
    slug: 'sport-loisirs',
    name: 'Sport & Loisirs',
    icon: '⚽',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    description:
      'Salles de sport, clubs, piscines, tennis, football et activités sportives.',
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

  // ── 13. Événementiel & Culture ────────────────────────────────────────────
  {
    slug: 'evenementiel-culture',
    name: 'Événementiel & Culture',
    icon: '🎭',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    description:
      "Organisation d'événements, lieux de réception, photographes et artistes.",
    dbCategory: 'evenementiel',
    subcategories: [
      {
        slug: 'organisation-evenements',
        name: "Organisation d'Événements",
        description: 'Agences événementielles pour mariages, séminaires et galas.',
        dbCategory: 'evenementiel',
        dbSubcategory: 'organisation-evenements',
      },
      {
        slug: 'lieu-reception',
        name: 'Lieu de Réception',
        description:
          'Salles, châteaux et domaines pour événements privés et professionnels.',
        dbCategory: 'evenementiel',
        dbSubcategory: 'lieu-reception',
      },
      {
        slug: 'photographe',
        name: 'Photographe',
        description:
          'Photographes professionnels pour mariages, portraits et événements.',
        dbCategory: 'evenementiel',
        dbSubcategory: 'photographe',
      },
      {
        slug: 'dj-animation',
        name: 'DJ & Animation',
        description: 'DJs, animateurs et groupes musicaux pour soirées et réceptions.',
        dbCategory: 'evenementiel',
        dbSubcategory: 'dj-animation',
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

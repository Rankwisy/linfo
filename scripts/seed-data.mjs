import { readFileSync } from 'fs'
import { resolve } from 'path'

try {
  const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
  for (const line of lines) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    const key = t.slice(0, eq).trim()
    const val = t.slice(eq + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
} catch {}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function slug(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

const IMG = {
  taxi:                  'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80',
  autocar:               'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80',
  demenagement:          'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&auto=format&fit=crop&q=80',
  'transport-marchandises':'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
  gym:                   'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80',
  piscine:               'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&auto=format&fit=crop&q=80',
  tennis:                'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop&q=80',
  football:              'https://images.unsplash.com/photo-1551958219-acbc595c1e5d?w=800&auto=format&fit=crop&q=80',
  renovation:            'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
  toiture:               'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800&auto=format&fit=crop&q=80',
  electricite:           'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
  plomberie:             'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80',
  nettoyage:             'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
  securite:              'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80',
  informatique:          'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
  comptabilite:          'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80',
}

const CAT = {
  taxi: 'transport', autocar: 'transport', demenagement: 'transport', 'transport-marchandises': 'transport',
  gym: 'sport', piscine: 'sport', tennis: 'sport', football: 'sport',
  renovation: 'construction', toiture: 'construction', electricite: 'construction', plomberie: 'construction',
  nettoyage: 'services', securite: 'services', informatique: 'services', comptabilite: 'services',
}

// name, phone, address, rating, reviews, desc, shortDesc, tags
const DATA = {
  bruxelles: {
    taxi: [
      ['Taxitop Brussels','02 349 11 22','Rue Royale 80, 1000 Bruxelles',4.6,289,'Service de taxi rapide et fiable dans tout Bruxelles. Réservation en ligne ou par téléphone 24h/24.','Taxi rapide à Bruxelles, disponible 24h/24.',['taxi','bruxelles','vtc'],false],
      ['Capital Taxi BXL','02 513 44 55','Place du Congrès 5, 1000 Bruxelles',4.4,176,'Taxi haut de gamme pour particuliers et entreprises à Bruxelles. Chauffeurs professionnels.','Taxi premium pour particuliers et entreprises.',['taxi','premium','bruxelles'],true],
      ['Brussels VTC Service','02 640 77 88','Avenue Louise 300, 1050 Bruxelles',4.5,312,'VTC et taxi privé à Bruxelles. Transferts aéroport, gares et événements.','VTC et taxi privé, transferts aéroport.',['vtc','taxi','aéroport','bruxelles'],false],
      ['Taxi Centrale BXL','02 268 00 00','Boulevard du Midi 25, 1060 Bruxelles',4.2,198,'Centrale de taxi pour toute la région bruxelloise. Flotte de 150 véhicules disponibles.','Centrale de taxi, flotte de 150 véhicules.',['taxi','centrale','bruxelles'],false],
      ['EcoTaxi Brussels','02 502 12 34','Rue du Trône 40, 1050 Bruxelles',4.7,241,'Taxi écologique à Bruxelles : véhicules hybrides et électriques. Respect de l\'environnement.','Taxi écologique avec véhicules hybrides.',['taxi','écologique','hybride','bruxelles'],true],
    ],
    autocar: [
      ['BelBus Voyages','02 411 22 33','Rue de Birmingham 120, 1070 Bruxelles',4.5,143,'Location d\'autocars pour voyages scolaires, excursions et événements à Bruxelles et Europe.','Autocars pour voyages scolaires et excursions.',['autocar','voyage','scolaire','bruxelles'],false],
      ['Trans-Europe Coaches','02 522 33 44','Quai des Charbonnages 50, 1080 Bruxelles',4.6,98,'Service d\'autocar longue distance et transferts de groupes depuis Bruxelles vers l\'Europe.','Autocar longue distance vers l\'Europe.',['autocar','europe','groupe','bruxelles'],true],
      ['City Coach Brussels','02 345 67 89','Rue Gray 250, 1040 Bruxelles',4.3,77,'Location d\'autocars de 20 à 70 places à Bruxelles. Chauffeurs expérimentés et véhicules modernes.','Location autocars 20 à 70 places.',['autocar','location','groupe','bruxelles'],false],
      ['Atlas Voyages BXL','02 478 90 12','Chaussée de Louvain 400, 1030 Bruxelles',4.4,112,'Agence spécialisée dans les voyages en autocar depuis Bruxelles. Destinations belges et européennes.','Voyages en autocar, destinations belges et européennes.',['autocar','voyages','tourisme','bruxelles'],false],
      ['Flixbus Partner BXL','02 219 45 67','Gare du Nord, Rue du Progrès 86, 1030 Bruxelles',4.5,334,'Service d\'autocar longue distance au départ de la Gare du Nord. Nombreuses destinations.','Autocar longue distance depuis Gare du Nord.',['autocar','longue-distance','gare','bruxelles'],true],
    ],
    demenagement: [
      ['Déménage Express BXL','02 375 11 22','Rue de Stalle 60, 1180 Bruxelles',4.6,167,'Déménagement rapide et soigné à Bruxelles. Devis gratuit en 24h, assurance incluse.','Déménagement rapide, devis gratuit 24h.',['déménagement','bruxelles','express'],false],
      ['Pro Move Bruxelles','02 469 33 44','Avenue Molière 160, 1190 Bruxelles',4.7,203,'Spécialiste du déménagement résidentiel et d\'entreprise à Bruxelles. Service clé en main.','Déménagement résidentiel et entreprise.',['déménagement','résidentiel','entreprise','bruxelles'],true],
      ['Moving Masters BXL','02 534 55 66','Rue Vanderkindere 100, 1180 Bruxelles',4.5,134,'Déménageurs professionnels à Bruxelles. Emballage, transport et montage de meubles.','Déménageurs professionnels avec emballage.',['déménagement','emballage','meubles','bruxelles'],false],
      ['Bruxelles Déménage','02 217 77 88','Rue Gallait 80, 1030 Bruxelles',4.3,89,'Service de déménagement économique à Bruxelles. Tarifs compétitifs et équipe sérieuse.','Déménagement économique, tarifs compétitifs.',['déménagement','économique','bruxelles'],false],
      ['VIP Moving Bruxelles','02 647 99 00','Avenue Winston Churchill 80, 1180 Bruxelles',4.8,178,'Déménagement premium pour particuliers et entreprises. Service personnalisé et assurance all-risk.','Déménagement premium, assurance all-risk.',['déménagement','premium','assurance','bruxelles'],true],
    ],
    'transport-marchandises': [
      ['BXL Logistics','02 480 10 20','Rue de l\'Industrie 40, 1040 Bruxelles',4.5,112,'Transport de marchandises à Bruxelles et en Belgique. Livraisons express et régulières.','Transport marchandises, livraisons express.',['transport','logistique','marchandises','bruxelles'],false],
      ['Express Cargo Brussels','02 251 30 40','Boulevard du Souverain 200, 1160 Bruxelles',4.6,87,'Service de fret express depuis Bruxelles. Livraison J+1 garantie en Belgique et Europe.','Fret express, livraison J+1 garantie.',['cargo','express','fret','bruxelles'],true],
      ['BelTrans Marchandises','02 362 50 60','Rue de la Fusée 52, 1130 Bruxelles',4.3,64,'Transport de marchandises B2B à Bruxelles. Véhicules de 1 à 24 tonnes disponibles.','Transport B2B, véhicules 1 à 24 tonnes.',['transport','b2b','marchandises','bruxelles'],false],
      ['Last Mile Brussels','02 473 70 80','Rue du Midi 140, 1000 Bruxelles',4.7,156,'Service de livraison dernier kilomètre à Bruxelles. Spécialiste du e-commerce et retail.','Livraison dernier kilomètre, e-commerce.',['livraison','last-mile','e-commerce','bruxelles'],true],
      ['City Freight BXL','02 584 90 00','Chaussée de Wavre 800, 1040 Bruxelles',4.4,93,'Transport urbain de marchandises à Bruxelles. Camionnettes et camions disponibles à la demande.','Transport urbain, camionnettes à la demande.',['transport','urbain','camion','bruxelles'],false],
    ],
    gym: [
      ['Aspria Royal La Rasante','02 774 44 44','Avenue du Roi 157, 1190 Bruxelles',4.8,678,'Club de fitness haut de gamme avec piscine, spa et restaurant. Cadre exceptionnel à Bruxelles.','Club fitness premium avec piscine et spa.',['gym','spa','piscine','premium','bruxelles'],true],
      ['Urban Fit Brussels','02 345 12 34','Rue de la Loi 200, 1040 Bruxelles',4.6,421,'Salle de sport moderne au cœur de Bruxelles. Cours de yoga, HIIT, pilates et musculation.','Sport moderne, yoga, HIIT, pilates.',['gym','yoga','hiit','bruxelles'],false],
      ['Pulse Gym Ixelles','02 512 34 56','Rue de la Brasserie 60, 1050 Bruxelles',4.5,287,'Salle de sport boutique à Ixelles. Coaching personnalisé et petits groupes.','Gym boutique, coaching personnalisé.',['gym','coaching','ixelles','bruxelles'],false],
      ['Oxygen Fitness','02 646 78 90','Chaussée de Vleurgat 80, 1050 Bruxelles',4.4,312,'Centre de fitness complet avec cardio, musculation et cours collectifs. Ouvert 6h-23h.','Fitness complet, cardio et musculation.',['gym','cardio','musculation','bruxelles'],false],
      ['Iron Gym Brussels','02 218 56 78','Rue Antoine Dansaert 80, 1000 Bruxelles',4.7,389,'Salle de musculation spécialisée à Bruxelles. Équipements professionnels et coachs certifiés.','Musculation spécialisée, coachs certifiés.',['gym','musculation','powerlifting','bruxelles'],true],
    ],
    piscine: [
      ['Piscine Victor Boin','02 539 06 06','Rue de la Perche 38, 1060 Bruxelles',4.5,234,'Piscine olympique de Saint-Gilles avec bassins couverts et extérieurs. Cours pour tous niveaux.','Piscine olympique, bassins couverts et extérieurs.',['piscine','natation','bruxelles'],true],
      ['Centre Aquatique Woluwé','02 761 27 30','Avenue des Cailles 10, 1200 Bruxelles',4.6,312,'Centre aquatique moderne à Woluwé. Toboggan, bain à remous et cours de natation.','Centre aquatique avec toboggan et bain à remous.',['piscine','aquatique','bruxelles'],false],
      ['Neptunium Bruxelles','02 411 39 32','Avenue du Port 2A, 1080 Bruxelles',4.3,189,'Piscine publique à Molenbeek avec bassin de 25m et programme de cours hebdomadaires.','Piscine 25m, programme de cours hebdomadaires.',['piscine','natation','molenbeek','bruxelles'],false],
      ['Piscine Longchamp','02 771 84 04','Rue du Longchamp 145, 1200 Bruxelles',4.4,167,'Piscine communale de Woluwé-Saint-Lambert. Bassin adulte et pataugeoire pour enfants.','Piscine communale avec pataugeoire enfants.',['piscine','natation','bruxelles'],false],
      ['Aqualis Brussels','02 534 12 34','Rue de Stalle 180, 1180 Bruxelles',4.7,278,'Centre de bien-être aquatique à Uccle. Aquagym, aquabike et natation thérapeutique.',  'Bien-être aquatique, aquagym et aquabike.',['piscine','aquagym','bien-être','bruxelles'],true],
    ],
    tennis: [
      ['Royal Lawn Tennis Club','02 375 24 64','Drève de Rivieren 19, 1170 Bruxelles',4.8,156,'Club de tennis prestigieux à Bruxelles. 12 courts extérieurs et 4 couverts. Cours pour tous niveaux.','Club tennis 12 courts, cours tous niveaux.',['tennis','club','bruxelles'],true],
      ['Tennis Club Ixelles','02 649 23 45','Avenue Molière 60, 1180 Bruxelles',4.5,98,'Club de tennis familial à Ixelles. 6 courts en terre battue et 2 courts synthétiques.',  'Club tennis familial, courts terre battue.',['tennis','ixelles','bruxelles'],false],
      ['Padel & Tennis Brussels','02 344 56 78','Chaussée de Waterloo 700, 1180 Bruxelles',4.6,134,'Centre de tennis et padel à Bruxelles. 8 courts de tennis et 6 courts de padel couverts.','Tennis et padel, courts couverts.',['tennis','padel','bruxelles'],false],
      ['TC Saint-Gilles','02 537 89 01','Rue de la Victoire 40, 1060 Bruxelles',4.3,76,'Club de tennis accessible à Saint-Gilles. Cotisation annuelle abordable et ambiance conviviale.','Club tennis accessible, ambiance conviviale.',['tennis','saint-gilles','bruxelles'],false],
      ['Brussels Tennis Academy','02 218 12 23','Rue du Marché aux Poulets 10, 1000 Bruxelles',4.7,112,'Académie de tennis à Bruxelles. Cours individuels et collectifs pour enfants et adultes.','Académie tennis, cours enfants et adultes.',['tennis','académie','cours','bruxelles'],true],
    ],
    football: [
      ['Brussels Football Academy','02 478 34 56','Avenue du Laerbeek 2, 1090 Bruxelles',4.7,189,'Académie de football à Bruxelles. Formation des jeunes talents avec entraîneurs diplômés UEFA.','Académie football, formation jeunes talents.',['football','académie','bruxelles'],true],
      ['Sporting Club Anderlecht','02 521 45 67','Avenue Théo Verbeeck, 1070 Bruxelles',4.6,234,'Club de football amateur à Anderlecht. Sections jeunes et adultes, championnats provinciaux.','Football amateur, sections jeunes et adultes.',['football','club','anderlecht','bruxelles'],false],
      ['FC Bruxelles Centre','02 219 56 78','Rue de Laeken 80, 1000 Bruxelles',4.4,98,'Club de football au cœur de Bruxelles. Entraînements 3 fois par semaine, tournois réguliers.','Football, entraînements 3x/semaine.',['football','bruxelles','tournoi'],false],
      ['Brussels United FC','02 345 67 89','Rue du Dépôt 10, 1140 Bruxelles',4.5,145,'Club de football multiculturel à Bruxelles. Intégration et sport pour tous.','Football multiculturel, sport pour tous.',['football','bruxelles','multiculturel'],false],
      ['Terrain Synthétique Laeken','02 420 78 90','Allée du Stade 5, 1020 Bruxelles',4.3,167,'Location de terrains de football synthétiques à Laeken. Disponible tous les jours.','Terrains football synthétiques à louer.',['football','terrain','bruxelles'],false],
    ],
    renovation: [
      ['Rénov\'Pro Brussels','02 456 12 34','Rue du Progrès 30, 1030 Bruxelles',4.7,223,'Entreprise de rénovation complète à Bruxelles. Cuisines, salles de bain, toitures et façades.','Rénovation complète, cuisines et salles de bain.',['rénovation','bruxelles','maison'],true],
      ['BXL Rénovations','02 567 23 45','Rue Royale 150, 1000 Bruxelles',4.5,178,'Rénovation résidentielle et commerciale à Bruxelles. Devis gratuit et suivi personnalisé.','Rénovation résidentielle et commerciale.',['rénovation','commercial','bruxelles'],false],
      ['Home Restore Brussels','02 678 34 56','Chaussée de Charleroi 100, 1060 Bruxelles',4.6,156,'Spécialiste de la rénovation intérieure à Bruxelles. Design moderne et matériaux de qualité.','Rénovation intérieure, design moderne.',['rénovation','intérieur','design','bruxelles'],false],
      ['Artisans BXL','02 789 45 67','Rue des Palais 80, 1030 Bruxelles',4.4,134,'Artisans qualifiés pour tous vos travaux de rénovation à Bruxelles. Maçonnerie, peinture, carrelage.','Artisans qualifiés, maçonnerie et peinture.',['rénovation','artisan','bruxelles'],false],
      ['Espace Rénov Bruxelles','02 890 56 78','Avenue de la Couronne 200, 1050 Bruxelles',4.8,267,'Rénovation éco-responsable à Bruxelles. Isolation, fenêtres double vitrage et pompes à chaleur.','Rénovation éco-responsable, isolation.',['rénovation','éco','isolation','bruxelles'],true],
    ],
    toiture: [
      ['Toitures Laurent BXL','02 345 78 90','Rue de la Croix 40, 1050 Bruxelles',4.7,145,'Couvreur professionnel à Bruxelles. Réparation, entretien et pose de toitures toutes tuiles.','Couvreur professionnel, réparation toitures.',['toiture','couvreur','bruxelles'],true],
      ['ProToit Brussels','02 456 89 01','Avenue Brugmann 80, 1190 Bruxelles',4.5,112,'Spécialiste de la toiture à Bruxelles. Tuiles, ardoises, zinc et toitures plates.','Toitures tuiles, ardoises et zinc.',['toiture','ardoise','zinc','bruxelles'],false],
      ['BXL Couverture','02 567 90 12','Rue Vanderkindere 200, 1180 Bruxelles',4.6,98,'Entreprise de couverture à Bruxelles. Isolation de toiture et étanchéité garantie 10 ans.','Couverture et isolation toiture, garantie 10 ans.',['toiture','isolation','étanchéité','bruxelles'],false],
      ['Zinguerie Bruxelloise','02 678 01 23','Rue du Bailli 60, 1050 Bruxelles',4.4,87,'Zingueur et couvreur à Bruxelles. Gouttières, chéneaux et réparations toiture urgentes.','Zingueur, gouttières et réparations urgentes.',['toiture','gouttière','zingueur','bruxelles'],false],
      ['Toit & Co BXL','02 789 12 34','Boulevard Général Jacques 200, 1050 Bruxelles',4.8,134,'Renovation et pose de toitures à Bruxelles. Panneaux solaires et toitures vertes disponibles.','Toitures avec panneaux solaires et toitures vertes.',['toiture','solaire','vert','bruxelles'],true],
    ],
    electricite: [
      ['Électro Services BXL','02 456 23 45','Rue du Commerce 80, 1040 Bruxelles',4.7,267,'Électricien certifié à Bruxelles. Installations, dépannages et mises en conformité.','Électricien certifié, installations et dépannages.',['électricité','électricien','bruxelles'],true],
      ['Sparks Electric Brussels','02 567 34 56','Avenue de la Reine 80, 1030 Bruxelles',4.5,189,'Services électriques pour particuliers et entreprises à Bruxelles. Disponible 7j/7.','Services électriques, disponible 7j/7.',['électricité','dépannage','bruxelles'],false],
      ['BXL Électricité','02 678 45 67','Rue Gray 100, 1040 Bruxelles',4.6,156,'Installation électrique et domotique à Bruxelles. Tableaux électriques et prises connectées.','Électricité et domotique, prises connectées.',['électricité','domotique','bruxelles'],false],
      ['Current Pro Brussels','02 789 56 78','Chaussée de Forest 150, 1060 Bruxelles',4.4,112,'Électricien professionnel à Bruxelles. Mise aux normes et rénovation électrique complète.','Mise aux normes et rénovation électrique.',['électricité','normes','bruxelles'],false],
      ['GreenElec Brussels','02 890 67 89','Rue de la Luzerne 40, 1030 Bruxelles',4.8,178,'Installation de panneaux solaires et bornes de recharge VE à Bruxelles. Certifié Vesta.','Solaire et bornes recharge VE, certifié.',['électricité','solaire','borne','bruxelles'],true],
    ],
    plomberie: [
      ['Plomberie Rapide BXL','02 345 89 01','Rue du Congrès 20, 1000 Bruxelles',4.7,234,'Plombier d\'urgence à Bruxelles. Intervention en moins de 60 minutes, 24h/24 et 7j/7.','Plombier urgence, intervention 60 minutes.',['plomberie','urgence','bruxelles'],true],
      ['AquaPro Brussels','02 456 90 12','Avenue Hippocrate 90, 1200 Bruxelles',4.6,178,'Spécialiste en plomberie et chauffage à Bruxelles. Installation et entretien de chaudières.','Plomberie et chauffage, entretien chaudières.',['plomberie','chauffage','bruxelles'],false],
      ['BXL Plomberie','02 567 01 23','Rue Marie-Thérèse 80, 1000 Bruxelles',4.5,145,'Plombier certifié pour tous vos travaux à Bruxelles. Salles de bain, cuisine et canalisations.','Plombier certifié, salles de bain et cuisine.',['plomberie','salle-de-bain','bruxelles'],false],
      ['DrainTech Brussels','02 678 12 34','Boulevard du Midi 80, 1060 Bruxelles',4.4,112,'Débouchage et curage de canalisations à Bruxelles. Caméra d\'inspection incluse.','Débouchage canalisations, caméra inspection.',['plomberie','débouchage','bruxelles'],false],
      ['HydroPlomb BXL','02 789 23 45','Rue Defacqz 70, 1050 Bruxelles',4.8,189,'Plomberie sanitaire et chauffage central à Bruxelles. Pompe à chaleur et radiateurs.','Sanitaire et chauffage, pompe à chaleur.',['plomberie','chauffage','pompe-chaleur','bruxelles'],true],
    ],
    nettoyage: [
      ['CleanPro Brussels','02 456 34 56','Rue Neuve 100, 1000 Bruxelles',4.7,312,'Entreprise de nettoyage professionnel à Bruxelles. Bureaux, appartements et chantiers.','Nettoyage professionnel, bureaux et appartements.',['nettoyage','professionnel','bruxelles'],true],
      ['Sparkle Clean BXL','02 567 45 67','Avenue Louise 80, 1050 Bruxelles',4.6,234,'Service de nettoyage haut de gamme à Bruxelles. Produits écologiques et personnel formé.','Nettoyage premium, produits écologiques.',['nettoyage','écologique','bruxelles'],false],
      ['BXL Propreté','02 678 56 78','Chaussée de Waterloo 500, 1050 Bruxelles',4.5,198,'Nettoyage résidentiel et commercial à Bruxelles. Ménage régulier et nettoyage ponctuel.','Nettoyage résidentiel et commercial.',['nettoyage','ménage','bruxelles'],false],
      ['Office Clean Brussels','02 789 67 89','Boulevard du Régent 50, 1000 Bruxelles',4.4,156,'Nettoyage de bureaux et espaces professionnels à Bruxelles. Contrats journaliers ou hebdomadaires.','Nettoyage bureaux, contrats journaliers.',['nettoyage','bureaux','bruxelles'],false],
      ['EcoSweep BXL','02 890 78 90','Rue de la Paix 30, 1050 Bruxelles',4.8,267,'Nettoyage écologique à Bruxelles. 100% produits bio, certification ISO 14001.','Nettoyage écologique, certifié ISO 14001.',['nettoyage','bio','écologique','bruxelles'],true],
    ],
    securite: [
      ['SecurGroup Brussels','02 345 01 23','Avenue de la Toison d\'Or 60, 1060 Bruxelles',4.7,189,'Société de gardiennage et sécurité privée à Bruxelles. Agents certifiés 24h/24.','Gardiennage et sécurité, agents certifiés.',['sécurité','gardiennage','bruxelles'],true],
      ['Shield Security BXL','02 456 12 34','Rue des Colonies 50, 1000 Bruxelles',4.5,145,'Protection rapprochée et surveillance de sites à Bruxelles. Technologie CCTV avancée.','Protection rapprochée et surveillance CCTV.',['sécurité','cctv','bruxelles'],false],
      ['BXL Sécurité','02 567 23 45','Boulevard Adolphe Max 60, 1000 Bruxelles',4.6,167,'Systèmes d\'alarme et télésurveillance à Bruxelles. Installation et maintenance 24/7.','Alarmes et télésurveillance, maintenance 24/7.',['sécurité','alarme','bruxelles'],false],
      ['Sentinel Brussels','02 678 34 56','Place de l\'Albertine 2, 1000 Bruxelles',4.4,112,'Gardiennage événementiel et sécurité d\'accès à Bruxelles. Agents bilingues FR/NL.','Sécurité événementielle, agents bilingues.',['sécurité','événement','bruxelles'],false],
      ['SafeHome Brussels','02 789 45 67','Avenue des Arts 40, 1040 Bruxelles',4.8,234,'Installation de systèmes de sécurité résidentiels à Bruxelles. Caméras, détecteurs et smart home.','Sécurité résidentielle, caméras et smart home.',['sécurité','résidentiel','smart-home','bruxelles'],true],
    ],
    informatique: [
      ['IT Solutions Brussels','02 456 56 78','Rue de la Science 200, 1040 Bruxelles',4.7,267,'Support informatique pour PME à Bruxelles. Maintenance, cybersécurité et cloud.','Support IT PME, maintenance et cloud.',['informatique','it','support','bruxelles'],true],
      ['TechCare BXL','02 567 67 89','Avenue de la Joyeuse Entrée 1, 1040 Bruxelles',4.6,189,'Assistance informatique à domicile et en entreprise à Bruxelles. Dépannage rapide.','Assistance informatique, dépannage rapide.',['informatique','dépannage','bruxelles'],false],
      ['Brussels IT','02 678 78 90','Rue du Luxembourg 22, 1050 Bruxelles',4.5,156,'Services informatiques complets à Bruxelles. Réseaux, serveurs et cybersécurité.','Services IT, réseaux et cybersécurité.',['informatique','réseau','cybersécurité','bruxelles'],false],
      ['Pixel Pro BXL','02 789 89 01','Rue Archimède 80, 1000 Bruxelles',4.4,134,'Développement web et solutions numériques à Bruxelles. Sites, apps et e-commerce.','Développement web et e-commerce.',['informatique','web','développement','bruxelles'],false],
      ['CloudBXL','02 890 90 12','Rue Belliard 100, 1040 Bruxelles',4.8,212,'Solutions cloud et hébergement sécurisé à Bruxelles. Microsoft 365, Azure et Google Workspace.','Cloud et hébergement sécurisé, Microsoft 365.',['informatique','cloud','microsoft','bruxelles'],true],
    ],
    comptabilite: [
      ['Fidexco Brussels','02 345 12 34','Avenue Louise 500, 1050 Bruxelles',4.8,178,'Cabinet comptable agréé à Bruxelles. Comptabilité, fiscalité et conseil aux entreprises.','Cabinet comptable agréé, fiscalité et conseil.',['comptabilité','fiduciaire','bruxelles'],true],
      ['BXL Compta','02 456 23 45','Rue de la Loi 100, 1040 Bruxelles',4.6,145,'Expert-comptable à Bruxelles pour indépendants et PME. Bilan annuel et TVA.','Expert-comptable, bilan et TVA.',['comptabilité','indépendant','tva','bruxelles'],false],
      ['AccCo Brussels','02 567 34 56','Boulevard du Jardin Botanique 20, 1000 Bruxelles',4.5,112,'Cabinet d\'expertise comptable à Bruxelles. Audit, restructuration et gestion de patrimoine.','Expertise comptable, audit et patrimoine.',['comptabilité','audit','bruxelles'],false],
      ['TaxPro BXL','02 678 45 67','Rue du Trône 60, 1050 Bruxelles',4.7,167,'Conseiller fiscal et comptable à Bruxelles. Déclarations IPP, ISOC et optimisation fiscale.','Conseiller fiscal, optimisation fiscale.',['comptabilité','fiscal','bruxelles'],true],
      ['StartUp Compta BXL','02 789 56 78','Rue Tenbosch 10, 1050 Bruxelles',4.4,98,'Comptabilité pour startups et indépendants à Bruxelles. Tarifs adaptés et conseil stratégique.','Comptabilité startups, tarifs adaptés.',['comptabilité','startup','bruxelles'],false],
    ],
  },

  anvers: {
    taxi: [
      ['Diamond Taxi Antwerp','03 288 10 20','Koningin Astridplein 7, 2018 Antwerpen',4.6,312,'Service de taxi premium à Anvers. Transferts aéroport, gare et port. Disponible 24h/24.','Taxi premium, transferts aéroport et port.',['taxi','anvers','premium'],true],
      ['Port City Taxi','03 227 30 40','Rijnkaai 100, 2000 Antwerpen',4.5,234,'Taxi spécialisé dans les transferts portuaires à Anvers. Chauffeurs multilingues.','Taxi transferts portuaires, multilingue.',['taxi','port','anvers'],false],
      ['Anvers Cab Express','03 338 50 60','Meir 50, 2000 Antwerpen',4.4,198,'Taxi rapide dans tout Anvers. Application mobile et réservation en ligne.','Taxi rapide, réservation en ligne.',['taxi','anvers','app'],false],
      ['VTC Antwerp','03 449 70 80','Avenue de France 40, 2100 Antwerpen',4.7,267,'Service VTC et taxi haut de gamme à Anvers. Berlines et SUV disponibles.','VTC haut de gamme, berlines et SUV.',['taxi','vtc','anvers'],true],
      ['EcoTaxi Antwerp','03 550 90 00','Groenplaats 8, 2000 Antwerpen',4.3,145,'Taxi écologique à Anvers, véhicules électriques et hybrides. Tarifs transparents.','Taxi électrique et hybride, tarifs transparents.',['taxi','écologique','anvers'],false],
    ],
    autocar: [
      ['Antwerp Coach Services','03 211 22 33','Frankrijklei 80, 2000 Antwerpen',4.6,134,'Location d\'autocars à Anvers pour excursions, mariages et événements d\'entreprise.','Autocars pour excursions et événements.',['autocar','anvers','excursion'],true],
      ['Port City Coaches','03 322 33 44','Kattendijkdok 40, 2000 Antwerpen',4.5,98,'Transport de groupe depuis Anvers vers toute l\'Europe. Autocars modernes et climatisés.','Transport groupe vers l\'Europe.',['autocar','europe','anvers'],false],
      ['Diamond Bus Antwerp','03 433 44 55','Schoenmarkt 20, 2000 Antwerpen',4.4,76,'Autocar pour sorties scolaires et voyages culturels depuis Anvers. Chauffeurs bilingues.','Autocars scolaires, chauffeurs bilingues.',['autocar','scolaire','anvers'],false],
      ['Antwerp Express Tours','03 544 55 66','Nationalestraat 60, 2000 Antwerpen',4.7,112,'Tours guidés en autocar depuis Anvers. Découvrez la Belgique et les Pays-Bas.','Tours guidés, Belgique et Pays-Bas.',['autocar','tourisme','anvers'],true],
      ['Flandria Coach','03 655 66 77','Van Wesenbekestraat 20, 2000 Antwerpen',4.3,89,'Service d\'autocar régional depuis Anvers. Flotte de 20 véhicules de toutes tailles.','Autocar régional, flotte de 20 véhicules.',['autocar','régional','anvers'],false],
    ],
    demenagement: [
      ['Antwerp Movers','03 211 34 56','Turnhoutsebaan 200, 2100 Antwerpen',4.7,189,'Déménageurs professionnels à Anvers. Emballage, stockage et assurance tout risque.','Déménageurs avec emballage et stockage.',['déménagement','anvers','stockage'],true],
      ['Port City Moving','03 322 45 67','Havenstraat 60, 2000 Antwerpen',4.5,145,'Spécialiste du déménagement résidentiel et d\'entreprise à Anvers. Service clé en main.','Déménagement résidentiel et entreprise.',['déménagement','anvers'],false],
      ['Diamond Move','03 433 56 78','Amerikalei 80, 2000 Antwerpen',4.6,112,'Déménagement haut de gamme à Anvers. Véhicules adaptés, lifting et garde-meubles.','Déménagement haut de gamme avec lifting.',['déménagement','lifting','anvers'],false],
      ['Snel Verhuis Antwerpen','03 544 67 89','Grotesteenweg 300, 2600 Antwerpen',4.4,98,'Déménagement rapide et économique à Anvers. Équipe efficace, tarif horaire compétitif.','Déménagement rapide et économique.',['déménagement','économique','anvers'],false],
      ['Move & Go Antwerp','03 655 78 90','Lange Leemstraat 100, 2018 Antwerpen',4.8,167,'Service de déménagement premium à Anvers avec pianiste et monte-meuble intégré.','Déménagement premium, monte-meuble.',['déménagement','premium','anvers'],true],
    ],
    'transport-marchandises': [
      ['Antwerp Freight','03 211 90 01','Havenstraat 180, 2000 Antwerpen',4.6,134,'Transport de marchandises depuis le port d\'Anvers vers toute l\'Europe. Logistique B2B.','Transport depuis port d\'Anvers vers Europe.',['transport','marchandises','port','anvers'],true],
      ['Port Logistics ANT','03 322 01 12','Rijnkaai 150, 2000 Antwerpen',4.5,98,'Services logistiques au port d\'Anvers. Import/export et dédouanement.',    'Logistique portuaire, import/export.',['transport','logistique','anvers'],false],
      ['Diamond Cargo','03 433 12 23','Industrieweg 80, 2030 Antwerpen',4.4,76,'Transport de fret par route depuis Anvers. Camions frigorifiques disponibles.','Fret routier, camions frigorifiques.',['transport','fret','anvers'],false],
      ['Last Mile ANT','03 544 23 34','Dambruggestraat 60, 2060 Antwerpen',4.7,145,'Livraison dernier kilomètre à Anvers et région. Spécialiste e-commerce et retail.','Livraison last-mile, e-commerce.',['transport','last-mile','anvers'],true],
      ['Antwerp Express Cargo','03 655 34 45','Mechelsesteenweg 200, 2018 Antwerpen',4.3,87,'Transport express de marchandises à Anvers. Livraison J+1 garantie en Belgique.','Transport express J+1 garanti.',['transport','express','anvers'],false],
    ],
    gym: [
      ['Aspria Antwerp','03 233 44 55','Britselei 48, 2000 Antwerpen',4.8,456,'Club de fitness premium à Anvers avec piscine, spa et roof terrace.','Fitness premium avec piscine et spa.',['gym','spa','piscine','anvers'],true],
      ['Basic-Fit Antwerpen','03 322 55 66','Meir 78, 2000 Antwerpen',4.3,534,'Salle de sport accessible à Anvers. Plus de 200 appareils, tarif à partir de 19,99€/mois.','Gym accessible, 200 appareils, 19,99€/mois.',['gym','fitness','anvers'],false],
      ['CrossFit Antwerp','03 433 66 77','Provinciestraat 200, 2018 Antwerpen',4.7,287,'Box CrossFit à Anvers. WODs quotidiens, coaching certifié et communauté motivante.','CrossFit, coaching certifié et communauté.',['gym','crossfit','anvers'],false],
      ['FitClub Berchem','03 544 77 88','Driekoningenstraat 80, 2600 Antwerpen',4.5,198,'Salle de sport moderne à Berchem-Anvers. Yoga, HIIT et musculation.','Yoga, HIIT et musculation à Berchem.',['gym','yoga','anvers'],false],
      ['Gold\'s Gym Antwerp','03 655 88 99','Lange Leemstraat 200, 2018 Antwerpen',4.6,312,'Centre de musculation professionnel à Anvers. Équipements de compétition.','Musculation professionnel, compétition.',['gym','musculation','anvers'],true],
    ],
    piscine: [
      ['Wezenberg Antwerpen','03 213 48 00','Desguinlei 100, 2018 Antwerpen',4.6,289,'Complexe aquatique olympique à Anvers. Bassin 50m, plongeoir et aqua-fitness.','Complexe olympique, bassin 50m, plongeoir.',['piscine','natation','anvers'],true],
      ['Aquatopia Antwerp','03 324 59 11','Koningin Astridplein 26, 2018 Antwerpen',4.5,198,'Parc aquatique à Anvers avec toboggans, lazy river et bain à bulles.','Parc aquatique, toboggans et lazy river.',['piscine','aquatique','anvers'],false],
      ['Piscine Borgerhout','03 435 60 22','Gitschotellei 100, 2140 Antwerpen',4.3,145,'Piscine communale à Borgerhout. Bassin 25m et cours de natation pour tous.','Piscine 25m, cours natation tous niveaux.',['piscine','natation','anvers'],false],
      ['SwimClub ANT','03 546 71 33','Turnhoutsebaan 300, 2100 Antwerpen',4.7,167,'Club de natation compétitif à Anvers. Entraînements hebdomadaires et championnats.','Natation compétitive, championnats.',['piscine','compétition','anvers'],true],
      ['WellnessPool Antwerp','03 657 82 44','Statiestraat 60, 2600 Antwerpen',4.4,112,'Centre aquatique bien-être à Anvers. Hammam, sauna et bain à remous.','Bien-être aquatique, hammam et sauna.',['piscine','bien-être','anvers'],false],
    ],
    tennis: [
      ['Royal TC Antwerpen','03 218 34 56','Boterlaarbaan 150, 2100 Antwerpen',4.8,145,'Club de tennis royal à Anvers. 10 courts en terre battue, 4 couverts.','Tennis royal, courts terre battue et couverts.',['tennis','anvers'],true],
      ['Padel Antwerp','03 329 45 67','Jan van Rijswijcklaan 200, 2020 Antwerpen',4.6,112,'Centre de padel et tennis à Anvers. 6 courts padel et 4 courts tennis couverts.','Padel et tennis, courts couverts.',['tennis','padel','anvers'],false],
      ['TC Berchem','03 430 56 78','Driekoningenstraat 60, 2600 Antwerpen',4.5,89,'Club de tennis à Berchem-Anvers. Cours juniors et adultes, tournois annuels.','Tennis Berchem, cours juniors et adultes.',['tennis','anvers'],false],
      ['Squash & Tennis ANT','03 541 67 89','Italiëlei 40, 2000 Antwerpen',4.4,76,'Centre multisports à Anvers. Tennis, squash et badminton sous un même toit.','Tennis, squash et badminton.',['tennis','squash','anvers'],false],
      ['Antwerp Tennis Academy','03 652 78 90','Prins Boudewijnlaan 100, 2610 Antwerpen',4.7,134,'Académie de tennis à Anvers. Stages intensifs et cours privés avec pros.','Académie tennis, stages et cours privés.',['tennis','académie','anvers'],true],
    ],
    football: [
      ['FC Antwerp Academy','03 211 89 01','Bosuil, 2100 Antwerpen',4.8,267,'Académie de football d\'Anvers. Formation jeunes inspirée du FC Antwerp pro.','Académie football, formation jeunes.',['football','académie','anvers'],true],
      ['Beerschot Football','03 322 90 12','Olympiastadion, 2020 Antwerpen',4.6,198,'Club historique de football à Anvers. Sections adultes et jeunes, esprit club fort.','Football historique, sections adultes et jeunes.',['football','anvers'],false],
      ['FC Deurne','03 433 01 23','Eksterlaar 100, 2100 Antwerpen',4.4,134,'Club de football amateur à Deurne-Anvers. Ambiance familiale et bonne infrastructure.','Football amateur Deurne, ambiance familiale.',['football','anvers'],false],
      ['Voetbal Merksem','03 544 12 34','Bredabaan 200, 2170 Antwerpen',4.3,98,'Club de football à Merksem. Championnats provinciaux et entraînements réguliers.','Football Merksem, championnats provinciaux.',['football','anvers'],false],
      ['Sportpark ANT','03 655 23 45','Groenendaallaan 100, 2030 Antwerpen',4.5,145,'Location de terrains de football à Anvers. Synthétique et naturel disponibles.','Terrains football synthétique et naturel.',['football','terrain','anvers'],false],
    ],
    renovation: [
      ['Rénov Antwerp','03 211 34 56','Nationalestraat 100, 2000 Antwerpen',4.7,189,'Rénovation complète à Anvers. Cuisines, salles de bain et extensions.','Rénovation cuisines, salles de bain.',['rénovation','anvers'],true],
      ['ProBouw Antwerpen','03 322 45 67','Lange Gasthuisstraat 40, 2000 Antwerpen',4.5,145,'Construction et rénovation à Anvers. Entrepreneurs certifiés et devis gratuit.','Construction et rénovation certifiée.',['rénovation','construction','anvers'],false],
      ['Diamond Rénov ANT','03 433 56 78','Amerikalei 100, 2000 Antwerpen',4.6,112,'Rénovation intérieure haut de gamme à Anvers. Design sur mesure.','Rénovation intérieure design sur mesure.',['rénovation','design','anvers'],false],
      ['EcoRénov Antwerp','03 544 67 89','Provinciestraat 120, 2018 Antwerpen',4.8,167,'Rénovation éco-responsable à Anvers. Isolation, triple vitrage et énergies renouvelables.','Rénovation éco, isolation et renouvelable.',['rénovation','éco','anvers'],true],
      ['HomeStyle ANT','03 655 78 90','Mechelsesteenweg 150, 2018 Antwerpen',4.4,98,'Rénovation résidentielle à Anvers. Spécialiste des maisons anversoises typiques.','Rénovation maisons anversoises typiques.',['rénovation','anvers'],false],
    ],
    toiture: [
      ['Dak Expert Antwerp','03 211 90 01','Turnhoutsebaan 80, 2100 Antwerpen',4.7,134,'Couvreur professionnel à Anvers. Toitures en tuiles, ardoises et toitures plates.','Couvreur tuiles, ardoises et toitures plates.',['toiture','anvers'],true],
      ['ProDak ANT','03 322 01 12','Herentalsebaan 200, 2100 Antwerpen',4.5,98,'Réparation et entretien de toitures à Anvers. Inspection gratuite.','Réparation toiture, inspection gratuite.',['toiture','anvers'],false],
      ['Dakwerken Antwerpen','03 433 12 23','Grotesteenweg 100, 2600 Antwerpen',4.6,89,'Entreprise de couverture à Anvers. Zinguerie, gouttières et isolation toiture.','Couverture, zinguerie et isolation.',['toiture','zinguerie','anvers'],false],
      ['GreenRoof ANT','03 544 23 34','Amerikalei 60, 2000 Antwerpen',4.8,112,'Toitures vertes et panneaux solaires à Anvers. Spécialiste du développement durable.','Toitures vertes et panneaux solaires.',['toiture','solaire','anvers'],true],
      ['Ardoise Pro Anvers','03 655 34 45','Carnotstraat 80, 2060 Antwerpen',4.4,76,'Pose et rénovation de toitures en ardoise à Anvers. Matériaux naturels de qualité.','Toiture ardoise, matériaux naturels.',['toiture','ardoise','anvers'],false],
    ],
    electricite: [
      ['Electro Antwerp','03 211 45 56','Schoenmarkt 40, 2000 Antwerpen',4.7,223,'Électricien certifié à Anvers. Installations résidentielles et commerciales.','Électricien certifié résidentiel et commercial.',['électricité','anvers'],true],
      ['Spark Pro ANT','03 322 56 67','Meir 200, 2000 Antwerpen',4.5,167,'Dépannage électrique 24h/24 à Anvers. Intervention rapide garantie.','Dépannage électrique 24h/24.',['électricité','dépannage','anvers'],false],
      ['DomoticANT','03 433 67 78','Lange Gasthuisstraat 60, 2000 Antwerpen',4.6,145,'Domotique et électricité connectée à Anvers. Smart home et automatisation.','Domotique et smart home.',['électricité','domotique','anvers'],false],
      ['SolarElec Antwerp','03 544 78 89','Prins Boudewijnlaan 60, 2610 Antwerpen',4.8,189,'Installation de panneaux solaires et bornes de recharge à Anvers. Certifié.','Solaire et bornes recharge.',['électricité','solaire','anvers'],true],
      ['Current ANT','03 655 89 90','Italielei 100, 2000 Antwerpen',4.4,112,'Rénovation électrique complète à Anvers. Tableaux, câblage et prises.','Rénovation électrique, tableaux et câblage.',['électricité','anvers'],false],
    ],
    plomberie: [
      ['Loodgieter Antwerp','03 211 00 11','Havenstraat 40, 2000 Antwerpen',4.7,198,'Plombier d\'urgence à Anvers. Disponible 24h/24, intervention en 60 min.','Plombier urgence 24h/24.',['plomberie','anvers','urgence'],true],
      ['AquaPro ANT','03 322 11 22','Provinciestraat 80, 2018 Antwerpen',4.6,156,'Plomberie et chauffage à Anvers. Chaudières, pompes à chaleur et sanitaires.','Plomberie et chauffage, chaudières.',['plomberie','chauffage','anvers'],false],
      ['Drain Tech ANT','03 433 22 33','Lange Leemstraat 60, 2018 Antwerpen',4.5,123,'Débouchage de canalisations à Anvers. Caméra d\'inspection et hydrocurage.','Débouchage, caméra et hydrocurage.',['plomberie','débouchage','anvers'],false],
      ['SaniPro Antwerp','03 544 33 44','Turnhoutsebaan 120, 2100 Antwerpen',4.4,98,'Installation sanitaire à Anvers. Salle de bain clé en main et rénovation.','Sanitaire clé en main, salle de bain.',['plomberie','salle-de-bain','anvers'],false],
      ['HydroPlomb ANT','03 655 44 55','Amerikalei 120, 2000 Antwerpen',4.8,167,'Plomberie industrielle et résidentielle à Anvers. Travaux neufs et rénovation.','Plomberie industrielle et résidentielle.',['plomberie','anvers'],true],
    ],
    nettoyage: [
      ['Clean Pro Antwerp','03 211 55 66','Meir 120, 2000 Antwerpen',4.7,278,'Nettoyage professionnel à Anvers. Bureaux, résidences et après-travaux.','Nettoyage bureaux, résidences et travaux.',['nettoyage','anvers'],true],
      ['DiamondClean ANT','03 322 66 77','Nationalestraat 80, 2000 Antwerpen',4.6,212,'Nettoyage haut de gamme à Anvers. Produits premium et personnel qualifié.','Nettoyage haut de gamme, produits premium.',['nettoyage','anvers'],false],
      ['EcoPropre ANT','03 433 77 88','Provinciestraat 160, 2018 Antwerpen',4.5,167,'Nettoyage écologique à Anvers. 100% produits naturels et biodégradables.','Nettoyage écologique, produits naturels.',['nettoyage','écologique','anvers'],false],
      ['Office Schoon','03 544 88 99','Lange Gasthuisstraat 80, 2000 Antwerpen',4.4,134,'Nettoyage de bureaux à Anvers. Contrats hebdomadaires ou mensuels.','Nettoyage bureaux, contrats flexibles.',['nettoyage','bureaux','anvers'],false],
      ['AllClean Antwerp','03 655 99 00','Italielei 80, 2000 Antwerpen',4.8,189,'Service de nettoyage complet à Anvers. Vitres, moquettes et désinfection.','Nettoyage complet, vitres et désinfection.',['nettoyage','anvers'],true],
    ],
    securite: [
      ['SecurAnvers','03 211 11 22','Amerikalei 80, 2000 Antwerpen',4.7,167,'Gardiennage et sécurité privée à Anvers. Agents certifiés et rondes régulières.','Gardiennage certifié, rondes régulières.',['sécurité','anvers'],true],
      ['Port Security ANT','03 322 22 33','Rijnkaai 200, 2000 Antwerpen',4.5,134,'Sécurité portuaire à Anvers. Protection des sites industriels et logistiques.','Sécurité portuaire et industrielle.',['sécurité','port','anvers'],false],
      ['Shield ANT','03 433 33 44','Turnhoutsebaan 160, 2100 Antwerpen',4.6,112,'Systèmes d\'alarme et télésurveillance à Anvers. Installation et maintenance.','Alarmes et télésurveillance.',['sécurité','alarme','anvers'],false],
      ['Event Security ANT','03 544 44 55','Leopoldstraat 40, 2000 Antwerpen',4.4,89,'Sécurité événementielle à Anvers. Concerts, festivals et événements d\'entreprise.','Sécurité événements, festivals.',['sécurité','événement','anvers'],false],
      ['HomeGuard Antwerp','03 655 55 66','Statiestraat 40, 2600 Antwerpen',4.8,145,'Systèmes de sécurité résidentielle à Anvers. Caméras, alarmes et smart home.','Sécurité résidentielle smart home.',['sécurité','résidentiel','anvers'],true],
    ],
    informatique: [
      ['IT Antwerp','03 211 66 77','Lange Gasthuisstraat 100, 2000 Antwerpen',4.7,234,'Support informatique pour entreprises à Anvers. Réseau, serveurs et cloud.','Support IT entreprises, réseau et cloud.',['informatique','anvers'],true],
      ['TechSupport ANT','03 322 77 88','Meir 180, 2000 Antwerpen',4.5,178,'Assistance IT à domicile et bureau à Anvers. Dépannage rapide garanti.','Assistance IT à domicile et bureau.',['informatique','dépannage','anvers'],false],
      ['DigitalANT','03 433 88 99','Provinciestraat 200, 2018 Antwerpen',4.6,145,'Développement web et digital à Anvers. Sites, apps et solutions e-commerce.','Développement web et e-commerce.',['informatique','web','anvers'],false],
      ['CyberSec Antwerp','03 544 99 00','Prins Boudewijnlaan 80, 2610 Antwerpen',4.8,167,'Cybersécurité pour PME à Anvers. Audit, protection et formation.','Cybersécurité PME, audit et protection.',['informatique','cybersécurité','anvers'],true],
      ['CloudANT','03 655 00 11','Lange Leemstraat 180, 2018 Antwerpen',4.4,112,'Solutions cloud pour entreprises à Anvers. Azure, Google et AWS.','Cloud entreprises, Azure et Google.',['informatique','cloud','anvers'],false],
    ],
    comptabilite: [
      ['Fidex Antwerp','03 211 22 33','Amerikalei 40, 2000 Antwerpen',4.8,156,'Cabinet comptable agréé à Anvers. Comptabilité, TVA et conseils fiscaux.','Cabinet comptable agréé, TVA et fiscal.',['comptabilité','anvers'],true],
      ['BoekhoudANT','03 322 33 44','Nationalestraat 120, 2000 Antwerpen',4.6,123,'Expert-comptable à Anvers. Bilan annuel, TVA et déclarations fiscales.','Expert-comptable, bilan et TVA.',['comptabilité','anvers'],false],
      ['TaxConsult ANT','03 433 44 55','Schoenmarkt 60, 2000 Antwerpen',4.5,98,'Conseil fiscal et comptabilité à Anvers. Optimisation fiscale pour PME.','Conseil fiscal, optimisation PME.',['comptabilité','fiscal','anvers'],false],
      ['StartUp Boek ANT','03 544 55 66','Lange Gasthuisstraat 120, 2000 Antwerpen',4.7,134,'Comptabilité pour startups et indépendants à Anvers. Tarifs flexibles.','Comptabilité startups, tarifs flexibles.',['comptabilité','startup','anvers'],true],
      ['Audit Pro Antwerp','03 655 66 77','Italielei 120, 2000 Antwerpen',4.4,89,'Audit et contrôle comptable à Anvers. Conformité et reporting financier.','Audit et contrôle comptable.',['comptabilité','audit','anvers'],false],
    ],
  },

  gand: {
    taxi: [
      ['Taxi Gent City','09 221 10 20','Korenmarkt 1, 9000 Gent',4.6,234,'Taxi au cœur de Gand. Service rapide, application mobile et tarifs fixes aéroport.','Taxi Gand, tarifs fixes aéroport.',['taxi','gand'],true],
      ['Ghent Cab Express','09 332 30 40','Sint-Pietersnieuwstraat 80, 9000 Gent',4.5,178,'Taxi rapide à Gand, disponible 24h/24. Transferts gare et événements.',  'Taxi 24h/24, transferts gare et événements.',['taxi','gand'],false],
      ['VTC Gand','09 443 50 60','Veldstraat 60, 9000 Gent',4.7,267,'Service VTC premium à Gand. Berlines confortables et chauffeurs professionnels.','VTC premium, berlines confortables.',['taxi','vtc','gand'],true],
      ['EcoTaxi Gent','09 554 70 80','Coupure 80, 9000 Gent',4.4,145,'Taxi écologique à Gand. Véhicules hybrides, tarifs transparents.','Taxi écologique, véhicules hybrides.',['taxi','écologique','gand'],false],
      ['Portus Ganda Taxi','09 665 90 00','Jan Breydelstraat 20, 9000 Gent',4.3,98,'Taxi local à Gand. Connaissance parfaite de la ville et environs.','Taxi local, parfaite connaissance ville.',['taxi','gand'],false],
    ],
    autocar: [
      ['Gent Coach Services','09 221 22 33','Ottergemsesteenweg 100, 9000 Gent',4.6,112,'Location d\'autocars à Gand pour voyages scolaires et événements.','Autocars voyages scolaires et événements.',['autocar','gand'],true],
      ['Flamand Coach','09 332 33 44','Kortrijksesteenweg 200, 9000 Gent',4.5,89,'Transport de groupe depuis Gand vers Belgique et Europe.','Transport groupe Belgique et Europe.',['autocar','gand'],false],
      ['Gent Tour Bus','09 443 44 55','Burgstraat 40, 9000 Gent',4.4,76,'Tours en autocar de Gand et excursions culturelles en Flandre.','Tours Gand et excursions Flandre.',['autocar','tourisme','gand'],false],
      ['Portus Bus Gand','09 554 55 66','Dendermondsesteenweg 300, 9000 Gent',4.7,98,'Autocars modernes depuis Gand. Toutes tailles disponibles sur réservation.','Autocars modernes, toutes tailles.',['autocar','gand'],true],
      ['ExpresCar Gent','09 665 66 77','Brugsesteenweg 200, 9000 Gent',4.3,67,'Service d\'autocar régional depuis Gand. Flotte de 15 véhicules.','Autocar régional, 15 véhicules.',['autocar','gand'],false],
    ],
    demenagement: [
      ['Verhuis Gent','09 221 34 56','Wondelgemstraat 60, 9000 Gent',4.7,167,'Déménageurs professionnels à Gand. Emballage, transport et déballage inclus.','Déménageurs, emballage et déballage.',['déménagement','gand'],true],
      ['Move Gand','09 332 45 67','Gentsesteenweg 100, 9040 Gent',4.5,134,'Déménagement rapide à Gand. Équipe de 3-6 personnes, véhicules adaptés.','Déménagement rapide, équipe efficace.',['déménagement','gand'],false],
      ['GentMovers','09 443 56 78','Antwerpsesteenweg 200, 9040 Gent',4.6,112,'Déménagement résidentiel et entreprise à Gand. Devis gratuit en 24h.','Déménagement résidentiel, devis 24h.',['déménagement','gand'],false],
      ['QuickMove Gent','09 554 67 89','Korenmarkt 5, 9000 Gent',4.4,89,'Service de déménagement économique à Gand. Tarif horaire compétitif.','Déménagement économique, tarif horaire.',['déménagement','gand'],false],
      ['Premium Verhuis Gent','09 665 78 90','Voskenslaan 100, 9000 Gent',4.8,145,'Déménagement haut de gamme à Gand. Monte-meuble et assurance all-risk.','Déménagement premium, monte-meuble.',['déménagement','premium','gand'],true],
    ],
    'transport-marchandises': [
      ['Gent Freight','09 221 90 01','Dok Noord 4, 9000 Gent',4.5,98,'Transport de marchandises depuis Gand. Livraisons régionales et nationales.','Transport marchandises régional et national.',['transport','gand'],true],
      ['Port Cargo Gent','09 332 01 12','Handelsdok 100, 9000 Gent',4.4,76,'Fret et logistique depuis le port de Gand. Import et export.',    'Fret portuaire, import et export.',['transport','logistique','gand'],false],
      ['Last Mile Gent','09 443 12 23','Sint-Bernadettestraat 80, 9000 Gent',4.7,112,'Livraison dernier kilomètre à Gand. E-commerce et distribution locale.','Livraison last-mile, e-commerce.',['transport','last-mile','gand'],true],
      ['Gent Express Cargo','09 554 23 34','Brusselsesteenweg 200, 9090 Gent',4.3,67,'Transport express à Gand et région. Livraison J+1 garantie.','Transport express J+1.',['transport','express','gand'],false],
      ['FlexCargo Gent','09 665 34 45','Kortrijksesteenweg 300, 9000 Gent',4.4,89,'Transport flexible à Gand. Camionnettes et camions disponibles à la demande.','Transport flexible, camionnettes.',['transport','gand'],false],
    ],
    gym: [
      ['Basic-Fit Gent','09 223 44 55','Veldstraat 100, 9000 Gent',4.3,478,'Salle de sport accessible à Gand. 200+ appareils, 19,99€/mois.','Gym accessible, 200+ appareils.',['gym','gand'],false],
      ['FitFactory Gent','09 334 55 66','Korenmarkt 20, 9000 Gent',4.7,312,'Salle de sport premium à Gand. Yoga, HIIT et musculation avec coachs certifiés.','Gym premium, yoga et musculation.',['gym','yoga','gand'],true],
      ['CrossFit Gent','09 445 66 77','Coupure 60, 9000 Gent',4.8,198,'Box CrossFit à Gand. Coaching quotidien et programmation variée.','CrossFit, coaching quotidien.',['gym','crossfit','gand'],true],
      ['Sportivo Gent','09 556 77 88','Dendermondsesteenweg 150, 9000 Gent',4.5,234,'Centre fitness polyvalent à Gand. Cardio, muscu et cours collectifs.','Fitness polyvalent, cardio et muscu.',['gym','gand'],false],
      ['Ladies Gym Gent','09 667 88 99','Burgstraat 60, 9000 Gent',4.6,167,'Salle de sport féminine à Gand. Ambiance bienveillante et cours adaptés.','Gym féminin, ambiance bienveillante.',['gym','féminin','gand'],false],
    ],
    piscine: [
      ['Zwembad Rozebroeken','09 241 11 00','Rozebroekendreef 5, 9000 Gent',4.6,267,'Grande piscine couverte à Gand. Bassin olympique et toboggans.','Piscine olympique et toboggans.',['piscine','gand'],true],
      ['Aquamatic Gent','09 352 22 11','Zonnestraat 80, 9000 Gent',4.5,189,'Centre aquatique à Gand. Bain à remous, hammam et cours de natation.','Aquatique, hammam et natation.',['piscine','bien-être','gand'],false],
      ['Piscine Drongen','09 463 33 22','Drongen 100, 9031 Gent',4.4,134,'Piscine locale à Drongen. Ambiance familiale et tarifs abordables.','Piscine familiale, tarifs abordables.',['piscine','gand'],false],
      ['SwimAcademy Gent','09 574 44 33','Voskenslaan 60, 9000 Gent',4.7,145,'Académie de natation à Gand. Cours pour bébés, enfants et adultes.','Natation bébés, enfants et adultes.',['piscine','académie','gand'],true],
      ['AquaFit Gent','09 685 55 44','Korenmarkt 10, 9000 Gent',4.3,98,'Aquagym et fitness aquatique à Gand. Séances pour tous niveaux.','Aquagym et fitness aquatique.',['piscine','aquagym','gand'],false],
    ],
    tennis: [
      ['TC Gent City','09 221 56 78','Ottergemsesteenweg 200, 9000 Gent',4.7,123,'Club de tennis à Gand. 8 courts, cours juniors et adultes.','Tennis 8 courts, cours juniors et adultes.',['tennis','gand'],true],
      ['Padel Gent','09 332 67 89','Kortrijksesteenweg 400, 9000 Gent',4.6,98,'Centre padel et tennis à Gand. 4 courts padel couverts.','Padel et tennis, courts couverts.',['tennis','padel','gand'],false],
      ['TC Wondelgem','09 443 78 90','Wondelgemstraat 100, 9000 Gent',4.5,76,'Club de tennis de quartier à Gand. Ambiance conviviale et entraînements.','Tennis convivial, entraînements.',['tennis','gand'],false],
      ['Gent Tennis Academy','09 554 89 01','Burgstraat 80, 9000 Gent',4.8,112,'Académie de tennis à Gand. Cours intensifs et stages vacances.','Académie tennis, stages vacances.',['tennis','académie','gand'],true],
      ['Squash Gent','09 665 90 12','Coupure 40, 9000 Gent',4.4,89,'Squash et tennis à Gand. Courts disponibles à la réservation.','Squash et tennis, réservation facile.',['tennis','squash','gand'],false],
    ],
    football: [
      ['KAA Gent Academy','09 221 01 23','Ottergemsesteenweg 25, 9000 Gent',4.8,234,'Académie de football à Gand. Formation inspirée du club professionnel KAA Gent.','Académie football KAA Gent.',['football','académie','gand'],true],
      ['FC Drongen','09 332 12 34','Drongen 200, 9031 Gent',4.5,145,'Club de football local à Drongen. Championnats et entraînements hebdomadaires.','Football local, championnats.',['football','gand'],false],
      ['Voetbal Gent Zuid','09 443 23 45','Kortrijksesteenweg 500, 9000 Gent',4.4,112,'Club de football à Gand-Sud. Sections jeunes et adultes.','Football Gand-Sud, jeunes et adultes.',['football','gand'],false],
      ['Sportpark Gent','09 554 34 56','Voskenslaan 80, 9000 Gent',4.6,98,'Location terrains football synthétiques à Gand. Réservation en ligne.','Terrains football synthétiques.',['football','terrain','gand'],false],
      ['Gent United FC','09 665 45 67','Wondelgemstraat 150, 9000 Gent',4.3,76,'Club de football multiculturel à Gand. Intégration par le sport.','Football multiculturel, intégration.',['football','gand'],false],
    ],
    renovation: [
      ['RénovGent','09 221 56 78','Veldstraat 40, 9000 Gent',4.7,167,'Rénovation complète à Gand. Intérieur, façade et isolation.','Rénovation intérieur et façade.',['rénovation','gand'],true],
      ['ProBouw Gent','09 332 67 89','Kortrijksesteenweg 250, 9000 Gent',4.5,134,'Construction et rénovation à Gand. Entrepreneurs certifiés Qualibou.','Construction rénovation, certifié.',['rénovation','gand'],false],
      ['Gent Rénov','09 443 78 90','Coupure 100, 9000 Gent',4.6,112,'Rénovation intérieure à Gand. Cuisine, salle de bain et décoration.','Rénovation cuisine et salle de bain.',['rénovation','gand'],false],
      ['EcoRénov Gent','09 554 89 01','Burgstraat 100, 9000 Gent',4.8,145,'Rénovation éco-responsable à Gand. Isolation et énergies vertes.','Rénovation éco, isolation verte.',['rénovation','éco','gand'],true],
      ['Artisan Gent','09 665 90 12','Rozebroekendreef 80, 9000 Gent',4.4,89,'Artisans du bâtiment à Gand. Maçonnerie, peinture et carrelage.','Artisans, maçonnerie et peinture.',['rénovation','artisan','gand'],false],
    ],
    toiture: [
      ['Dak Gent','09 221 01 23','Wondelgemstraat 40, 9000 Gent',4.7,112,'Couvreur à Gand. Tuiles, ardoises et toitures plates avec garantie.','Couvreur tuiles et ardoises, garantie.',['toiture','gand'],true],
      ['ProDak Gent','09 332 12 34','Ottergemsesteenweg 300, 9000 Gent',4.5,89,'Réparation et entretien toiture à Gand. Inspection gratuite.','Réparation toiture, inspection gratuite.',['toiture','gand'],false],
      ['GreenDak Gent','09 443 23 45','Voskenslaan 120, 9000 Gent',4.8,98,'Toitures vertes et panneaux solaires à Gand.','Toitures vertes et solaire.',['toiture','solaire','gand'],true],
      ['Zink Gent','09 554 34 56','Kortrijksesteenweg 350, 9000 Gent',4.4,76,'Zingueur et couvreur à Gand. Gouttières et chéneaux.','Zingueur, gouttières et chéneaux.',['toiture','zinguerie','gand'],false],
      ['Dakrénov Gent','09 665 45 67','Burgstraat 120, 9000 Gent',4.6,87,'Rénovation toiture à Gand. Isolation et étanchéité.','Rénovation toiture, isolation.',['toiture','gand'],false],
    ],
    electricite: [
      ['Electro Gent','09 221 56 78','Korenmarkt 15, 9000 Gent',4.7,189,'Électricien certifié à Gand. Installations et dépannages 24h/24.','Électricien certifié, dépannage 24h.',['électricité','gand'],true],
      ['Spark Gent','09 332 67 89','Veldstraat 120, 9000 Gent',4.5,145,'Services électriques résidentiels et commerciaux à Gand.','Électricité résidentielle et commerciale.',['électricité','gand'],false],
      ['SolarGent','09 443 78 90','Coupure 120, 9000 Gent',4.8,167,'Panneaux solaires et domotique à Gand. Certifié.',  'Solaire et domotique, certifié.',['électricité','solaire','gand'],true],
      ['CurrentGent','09 554 89 01','Wondelgemstraat 80, 9000 Gent',4.4,112,'Rénovation électrique à Gand. Tableaux et câblage.','Rénovation électrique, tableaux.',['électricité','gand'],false],
      ['DomoticGent','09 665 90 12','Rozebroekendreef 60, 9000 Gent',4.6,134,'Domotique et maison connectée à Gand.','Domotique et maison connectée.',['électricité','domotique','gand'],false],
    ],
    plomberie: [
      ['Loodgieter Gent','09 221 01 23','Burgstraat 40, 9000 Gent',4.7,167,'Plombier d\'urgence à Gand. Intervention 60 minutes.',  'Plombier urgence 60 minutes.',['plomberie','gand'],true],
      ['AquaGent','09 332 12 34','Kortrijksesteenweg 450, 9000 Gent',4.5,134,'Plomberie et chauffage à Gand. Chaudières et sanitaires.','Plomberie et chauffage.',['plomberie','gand'],false],
      ['DrainGent','09 443 23 45','Ottergemsesteenweg 200, 9000 Gent',4.6,112,'Débouchage canalisations à Gand. Caméra inspection.','Débouchage, caméra inspection.',['plomberie','débouchage','gand'],false],
      ['SaniGent','09 554 34 56','Voskenslaan 140, 9000 Gent',4.4,89,'Salle de bain clé en main à Gand. Rénovation complète.','Salle de bain clé en main.',['plomberie','salle-de-bain','gand'],false],
      ['HydroGent','09 665 45 67','Wondelgemstraat 120, 9000 Gent',4.8,145,'Pompe à chaleur et chauffage central à Gand.','Pompe à chaleur et chauffage.',['plomberie','chauffage','gand'],true],
    ],
    nettoyage: [
      ['CleanGent','09 221 56 78','Veldstraat 80, 9000 Gent',4.7,245,'Nettoyage professionnel à Gand. Bureaux, résidences et chantiers.','Nettoyage professionnel Gand.',['nettoyage','gand'],true],
      ['EcoPropre Gent','09 332 67 89','Korenmarkt 25, 9000 Gent',4.6,189,'Nettoyage écologique à Gand. Produits naturels certifiés.','Nettoyage écologique, produits naturels.',['nettoyage','écologique','gand'],false],
      ['Office Clean Gent','09 443 78 90','Coupure 140, 9000 Gent',4.5,156,'Nettoyage bureaux à Gand. Contrats hebdomadaires ou mensuels.','Nettoyage bureaux, contrats flexibles.',['nettoyage','bureaux','gand'],false],
      ['Sparkle Gent','09 554 89 01','Burgstraat 140, 9000 Gent',4.4,123,'Service ménage à Gand. Ménage régulier et grand nettoyage.','Ménage régulier et grand nettoyage.',['nettoyage','gand'],false],
      ['AllClean Gent','09 665 90 12','Kortrijksesteenweg 500, 9000 Gent',4.8,167,'Nettoyage complet à Gand. Vitres, moquettes et désinfection.',  'Nettoyage complet, désinfection.',['nettoyage','gand'],true],
    ],
    securite: [
      ['SecurGent','09 221 01 23','Veldstraat 60, 9000 Gent',4.7,145,'Gardiennage et sécurité à Gand. Agents certifiés.','Gardiennage certifié.',['sécurité','gand'],true],
      ['Shield Gent','09 332 12 34','Korenmarkt 30, 9000 Gent',4.5,112,'Systèmes alarmes à Gand. Installation et maintenance.','Alarmes, installation et maintenance.',['sécurité','alarme','gand'],false],
      ['Event Sec Gent','09 443 23 45','Burgstraat 160, 9000 Gent',4.6,98,'Sécurité événementielle à Gand. Festivals et concerts.','Sécurité festivals et concerts.',['sécurité','événement','gand'],false],
      ['HomeGuard Gent','09 554 34 56','Coupure 160, 9000 Gent',4.8,123,'Sécurité résidentielle smart home à Gand.','Sécurité résidentielle smart home.',['sécurité','résidentiel','gand'],true],
      ['CCTV Gent','09 665 45 67','Wondelgemstraat 160, 9000 Gent',4.4,87,'Caméras de surveillance et télésurveillance à Gand.','Caméras et télésurveillance.',['sécurité','cctv','gand'],false],
    ],
    informatique: [
      ['IT Gent','09 221 56 78','Veldstraat 100, 9000 Gent',4.7,212,'Support informatique à Gand. Réseau, serveurs et cloud.','Support IT, réseau et cloud.',['informatique','gand'],true],
      ['TechGent','09 332 67 89','Korenmarkt 40, 9000 Gent',4.6,167,'Dépannage informatique à Gand. Intervention rapide.','Dépannage informatique rapide.',['informatique','gand'],false],
      ['WebGent','09 443 78 90','Coupure 180, 9000 Gent',4.5,134,'Développement web à Gand. Sites et applications.','Développement web et applications.',['informatique','web','gand'],false],
      ['CyberGent','09 554 89 01','Burgstraat 180, 9000 Gent',4.8,145,'Cybersécurité à Gand. Audit et protection.',  'Cybersécurité, audit et protection.',['informatique','cybersécurité','gand'],true],
      ['CloudGent','09 665 90 12','Kortrijksesteenweg 600, 9000 Gent',4.4,98,'Solutions cloud à Gand. Azure et Google.',  'Cloud Azure et Google.',['informatique','cloud','gand'],false],
    ],
    comptabilite: [
      ['Fidex Gent','09 221 01 23','Veldstraat 120, 9000 Gent',4.8,134,'Cabinet comptable agréé à Gand. Comptabilité et TVA.','Cabinet comptable, TVA.',['comptabilité','gand'],true],
      ['BoekhoudGent','09 332 12 34','Korenmarkt 50, 9000 Gent',4.6,112,'Expert-comptable à Gand. Bilan et déclarations.','Expert-comptable, bilan.',['comptabilité','gand'],false],
      ['TaxGent','09 443 23 45','Burgstraat 200, 9000 Gent',4.5,89,'Conseil fiscal à Gand. Optimisation pour PME.','Conseil fiscal, optimisation PME.',['comptabilité','gand'],false],
      ['StartUp Gent Compta','09 554 34 56','Coupure 200, 9000 Gent',4.7,98,'Comptabilité startups à Gand. Tarifs adaptés.','Comptabilité startups.',['comptabilité','startup','gand'],true],
      ['Audit Gent','09 665 45 67','Kortrijksesteenweg 700, 9000 Gent',4.4,76,'Audit comptable à Gand. Conformité et reporting.','Audit comptable, conformité.',['comptabilité','audit','gand'],false],
    ],
  },

  liege: {
    taxi: [
      ['Taxi Liège Express','04 222 10 20','Place Saint-Lambert 1, 4000 Liège',4.6,212,'Taxi rapide au centre de Liège. Disponible 24h/24 et 7j/7.','Taxi rapide Liège, 24h/24.',['taxi','liège'],true],
      ['Mosa Taxi','04 333 30 40','Rue Féronstrée 80, 4000 Liège',4.5,167,'Service de taxi à Liège. Transferts aéroport, gare et hôpitaux.','Taxi Liège, aéroport et hôpitaux.',['taxi','liège'],false],
      ['VTC Liège','04 444 50 60','Boulevard de la Sauvenière 100, 4000 Liège',4.7,189,'VTC premium à Liège. Berlines et monospaces disponibles.','VTC premium, berlines et monospaces.',['taxi','vtc','liège'],true],
      ['EcoTaxi Liège','04 555 70 80','Rue du Pont d\'Avroy 60, 4000 Liège',4.4,134,'Taxi écologique à Liège. Véhicules hybrides et électriques.','Taxi hybride et électrique.',['taxi','écologique','liège'],false],
      ['Prince Taxi Liège','04 666 90 00','Place de la République 5, 4000 Liège',4.3,98,'Taxi local à Liège. Service fiable et ponctuel.','Taxi fiable et ponctuel.',['taxi','liège'],false],
    ],
    autocar: [
      ['Liège Coach Services','04 222 22 33','Boulevard Frère-Orban 80, 4000 Liège',4.6,98,'Location d\'autocars à Liège pour groupes et événements.','Autocars groupes et événements.',['autocar','liège'],true],
      ['Mosa Bus','04 333 33 44','Rue de la Régence 40, 4000 Liège',4.5,76,'Transport de groupe depuis Liège vers la Belgique et l\'Europe.','Transport groupe vers Europe.',['autocar','liège'],false],
      ['Ardenne Coaches','04 444 44 55','Avenue Blonden 100, 4000 Liège',4.4,67,'Autocars pour excursions en Ardenne et au-delà. Depuis Liège.','Excursions Ardenne et Europe.',['autocar','ardenne','liège'],false],
      ['LiègeExpress Bus','04 555 55 66','Quai Saint-Léonard 80, 4000 Liège',4.7,89,'Service d\'autocar express depuis Liège. Toutes destinations.','Autocar express toutes destinations.',['autocar','liège'],true],
      ['WallonieBus','04 666 66 77','Rue Basse-Wez 120, 4000 Liège',4.3,56,'Autocar pour voyages scolaires et associatifs depuis Liège.','Autocars scolaires et associatifs.',['autocar','liège'],false],
    ],
    demenagement: [
      ['Déménage Liège','04 222 34 56','Rue Louvrex 80, 4000 Liège',4.7,145,'Déménageurs professionnels à Liège. Emballage et assurance inclus.','Déménageurs, emballage et assurance.',['déménagement','liège'],true],
      ['Mosa Moving','04 333 45 67','Boulevard de la Constitution 200, 4000 Liège',4.5,112,'Déménagement résidentiel à Liège. Service clé en main.','Déménagement résidentiel, clé en main.',['déménagement','liège'],false],
      ['Liège Déménage','04 444 56 78','Rue Saint-Gilles 60, 4000 Liège',4.6,98,'Déménagement rapide à Liège. Équipe efficace et véhicules adaptés.','Déménagement rapide, équipe efficace.',['déménagement','liège'],false],
      ['ArdenneMove','04 555 67 89','Rue du Plan Incliné 40, 4000 Liège',4.4,76,'Déménagement économique à Liège. Tarif horaire compétitif.','Déménagement économique.',['déménagement','liège'],false],
      ['VIP Move Liège','04 666 78 90','Avenue Maurice Destenay 40, 4000 Liège',4.8,134,'Déménagement premium à Liège. Monte-meuble et garde-meubles.','Déménagement premium, monte-meuble.',['déménagement','premium','liège'],true],
    ],
    'transport-marchandises': [
      ['Liège Freight','04 222 90 01','Quai des Ardennes 100, 4000 Liège',4.5,89,'Transport de marchandises depuis Liège. Livraisons régionales.','Transport marchandises, livraisons régionales.',['transport','liège'],true],
      ['Mosa Cargo','04 333 01 12','Rue de Campine 200, 4000 Liège',4.4,67,'Fret et logistique à Liège. Camionnettes et camions.','Fret et logistique, camions.',['transport','liège'],false],
      ['Ardenne Transport','04 444 12 23','Rue Basse-Wez 200, 4000 Liège',4.6,78,'Transport vers les Ardennes depuis Liège. Spécialiste régional.','Transport Ardennes, spécialiste.',['transport','ardenne','liège'],true],
      ['Last Mile Liège','04 555 23 34','Rue Louvrex 120, 4000 Liège',4.7,98,'Livraison dernier kilomètre à Liège. E-commerce.','Livraison last-mile e-commerce.',['transport','liège'],false],
      ['ExpressCargo Liège','04 666 34 45','Boulevard de la Sauvenière 200, 4000 Liège',4.3,56,'Transport express à Liège. J+1 garanti.','Transport express J+1.',['transport','liège'],false],
    ],
    gym: [
      ['Basic-Fit Liège','04 223 44 55','Rue Léopold 80, 4000 Liège',4.3,412,'Salle de sport à Liège. 200+ appareils, tarif accessible.','Gym 200+ appareils, tarif accessible.',['gym','liège'],false],
      ['Fitness Plus Liège','04 334 55 66','Place Saint-Lambert 10, 4000 Liège',4.7,267,'Centre de fitness premium à Liège. Yoga, HIIT et musculation.','Fitness premium, yoga et HIIT.',['gym','liège'],true],
      ['CrossFit Liège','04 445 66 77','Rue Basse-Wez 80, 4000 Liège',4.8,178,'Box CrossFit à Liège. Coaching et communauté motivante.','CrossFit, coaching communauté.',['gym','crossfit','liège'],true],
      ['Gym Mosa','04 556 77 88','Boulevard de la Constitution 100, 4000 Liège',4.5,189,'Salle de sport polyvalente à Liège. Cardio et muscu.','Gym polyvalente, cardio et muscu.',['gym','liège'],false],
      ['Ardenne Fitness','04 667 88 99','Avenue Blonden 60, 4000 Liège',4.6,145,'Centre fitness à Liège. Cours collectifs et coaching.',  'Fitness, cours collectifs et coaching.',['gym','liège'],false],
    ],
    piscine: [
      ['Piscine de Jonfosse','04 221 33 00','Rue de Jonfosse 40, 4000 Liège',4.6,234,'Grande piscine couverte à Liège. Bassin 25m et cours.','Piscine 25m et cours natation.',['piscine','liège'],true],
      ['Aquacentre Liège','04 332 44 11','Rue Saint-Gilles 100, 4000 Liège',4.5,178,'Centre aquatique à Liège. Toboggans et bain à bulles.','Aquatique, toboggans et bulles.',['piscine','liège'],false],
      ['Piscine Vesdre','04 443 55 22','Rue du Plan Incliné 80, 4000 Liège',4.4,134,'Piscine locale à Liège. Familles et loisirs.','Piscine familiale, loisirs.',['piscine','liège'],false],
      ['SwimAcademy Liège','04 554 66 33','Boulevard Frère-Orban 40, 4000 Liège',4.7,112,'Cours de natation à Liège. Bébés, enfants et adultes.','Natation, bébés, enfants, adultes.',['piscine','académie','liège'],true],
      ['WellnessPool Liège','04 665 77 44','Quai des Ardennes 60, 4000 Liège',4.3,89,'Bien-être aquatique à Liège. Hammam et sauna.','Bien-être, hammam et sauna.',['piscine','bien-être','liège'],false],
    ],
    tennis: [
      ['TC Liège','04 222 56 78','Avenue Maurice Destenay 80, 4000 Liège',4.7,112,'Club de tennis à Liège. Courts couverts et extérieurs.','Tennis, courts couverts et extérieurs.',['tennis','liège'],true],
      ['Padel Liège','04 333 67 89','Boulevard de la Sauvenière 300, 4000 Liège',4.6,89,'Centre padel et tennis à Liège. 4 courts padel.','Padel et tennis.',['tennis','padel','liège'],false],
      ['Mosa Tennis','04 444 78 90','Rue Louvrex 40, 4000 Liège',4.5,76,'Club tennis familial à Liège. Cours enfants et adultes.','Tennis familial, cours.',['tennis','liège'],false],
      ['TC Angleur','04 555 89 01','Route du Condroz 60, 4031 Liège',4.4,67,'Club de tennis à Angleur. Ambiance conviviale.','Tennis convivial Angleur.',['tennis','liège'],false],
      ['Liège Tennis Academy','04 666 90 12','Rue Basse-Wez 160, 4000 Liège',4.8,98,'Académie de tennis à Liège. Stages intensifs.','Académie tennis, stages.',['tennis','académie','liège'],true],
    ],
    football: [
      ['Standard Academy','04 222 01 23','Rue de la Centrale 2, 4000 Liège',4.8,212,'Académie de football inspirée du Standard de Liège. Formation jeunes.','Académie football Standard.',['football','académie','liège'],true],
      ['FC Liège Amateur','04 333 12 34','Quai des Ardennes 40, 4000 Liège',4.5,145,'Club de football amateur à Liège. Sections jeunes et seniors.','Football amateur, jeunes et seniors.',['football','liège'],false],
      ['Mosa Football','04 444 23 45','Boulevard de la Constitution 300, 4000 Liège',4.4,112,'Club de football à Liège. Championnats provinciaux.',  'Football, championnats provinciaux.',['football','liège'],false],
      ['Terrain Synthétique Liège','04 555 34 56','Rue Louvrex 60, 4000 Liège',4.6,98,'Location terrains football à Liège. Réservation en ligne.','Terrains football à louer.',['football','terrain','liège'],false],
      ['Ardenne FC','04 666 45 67','Avenue Blonden 80, 4000 Liège',4.3,76,'Club de football des Ardennes basé à Liège.','Football Ardennes, Liège.',['football','liège'],false],
    ],
    renovation: [
      ['RénovLiège','04 222 56 78','Rue Féronstrée 60, 4000 Liège',4.7,145,'Rénovation complète à Liège. Intérieur et façade.','Rénovation intérieur et façade.',['rénovation','liège'],true],
      ['Mosa Rénov','04 333 67 89','Boulevard Frère-Orban 60, 4000 Liège',4.5,112,'Construction et rénovation à Liège. Certifié.','Construction et rénovation.',['rénovation','liège'],false],
      ['Liège Rénov','04 444 78 90','Rue Saint-Gilles 80, 4000 Liège',4.6,98,'Rénovation intérieure à Liège. Cuisine et salle de bain.','Rénovation cuisine et salle de bain.',['rénovation','liège'],false],
      ['EcoRénov Liège','04 555 89 01','Quai des Ardennes 80, 4000 Liège',4.8,123,'Rénovation éco à Liège. Isolation et renouvelable.','Rénovation éco, isolation.',['rénovation','éco','liège'],true],
      ['Artisan Liège','04 666 90 12','Rue de la Régence 80, 4000 Liège',4.4,87,'Artisans bâtiment à Liège. Maçonnerie et peinture.','Artisans, maçonnerie et peinture.',['rénovation','liège'],false],
    ],
    toiture: [
      ['Toiture Liège','04 222 01 23','Boulevard de la Sauvenière 120, 4000 Liège',4.7,112,'Couvreur à Liège. Tuiles, ardoises et garantie.','Couvreur tuiles et ardoises.',['toiture','liège'],true],
      ['Dak Liège','04 333 12 34','Rue Louvrex 100, 4000 Liège',4.5,89,'Réparation toiture à Liège. Inspection gratuite.','Réparation toiture, inspection.',['toiture','liège'],false],
      ['GreenToit Liège','04 444 23 45','Avenue Maurice Destenay 60, 4000 Liège',4.8,98,'Toitures vertes et solaires à Liège.','Toitures vertes et solaires.',['toiture','solaire','liège'],true],
      ['Zink Liège','04 555 34 56','Quai Saint-Léonard 100, 4000 Liège',4.4,76,'Zingueur et gouttières à Liège.','Zingueur et gouttières.',['toiture','liège'],false],
      ['TechToit Liège','04 666 45 67','Rue de Campine 100, 4000 Liège',4.6,87,'Rénovation et isolation toiture à Liège.','Rénovation et isolation toiture.',['toiture','liège'],false],
    ],
    electricite: [
      ['Electro Liège','04 222 56 78','Rue Léopold 100, 4000 Liège',4.7,167,'Électricien certifié à Liège. Installations et dépannages.','Électricien certifié Liège.',['électricité','liège'],true],
      ['Spark Liège','04 333 67 89','Boulevard Frère-Orban 100, 4000 Liège',4.5,134,'Dépannage électrique 24h à Liège.','Dépannage électrique 24h.',['électricité','liège'],false],
      ['SolarLiège','04 444 78 90','Rue Saint-Gilles 120, 4000 Liège',4.8,145,'Panneaux solaires à Liège. Certifié.','Panneaux solaires, certifié.',['électricité','solaire','liège'],true],
      ['DomoticLiège','04 555 89 01','Avenue Blonden 120, 4000 Liège',4.4,112,'Domotique et smart home à Liège.','Domotique smart home.',['électricité','liège'],false],
      ['CurrentLiège','04 666 90 12','Quai des Ardennes 120, 4000 Liège',4.6,98,'Rénovation électrique à Liège.','Rénovation électrique.',['électricité','liège'],false],
    ],
    plomberie: [
      ['Plombier Liège','04 222 01 23','Rue Féronstrée 100, 4000 Liège',4.7,145,'Plombier urgence à Liège. 60 minutes.','Plombier urgence 60 min.',['plomberie','liège'],true],
      ['AquaLiège','04 333 12 34','Boulevard de la Constitution 400, 4000 Liège',4.5,112,'Plomberie et chauffage à Liège.','Plomberie et chauffage.',['plomberie','liège'],false],
      ['DrainLiège','04 444 23 45','Rue de la Régence 100, 4000 Liège',4.6,98,'Débouchage canalisations à Liège.','Débouchage canalisations.',['plomberie','liège'],false],
      ['SaniLiège','04 555 34 56','Quai Saint-Léonard 120, 4000 Liège',4.4,87,'Salle de bain clé en main à Liège.','Salle de bain clé en main.',['plomberie','liège'],false],
      ['HydroLiège','04 666 45 67','Rue Basse-Wez 140, 4000 Liège',4.8,123,'Pompe à chaleur et chauffage à Liège.','Pompe à chaleur et chauffage.',['plomberie','liège'],true],
    ],
    nettoyage: [
      ['CleanLiège','04 222 56 78','Place Saint-Lambert 20, 4000 Liège',4.7,212,'Nettoyage professionnel à Liège. Bureaux et résidences.','Nettoyage professionnel Liège.',['nettoyage','liège'],true],
      ['EcoPropre Liège','04 333 67 89','Rue Léopold 120, 4000 Liège',4.6,167,'Nettoyage écologique à Liège. Produits naturels.','Nettoyage écologique.',['nettoyage','liège'],false],
      ['Office Clean Liège','04 444 78 90','Boulevard Frère-Orban 120, 4000 Liège',4.5,134,'Nettoyage bureaux à Liège. Contrats flexibles.','Nettoyage bureaux flexibles.',['nettoyage','liège'],false],
      ['Sparkle Liège','04 555 89 01','Rue Saint-Gilles 160, 4000 Liège',4.4,112,'Ménage régulier à Liège. Personnel formé.','Ménage régulier, personnel formé.',['nettoyage','liège'],false],
      ['AllClean Liège','04 666 90 12','Quai des Ardennes 140, 4000 Liège',4.8,145,'Nettoyage complet à Liège. Vitres et désinfection.','Nettoyage complet, désinfection.',['nettoyage','liège'],true],
    ],
    securite: [
      ['SecurLiège','04 222 01 23','Rue Féronstrée 120, 4000 Liège',4.7,134,'Gardiennage à Liège. Agents certifiés.','Gardiennage, agents certifiés.',['sécurité','liège'],true],
      ['Shield Liège','04 333 12 34','Boulevard de la Sauvenière 400, 4000 Liège',4.5,112,'Alarmes et télésurveillance à Liège.','Alarmes et télésurveillance.',['sécurité','liège'],false],
      ['Event Sec Liège','04 444 23 45','Rue de la Régence 120, 4000 Liège',4.6,98,'Sécurité événementielle à Liège.','Sécurité événementielle.',['sécurité','liège'],false],
      ['HomeGuard Liège','04 555 34 56','Avenue Maurice Destenay 100, 4000 Liège',4.8,112,'Sécurité résidentielle smart home à Liège.','Sécurité smart home.',['sécurité','liège'],true],
      ['CCTV Liège','04 666 45 67','Quai Saint-Léonard 140, 4000 Liège',4.4,87,'Caméras surveillance à Liège.','Caméras et surveillance.',['sécurité','liège'],false],
    ],
    informatique: [
      ['IT Liège','04 222 56 78','Rue Léopold 140, 4000 Liège',4.7,189,'Support IT à Liège. Réseaux et cloud.','Support IT, réseaux et cloud.',['informatique','liège'],true],
      ['TechLiège','04 333 67 89','Place Saint-Lambert 30, 4000 Liège',4.6,145,'Dépannage informatique à Liège.','Dépannage informatique.',['informatique','liège'],false],
      ['WebLiège','04 444 78 90','Boulevard Frère-Orban 140, 4000 Liège',4.5,112,'Développement web à Liège.','Développement web.',['informatique','liège'],false],
      ['CyberLiège','04 555 89 01','Rue Saint-Gilles 200, 4000 Liège',4.8,134,'Cybersécurité à Liège.','Cybersécurité.',['informatique','liège'],true],
      ['CloudLiège','04 666 90 12','Quai des Ardennes 160, 4000 Liège',4.4,98,'Cloud pour entreprises à Liège.','Cloud entreprises.',['informatique','liège'],false],
    ],
    comptabilite: [
      ['Fidex Liège','04 222 01 23','Rue Féronstrée 140, 4000 Liège',4.8,123,'Cabinet comptable à Liège. Comptabilité et TVA.','Cabinet comptable, TVA.',['comptabilité','liège'],true],
      ['ComptaLiège','04 333 12 34','Boulevard de la Constitution 500, 4000 Liège',4.6,98,'Expert-comptable à Liège. Bilan et fiscal.','Expert-comptable, bilan.',['comptabilité','liège'],false],
      ['TaxLiège','04 444 23 45','Rue de la Régence 140, 4000 Liège',4.5,87,'Conseil fiscal à Liège. Optimisation PME.','Conseil fiscal PME.',['comptabilité','liège'],false],
      ['StartUp Compta Liège','04 555 34 56','Avenue Blonden 140, 4000 Liège',4.7,112,'Comptabilité startups à Liège.','Comptabilité startups.',['comptabilité','liège'],true],
      ['Audit Liège','04 666 45 67','Quai des Ardennes 180, 4000 Liège',4.4,76,'Audit comptable à Liège.','Audit comptable.',['comptabilité','liège'],false],
    ],
  },
}

async function upsert(rows) {
  const res = await fetch(`${URL}/rest/v1/businesses`, {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(rows),
  })
  if (!res.ok) console.error('Error:', await res.text())
  else process.stdout.write(`✓ ${rows.length} `)
}

async function main() {
  const rows = []
  let idx = 0

  for (const [city, cats] of Object.entries(DATA)) {
    for (const [sub, list] of Object.entries(cats)) {
      const cat = CAT[sub]
      const img = IMG[sub]
      for (const [name, phone, address, rating, reviews, desc, shortDesc, tags, featured] of list) {
        const s = `${slug(name)}-${city}`
        rows.push({
          object_id: `${city}-${sub}-${String(++idx).padStart(3,'0')}`,
          name, slug: s, category: cat, subcategory: sub, city,
          address, phone, email: null, website: null,
          description: desc, short_description: shortDesc,
          tags: [...tags], featured, rating, review_count: reviews,
          lat: null, lng: null, image_url: img,
        })
      }
    }
  }

  console.log(`\nInserting ${rows.length} businesses in batches...`)
  for (let i = 0; i < rows.length; i += 50) {
    await upsert(rows.slice(i, i + 50))
  }
  console.log('\n\nDone!')
}

main().catch(console.error)

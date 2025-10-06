import { Article, ProfessionalListing, User, AppSettings, Category, GoogleReview, OpeningHours, SubscriptionPlan, BlogArticle, BlogCategory, BlogTag } from '../types';

export const categories: Category[] = [
  {
    id: 'restaurants',
    name: 'Restaurants & Cafés',
    icon: 'UtensilsCrossed',
    description: 'Restaurants, bars, cafés et brasseries',
    subCategories: [
      { id: 'restaurant-traditionnel', name: 'Restaurant traditionnel' },
      { id: 'pizzeria', name: 'Pizzeria' },
      { id: 'bar-cafe', name: 'Bar & Café' },
      { id: 'brasserie', name: 'Brasserie' },
      { id: 'restaurant-gastronomique', name: 'Restaurant gastronomique' },
      { id: 'fast-food', name: 'Fast-food' }
    ]
  },
  {
    id: 'sante-beaute',
    name: 'Santé & Beauté',
    icon: 'Heart',
    description: 'Professionnels de la santé et de la beauté',
    subCategories: [
      { id: 'coiffeur', name: 'Coiffeur' },
      { id: 'estheticienne', name: 'Esthéticienne' },
      { id: 'medecin', name: 'Médecin' },
      { id: 'dentiste', name: 'Dentiste' },
      { id: 'pharmacie', name: 'Pharmacie' },
      { id: 'spa-massage', name: 'Spa & Massage' }
    ]
  },
  {
    id: 'artisanat-renovation',
    name: 'Artisanat & Rénovation',
    icon: 'Hammer',
    description: 'Artisans et professionnels du bâtiment',
    subCategories: [
      { id: 'plombier', name: 'Plombier' },
      { id: 'electricien', name: 'Électricien' },
      { id: 'menuisier', name: 'Menuisier' },
      { id: 'peintre', name: 'Peintre en bâtiment' },
      { id: 'maçon', name: 'Maçon' },
      { id: 'couvreur', name: 'Couvreur' }
    ]
  },
  {
    id: 'commerce-services',
    name: 'Commerce & Services',
    icon: 'ShoppingBag',
    description: 'Magasins et services du quotidien',
    subCategories: [
      { id: 'boulangerie', name: 'Boulangerie' },
      { id: 'boucherie', name: 'Boucherie' },
      { id: 'pressing', name: 'Pressing' },
      { id: 'garage-auto', name: 'Garage automobile' },
      { id: 'banque', name: 'Banque & Assurance' },
      { id: 'immobilier', name: 'Immobilier' }
    ]
  },
  {
    id: 'loisirs-culture',
    name: 'Loisirs & Culture',
    icon: 'Camera',
    description: 'Activités culturelles et de loisirs',
    subCategories: [
      { id: 'photographe', name: 'Photographe' },
      { id: 'musicien', name: 'Musicien & DJ' },
      { id: 'salle-sport', name: 'Salle de sport' },
      { id: 'cinema-theatre', name: 'Cinéma & Théâtre' },
      { id: 'musee', name: 'Musée' },
      { id: 'parc-loisirs', name: 'Parc de loisirs' }
    ]
  },
  {
    id: 'professional-services',
    name: 'Services Professionnels',
    icon: 'Briefcase',
    description: 'Services aux entreprises et particuliers',
    subCategories: [
      { id: 'avocat', name: 'Avocat' },
      { id: 'comptable', name: 'Comptable' },
      { id: 'notaire', name: 'Notaire' },
      { id: 'agence-web', name: 'Agence Web' },
      { id: 'consultant', name: 'Consultant' },
      { id: 'formation', name: 'Formation' }
    ]
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'jdelong24100@gmail.com',
    name: 'Jérémy Delong',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    phone: '05 53 XX XX XX',
    bio: 'Fondateur et administrateur d\'Annuaire Bergerac',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
    isEmailVerified: true,
    twoFactorEnabled: false,
    loginAttempts: 0
  },
  {
    id: '2',
    email: 'author@example.com',
    name: 'John Author',
    role: 'author',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    phone: '01 34 56 78 90',
    bio: 'Rédacteur spécialisé en marketing digital',
    createdAt: '2024-02-01T00:00:00Z',
    lastLoginAt: '2024-12-08T10:30:00Z',
    isEmailVerified: true,
    twoFactorEnabled: false,
    loginAttempts: 0
  },
  {
    id: '3',
    email: 'user@example.com',
    name: 'Jane User',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b2ad?w=100&h=100&fit=crop&crop=face',
    phone: '01 45 67 89 01',
    bio: 'Utilisatrice active de la plateforme',
    createdAt: '2024-03-01T00:00:00Z',
    lastLoginAt: '2024-12-07T15:45:00Z',
    isEmailVerified: true,
    twoFactorEnabled: false,
    loginAttempts: 0
  }
];

export const mockArticles: Article[] = [
  {
    id: '1',
    title: '5 Astuces SEO Simples pour Améliorer votre Visibilité',
    content: `
      <h2>Introduction au SEO</h2>
      <p>Le référencement naturel (SEO) est essentiel pour améliorer la visibilité de votre site web. Voici 5 astuces simples à mettre en place dès aujourd'hui.</p>
      
      <h3>1. Optimisez vos balises title</h3>
      <p>La balise title est l'un des éléments les plus importants pour le SEO. Elle doit être unique, descriptive et contenir vos mots-clés principaux.</p>
      
      <h3>2. Créez du contenu de qualité</h3>
      <p>Google privilégie les contenus qui apportent de la valeur aux utilisateurs. Rédigez des articles informatifs et utiles pour votre audience.</p>
      
      <h3>3. Utilisez les balises meta description</h3>
      <p>Bien qu'elles n'influencent pas directement le classement, les meta descriptions incitent les utilisateurs à cliquer sur votre lien.</p>
      
      <h3>4. Optimisez la vitesse de chargement</h3>
      <p>Un site rapide améliore l'expérience utilisateur et est favorisé par les moteurs de recherche.</p>
      
      <h3>5. Construisez des liens internes</h3>
      <p>Les liens internes aident Google à comprendre la structure de votre site et distribuent l'autorité entre vos pages.</p>
    `,
    excerpt: 'Découvrez 5 techniques SEO efficaces et faciles à implémenter pour booster la visibilité de votre site web.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    tags: ['SEO', 'Marketing Digital', 'Web'],
    seoTitle: '5 Astuces SEO Simples - Guide Complet 2024',
    seoDescription: 'Améliorez votre référencement avec ces 5 astuces SEO simples et efficaces. Guide pratique pour débutants.',
    authorId: '2',
    authorName: 'John Author',
    publishedAt: '2024-12-15T10:00:00Z',
    views: 1250,
    likes: 45
  },
  {
    id: '2',
    title: 'Comment Créer une Fiche Google My Business Efficace',
    content: `
      <h2>L'importance de Google My Business</h2>
      <p>Google My Business est un outil gratuit et essentiel pour toute entreprise locale. Il améliore votre visibilité dans les recherches locales.</p>
      
      <h3>Étape 1: Créer votre profil</h3>
      <p>Rendez-vous sur Google My Business et créez votre compte en suivant les instructions.</p>
      
      <h3>Étape 2: Compléter toutes les informations</h3>
      <p>Renseignez vos horaires, coordonnées, catégorie d'activité et description de votre entreprise.</p>
      
      <h3>Étape 3: Ajouter des photos</h3>
      <p>Les photos augmentent l'engagement. Ajoutez des images de votre établissement, produits et équipe.</p>
      
      <h3>Étape 4: Collecter les avis</h3>
      <p>Encouragez vos clients satisfaits à laisser des avis positifs sur votre fiche.</p>
    `,
    excerpt: 'Guide complet pour créer et optimiser votre fiche Google My Business et attirer plus de clients locaux.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
    tags: ['Google My Business', 'Référencement Local', 'Entreprise'],
    seoTitle: 'Google My Business - Guide Création 2024',
    seoDescription: 'Créez une fiche Google My Business efficace en 4 étapes simples. Augmentez votre visibilité locale.',
    authorId: '2',
    authorName: 'John Author',
    publishedAt: '2024-12-10T14:30:00Z',
    views: 890,
    likes: 32
  },
  {
    id: '3',
    title: '10 Erreurs à Éviter lors de la Création de votre Site Web',
    content: `
      <h2>Les pièges à éviter</h2>
      <p>La création d'un site web peut sembler simple, mais certaines erreurs peuvent nuire à votre succès en ligne.</p>
      
      <h3>1. Négliger le design responsive</h3>
      <p>Votre site doit s'adapter parfaitement aux mobiles et tablettes.</p>
      
      <h3>2. Ignorer l'optimisation des images</h3>
      <p>Des images trop lourdes ralentissent votre site et pénalisent l'expérience utilisateur.</p>
      
      <h3>3. Oublier les balises alt</h3>
      <p>Les balises alt améliorent l'accessibilité et le SEO de vos images.</p>
      
      <h3>4. Surcharger la page d'accueil</h3>
      <p>Une page d'accueil claire et épurée guide mieux vos visiteurs.</p>
      
      <h3>5. Négliger la sécurité</h3>
      <p>Installez un certificat SSL et maintenez votre site à jour.</p>
    `,
    excerpt: 'Évitez ces 10 erreurs courantes lors de la création de votre site web pour assurer son succès.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
    tags: ['Développement Web', 'UX/UI', 'Conseils'],
    seoTitle: '10 Erreurs Site Web à Éviter - Guide 2024',
    seoDescription: 'Découvrez les 10 erreurs les plus courantes à éviter lors de la création de votre site web.',
    authorId: '1',
    authorName: 'Admin User',
    publishedAt: '2024-12-08T09:15:00Z',
    views: 2150,
    likes: 67
  },
  {
    id: '4',
    title: 'Guide Complet du Marketing sur les Réseaux Sociaux',
    content: `
      <h2>Maîtriser les réseaux sociaux</h2>
      <p>Les réseaux sociaux sont devenus incontournables pour développer votre business en ligne.</p>
      
      <h3>Choisir les bonnes plateformes</h3>
      <p>Identifiez où se trouve votre audience cible : Facebook, Instagram, LinkedIn, TikTok...</p>
      
      <h3>Créer du contenu engageant</h3>
      <p>Variez les formats : posts, stories, vidéos, live, sondages pour maintenir l'intérêt.</p>
      
      <h3>Planifier votre contenu</h3>
      <p>Utilisez un calendrier éditorial pour maintenir une présence régulière et cohérente.</p>
      
      <h3>Analyser vos performances</h3>
      <p>Suivez vos métriques pour comprendre ce qui fonctionne et ajuster votre stratégie.</p>
    `,
    excerpt: 'Développez votre présence sur les réseaux sociaux avec ce guide complet du marketing digital.',
    image: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&h=400&fit=crop',
    tags: ['Réseaux Sociaux', 'Marketing Digital', 'Stratégie'],
    seoTitle: 'Marketing Réseaux Sociaux - Guide Complet 2024',
    seoDescription: 'Maîtrisez le marketing sur les réseaux sociaux avec notre guide complet et nos conseils d\'expert.',
    authorId: '2',
    authorName: 'John Author',
    publishedAt: '2024-12-05T16:45:00Z',
    views: 1680,
    likes: 89
  },
  {
    id: '5',
    title: 'E-commerce : 7 Conseils pour Augmenter vos Ventes',
    content: `
      <h2>Boostez vos ventes en ligne</h2>
      <p>L'e-commerce est compétitif. Voici 7 conseils pour vous démarquer et augmenter vos conversions.</p>
      
      <h3>1. Optimisez vos fiches produits</h3>
      <p>Des descriptions détaillées et des photos de qualité augmentent la confiance des acheteurs.</p>
      
      <h3>2. Simplifiez le processus d'achat</h3>
      <p>Réduisez le nombre d'étapes pour finaliser une commande.</p>
      
      <h3>3. Proposez plusieurs moyens de paiement</h3>
      <p>PayPal, cartes bancaires, virements... plus d'options = plus de ventes.</p>
      
      <h3>4. Rassurez vos clients</h3>
      <p>Affichez vos certifications, avis clients et politique de retour.</p>
      
      <h3>5. Optimisez pour mobile</h3>
      <p>Plus de 60% des achats se font sur mobile. Votre site doit être parfaitement adapté.</p>
    `,
    excerpt: '7 stratégies éprouvées pour augmenter les ventes de votre boutique en ligne et améliorer vos conversions.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
    tags: ['E-commerce', 'Ventes', 'Conversion'],
    seoTitle: 'E-commerce : 7 Conseils pour Augmenter vos Ventes 2024',
    seoDescription: 'Découvrez 7 stratégies efficaces pour booster les ventes de votre boutique en ligne.',
    authorId: '1',
    authorName: 'Admin User',
    publishedAt: '2024-12-01T11:20:00Z',
    views: 3250,
    likes: 124
  }
];

export const mockListings: ProfessionalListing[] = [
  {
    id: '1',
    title: 'Restaurant Le Périgord',
    description: 'Restaurant traditionnel au coeur de Bergerac proposant une cuisine authentique du Périgord. Spécialités de foie gras, confit de canard et truffes. Terrasse ombragée avec vue sur la Dordogne.',
    category: 'Restaurants & Cafés',
    subCategory: 'Restaurant traditionnel',
    authorId: '2',
    authorName: 'Jean Dupont',
    logo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1731501012938-b76580fd8514?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXJnZXJhYyUyMHJlc3RhdXJhbnQlMjB0cmFkaXRpb25hbCUyMGZyZW5jaHxlbnwxfHx8fDE3NTkzMzM5NTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    menuFile: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=800&fit=crop',
    contact: {
      phone: '05 53 57 12 34',
      email: 'contact@restaurant-perigord.fr',
      website: 'www.restaurant-perigord.fr',
      address: '15 Place Pélissière, 24100 Bergerac',
      googlePlaceId: 'ChIJxxxxx'
    },
    location: {
      lat: 44.8519,
      lng: 0.4815,
      city: 'Bergerac',
      zipCode: '24100'
    },
    gallery: [
      'https://images.unsplash.com/photo-1731501012938-b76580fd8514?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXJnZXJhYyUyMHJlc3RhdXJhbnQlMjB0cmFkaXRpb25hbCUyMGZyZW5jaHxlbnwxfHx8fDE3NTkzMzM5NTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop'
    ],
    googleReviews: [
      {
        id: 'g1',
        author_name: 'Marie Dubois',
        rating: 5,
        relative_time_description: 'il y a 2 semaines',
        text: 'Excellent restaurant ! La cuisine est authentique et les produits de qualité. Service impeccable et cadre charmant.',
        time: 1699545600,
        profile_photo_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b2ad?w=50&h=50&fit=crop'
      },
      {
        id: 'g2',
        author_name: 'Pierre Martin',
        rating: 4,
        relative_time_description: 'il y a 1 mois',
        text: 'Très bon restaurant traditionnel. Le foie gras est excellent et le service souriant.',
        time: 1697126400,
        profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop'
      }
    ],
    price: '€€€',
    openingHours: {
      monday: { isOpen: false },
      tuesday: { isOpen: true, openTime: '12:00', closeTime: '14:00', breakStart: '15:00', breakEnd: '19:00' },
      wednesday: { isOpen: true, openTime: '12:00', closeTime: '14:00', breakStart: '15:00', breakEnd: '19:00' },
      thursday: { isOpen: true, openTime: '12:00', closeTime: '14:00', breakStart: '15:00', breakEnd: '19:00' },
      friday: { isOpen: true, openTime: '12:00', closeTime: '14:00', breakStart: '15:00', breakEnd: '21:00' },
      saturday: { isOpen: true, openTime: '12:00', closeTime: '14:00', breakStart: '15:00', breakEnd: '21:00' },
      sunday: { isOpen: true, openTime: '12:00', closeTime: '14:00' }
    },
    highlights: ['Cuisine traditionnelle', 'Terrasse avec vue', 'Spécialités du Périgord'],
    isVerified: true,
    isApproved: true,
    subscriptionPlan: {
      id: 'monthly',
      name: 'Essentiel',
      type: 'monthly',
      price: 29.99,
      features: [],
      isFeatured: true
    },
    subscriptionExpiry: '2025-01-15T08:30:00Z',
    createdAt: '2024-11-15T08:30:00Z',
    updatedAt: '2024-12-01T10:15:00Z',
    views: 1250
  },
  {
    id: '2',
    title: 'Boulangerie des Vignes',
    description: 'Boulangerie artisanale familiale depuis 3 générations. Pain frais, viennoiseries, pâtisseries maison. Spécialité de pain aux noix du Périgord et cannelés bordelais.',
    category: 'Commerce & Services',
    subCategory: 'Boulangerie',
    authorId: '3',
    authorName: 'Marie Dubois',
    logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1617358586245-e5b5f07c13eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXJnZXJhYyUyMGJha2VyeSUyMGZyZW5jaCUyMGJvdWxhbmdlcmllfGVufDF8fHx8MTc1OTMzMzk2NXww&ixlib=rb-4.1.0&q=80&w=1080',
    contact: {
      phone: '05 53 63 45 67',
      email: 'contact@boulangerie-vignes.fr',
      address: '28 Rue Saint-James, 24100 Bergerac',
      googlePlaceId: 'ChIJyyyyy'
    },
    location: {
      lat: 44.8503,
      lng: 0.4825,
      city: 'Bergerac',
      zipCode: '24100'
    },
    gallery: [
      'https://images.unsplash.com/photo-1617358586245-e5b5f07c13eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXJnZXJhYyUyMGJha2VyeSUyMGZyZW5jaCUyMGJvdWxhbmdlcmllfGVufDF8fHx8MTc1OTMzMzk2NXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571167530149-c9b4fb137099?w=400&h=300&fit=crop'
    ],

    googleReviews: [
      {
        id: 'g3',
        author_name: 'Claude Moreau',
        rating: 5,
        relative_time_description: 'il y a 3 jours',
        text: 'La meilleure boulangerie de Bergerac ! Pain excellent et viennoiseries exceptionnelles.',
        time: 1699891200,
        profile_photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop'
      }
    ],
    price: '€',
    openingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '20:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '20:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '20:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '20:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '20:00' },
      saturday: { isOpen: true, openTime: '06:00', closeTime: '20:00' },
      sunday: { isOpen: true, openTime: '07:00', closeTime: '19:00' }
    },
    highlights: ['Pain artisanal', 'Tradition familiale', 'Spécialités locales'],
    isVerified: true,
    isApproved: true,
    subscriptionPlan: {
      id: 'weekly',
      name: 'Découverte',
      type: 'weekly',
      price: 9.99,
      features: [],
      isFeatured: false
    },
    subscriptionExpiry: '2024-12-17T14:15:00Z',
    createdAt: '2024-11-10T14:15:00Z',
    updatedAt: '2024-11-25T09:30:00Z',
    views: 890
  },
  {
    id: '3',
    title: 'Salon Élégance Coiffure',
    description: 'Salon de coiffure moderne au coeur de Bergerac. Coupes tendance, colorations végétales, soins capillaires bio. Équipe de professionnels diplômés dans une ambiance chaleureuse.',
    category: 'Santé & Beauté',
    subCategory: 'Coiffeur',
    authorId: '1',
    authorName: 'Sophie Martin',
    logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1650730199559-5198083df820?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwc2Fsb24lMjBiZXJnZXJhYyUyMGNvaWZmZXVyfGVufDF8fHx8MTc1OTMzMzk2OXww&ixlib=rb-4.1.0&q=80&w=1080',
    contact: {
      phone: '05 53 24 56 78',
      email: 'rdv@salon-elegance-bergerac.fr',
      website: 'www.salon-elegance-bergerac.fr',
      address: '42 Rue Neuve d\'Argenson, 24100 Bergerac',
      googlePlaceId: 'ChIJzzzzz'
    },
    location: {
      lat: 44.8528,
      lng: 0.4835,
      city: 'Bergerac',
      zipCode: '24100'
    },
    gallery: [
      'https://images.unsplash.com/photo-1650730199559-5198083df820?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwc2Fsb24lMjBiZXJnZXJhYyUyMGNvaWZmZXVyfGVufDF8fHx8MTc1OTMzMzk2OXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop'
    ],

    googleReviews: [
      {
        id: 'g4',
        author_name: 'Isabelle Durand',
        rating: 5,
        relative_time_description: 'il y a 1 semaine',
        text: 'Sophie est une excellente coiffeuse ! Très à l\'écoute et professionnelle. Je recommande vivement.',
        time: 1699372800,
        profile_photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop'
      }
    ],
    price: '€€',
    openingHours: {
      monday: { isOpen: false },
      tuesday: { isOpen: true, openTime: '09:00', closeTime: '19:00', breakStart: '12:00', breakEnd: '14:00' },
      wednesday: { isOpen: true, openTime: '09:00', closeTime: '19:00', breakStart: '12:00', breakEnd: '14:00' },
      thursday: { isOpen: true, openTime: '09:00', closeTime: '19:00', breakStart: '12:00', breakEnd: '14:00' },
      friday: { isOpen: true, openTime: '09:00', closeTime: '19:00', breakStart: '12:00', breakEnd: '14:00' },
      saturday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      sunday: { isOpen: false }
    },
    highlights: ['Coupes tendance', 'Produits bio', 'Service personnalisé'],
    isVerified: true,
    isApproved: true,
    subscriptionPlan: {
      id: 'monthly',
      name: 'Essentiel',
      type: 'monthly',
      price: 29.99,
      features: [],
      isFeatured: true
    },
    subscriptionExpiry: '2025-02-05T10:45:00Z',
    createdAt: '2024-11-05T10:45:00Z',
    updatedAt: '2024-11-20T15:20:00Z',
    views: 2150
  },
  {
    id: '4',
    title: 'Plomberie Dordogne Services',
    description: 'Plombier professionnel sur Bergerac et environs. Dépannage urgent 7j/7, installation sanitaire, chauffage. Devis gratuit et intervention rapide garantie.',
    category: 'Artisanat & Rénovation',
    subCategory: 'Plombier',
    authorId: '2',
    authorName: 'Michel Durand',
    logo: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1731943197763-91d043a78a20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb3Jkb2duZSUyMHdpbmUlMjByZWdpb24lMjBwbHVtYmVyJTIwZWxlY3RyaWNpYW58ZW58MXx8fHwxNzU5MzMzOTcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    contact: {
      phone: '05 53 73 84 95',
      email: 'contact@plomberie-dordogne.fr',
      website: 'www.plomberie-dordogne.fr',
      address: '12 Avenue Pasteur, 24100 Bergerac',
      googlePlaceId: 'ChIJaaaaa'
    },
    location: {
      lat: 44.8545,
      lng: 0.4795,
      city: 'Bergerac',
      zipCode: '24100'
    },
    gallery: [
      'https://images.unsplash.com/photo-1731943197763-91d043a78a20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb3Jkb2duZSUyMHdpbmUlMjByZWdpb24lMjBwbHVtYmVyJTIwZWxlY3RyaWNpYW58ZW58MXx8fHwxNzU5MzMzOTcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    ],

    googleReviews: [
      {
        id: 'g5',
        author_name: 'François Leroy',
        rating: 5,
        relative_time_description: 'il y a 5 jours',
        text: 'Intervention très rapide un dimanche pour une fuite. Michel est compétent et sympathique.',
        time: 1699718400,
        profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop'
      }
    ],
    price: '€€',
    openingHours: {
      monday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      tuesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      wednesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      thursday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      friday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
      sunday: { isOpen: false }
    },
    highlights: ['Dépannage 7j/7', 'Devis gratuit', 'Intervention rapide'],
    isVerified: true,
    isApproved: true,
    createdAt: '2024-10-28T16:20:00Z',
    updatedAt: '2024-11-15T11:10:00Z',
    views: 1680
  },
  {
    id: '5',
    title: 'Studio Photo Périgord',
    description: 'Photographe professionnel pour mariages, événements, portraits et reportages. Spécialisé dans la photographie de mariage en Dordogne. Studio moderne et déplacements dans toute la région.',
    category: 'Loisirs & Culture',
    subCategory: 'Photographe',
    authorId: '3',
    authorName: 'Julien Moreau',
    logo: 'https://images.unsplash.com/photo-1542038784456-1ea8e5b5f2f9?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1671726203394-491c8b574a0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXJnZXJhYyUyMHBob3RvZ3JhcGhlciUyMHN0dWRpb3xlbnwxfHx8fDE3NTkzMzM5NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    contact: {
      phone: '05 53 58 67 89',
      email: 'contact@studio-photo-perigord.fr',
      website: 'www.studio-photo-perigord.fr',
      address: '8 Cours Tourny, 24100 Bergerac',
      googlePlaceId: 'ChIJbbbbb'
    },
    location: {
      lat: 44.8512,
      lng: 0.4802,
      city: 'Bergerac',
      zipCode: '24100'
    },
    gallery: [
      'https://images.unsplash.com/photo-1671726203394-491c8b574a0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXJnZXJhYyUyMHBob3RvZ3JhcGhlciUyMHN0dWRpb3xlbnwxfHx8fDE3NTkzMzM5NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1554048612-b6a482b224b8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1542038784456-1ea8e5b5f2f9?w=400&h=300&fit=crop'
    ],

    googleReviews: [
      {
        id: 'g6',
        author_name: 'Émilie Rousseau',
        rating: 5,
        relative_time_description: 'il y a 2 semaines',
        text: 'Photographe exceptionnel ! Photos de mariage magnifiques, très professionnel et discret.',
        time: 1699545600,
        profile_photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop'
      }
    ],
    price: '€€€',
    openingHours: {
      monday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      tuesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      wednesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      thursday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      friday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      saturday: { isOpen: true, openTime: '10:00', closeTime: '17:00' },
      sunday: { isOpen: false }
    },
    highlights: ['Photographe professionnel', 'Déplacements région', 'Studio moderne'],
    isVerified: true,
    isApproved: true,
    subscriptionPlan: {
      id: 'yearly',
      name: 'Premium',
      type: 'yearly',
      price: 299.99,
      features: [],
      isFeatured: false
    },
    subscriptionExpiry: '2025-10-20T12:10:00Z',
    createdAt: '2024-10-20T12:10:00Z',
    updatedAt: '2024-12-01T14:30:00Z',
    views: 1890
  }
];



// Blog Categories & Tags
export const blogCategories: BlogCategory[] = [
  { id: '1', name: 'Tips & Conseils', slug: 'tips-conseils', color: 'bg-blue-100 text-blue-800' },
  { id: '2', name: 'Actualités Locales', slug: 'actualites-locales', color: 'bg-green-100 text-green-800' },
  { id: '3', name: 'Guide Entreprise', slug: 'guide-entreprise', color: 'bg-purple-100 text-purple-800' },
  { id: '4', name: 'Événements', slug: 'evenements', color: 'bg-orange-100 text-orange-800' },
  { id: '5', name: 'Innovation', slug: 'innovation', color: 'bg-indigo-100 text-indigo-800' }
];

export const blogTags: BlogTag[] = [
  { id: '1', name: 'SEO', slug: 'seo', color: 'bg-red-100 text-red-800' },
  { id: '2', name: 'Marketing', slug: 'marketing', color: 'bg-yellow-100 text-yellow-800' },
  { id: '3', name: 'Bergerac', slug: 'bergerac', color: 'bg-green-100 text-green-800' },
  { id: '4', name: 'Digital', slug: 'digital', color: 'bg-blue-100 text-blue-800' },
  { id: '5', name: 'Entrepreneur', slug: 'entrepreneur', color: 'bg-purple-100 text-purple-800' },
  { id: '6', name: 'Artisan', slug: 'artisan', color: 'bg-amber-100 text-amber-800' },
  { id: '7', name: 'Restaurant', slug: 'restaurant', color: 'bg-orange-100 text-orange-800' },
  { id: '8', name: 'Tourisme', slug: 'tourisme', color: 'bg-teal-100 text-teal-800' },
  { id: '9', name: 'Commerce', slug: 'commerce', color: 'bg-pink-100 text-pink-800' }
];

// Articles de démonstration enrichis pour le blog
export const mockBlogArticles: BlogArticle[] = [
  {
    id: '1',
    title: '5 conseils pour optimiser votre fiche Google My Business à Bergerac',
    content: `<h2>Pourquoi optimiser votre fiche Google My Business ?</h2>
    <p>À Bergerac comme partout ailleurs, votre visibilité en ligne commence par une fiche Google My Business bien optimisée. Cette fiche gratuite peut transformer votre entreprise locale en véritable aimant à clients.</p>
    
    <h3>1. Complétez toutes les informations</h3>
    <p>Ne laissez aucun champ vide ! Nom, adresse, téléphone, site web, horaires... Chaque information compte pour votre référencement local à Bergerac.</p>
    
    <h3>2. Ajoutez des photos de qualité</h3>
    <p>Les entreprises avec photos reçoivent 42% de demandes d'itinéraire en plus sur Google. Montrez votre établissement, vos produits, votre équipe.</p>
    
    <h3>3. Collectez des avis authentiques</h3>
    <p>Encouragez vos clients satisfaits à laisser un avis. Répondez toujours aux commentaires, qu'ils soient positifs ou négatifs.</p>
    
    <h3>4. Publiez régulièrement</h3>
    <p>Utilisez les posts Google My Business pour annoncer vos offres, événements, nouveautés. C'est gratuit et très efficace !</p>
    
    <h3>5. Analysez vos performances</h3>
    <p>Consultez vos statistiques : combien de personnes ont vu votre fiche, appelé, demandé un itinéraire ? Adaptez votre stratégie en conséquence.</p>`,
    excerpt: 'Découvrez comment optimiser votre présence locale sur Google pour attirer plus de clients à Bergerac et ses environs.',
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    categories: ['1', '3'], // Tips & Conseils + Guide Entreprise
    tags: ['1', '2', '3'], // SEO + Marketing + Bergerac
    metaDescription: 'Optimisez votre fiche Google My Business à Bergerac avec ces 5 conseils d\'experts. Attirez plus de clients locaux dès aujourd\'hui.',
    slug: '5-conseils-optimiser-google-my-business-bergerac',
    status: 'published',
    authorId: '1',
    authorName: 'Admin User',
    publishedAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-15T10:00:00Z',
    views: 1847,
    likes: 89
  },
  {
    id: '2',
    title: 'Les meilleurs restaurants de Bergerac selon notre communauté',
    content: `<h2>La gastronomie bergeracoise à l'honneur</h2>
    <p>Bergerac regorge de trésors culinaires ! Notre communauté a voté et voici le palmarès des restaurants incontournables de la ville.</p>
    
    <h3>🥇 Restaurant Le Périgord - Cuisine traditionnelle</h3>
    <p>Situé Place Pélissière, ce restaurant familial propose une cuisine authentique du Périgord. Leurs spécialités : foie gras maison, confit de canard aux cèpes, et leur fameux dessert aux noix du Périgord.</p>
    
    <h3>🥈 La Closerie des Vignes - Gastronomique</h3>
    <p>Une table gastronomique qui met à l'honneur les produits du terroir avec une présentation moderne. Parfait pour les occasions spéciales.</p>
    
    <h3>🥉 Le Bistrot du Marché - Bistronomie</h3>
    <p>Une cuisine créative dans une ambiance décontractée. Leur menu change selon les saisons et les arrivages du marché de Bergerac.</p>
    
    <h3>Mentions spéciales</h3>
    <ul>
    <li><strong>Pizza Marco</strong> - Les meilleures pizzas de Bergerac selon nos utilisateurs</li>
    <li><strong>Crêperie Bretonne</strong> - Authentiques galettes et crêpes bretonnes</li>
    <li><strong>L'Atelier du Burger</strong> - Burgers artisanaux avec produits locaux</li>
    </ul>`,
    excerpt: 'Notre communauté a élu les meilleurs restaurants de Bergerac. Découvrez où bien manger dans la ville aux mille saveurs.',
    featuredImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop',
    categories: ['2', '4'], // Actualités Locales + Événements
    tags: ['3', '7', '8'], // Bergerac + Restaurant + Tourisme
    metaDescription: 'Découvrez les meilleurs restaurants de Bergerac selon notre communauté. Guide gastronomique complet 2024.',
    slug: 'meilleurs-restaurants-bergerac-communaute',
    status: 'published',
    authorId: '1',
    authorName: 'Admin User',
    publishedAt: '2024-12-10T14:30:00Z',
    updatedAt: '2024-12-10T14:30:00Z',
    views: 2341,
    likes: 156
  },
  {
    id: '3',
    title: 'Comment bien choisir son artisan à Bergerac : le guide complet',
    content: `<h2>Trouvez l'artisan parfait pour vos travaux</h2>
    <p>Rénover, construire, réparer... À Bergerac et ses environs, de nombreux artisans qualifiés peuvent vous accompagner. Voici comment faire le bon choix.</p>
    
    <h3>1. Vérifiez les assurances et qualifications</h3>
    <p>Un bon artisan doit avoir :</p>
    <ul>
    <li>Une assurance décennale à jour</li>
    <li>Une assurance responsabilité civile professionnelle</li>
    <li>Les qualifications RGE si besoin (rénovation énergétique)</li>
    </ul>
    
    <h3>2. Demandez plusieurs devis</h3>
    <p>Comparez au minimum 3 devis pour le même projet. Attention aux prix anormalement bas qui cachent souvent des malfaçons.</p>
    
    <h3>3. Consultez les avis et réalisations</h3>
    <p>Sur notre annuaire, vous retrouvez les avis Google authentiques de chaque artisan. N'hésitez pas à demander à voir des réalisations récentes.</p>
    
    <h3>4. Privilégiez la proximité</h3>
    <p>Un artisan local connaît les spécificités de la région (climat, matériaux, réglementations). Il sera aussi plus facilement disponible pour un SAV.</p>`,
    excerpt: 'Guide pratique pour bien choisir votre artisan à Bergerac. Conseils d\'experts pour éviter les arnaques et trouver le bon professionnel.',
    featuredImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=400&fit=crop',
    categories: ['1', '3'], // Tips & Conseils + Guide Entreprise
    tags: ['3', '6'], // Bergerac + Artisan
    metaDescription: 'Choisir son artisan à Bergerac : conseils d\'experts, vérifications indispensables, devis, avis. Guide complet 2024.',
    slug: 'bien-choisir-artisan-bergerac-guide-complet',
    status: 'published',
    authorId: '1',
    authorName: 'Admin User',
    publishedAt: '2024-12-08T09:15:00Z',
    updatedAt: '2024-12-08T09:15:00Z',
    views: 1923,
    likes: 73
  },
  {
    id: '4',
    title: 'Événements à ne pas manquer à Bergerac cet automne',
    content: `<h2>L'automne bergeracois en fête !</h2>
    <p>L'automne à Bergerac, c'est la saison des vendanges, des marchés aux truffes et des festivités locales. Voici notre sélection d'événements incontournables.</p>
    
    <h3>🍇 Fête des Vendanges (Septembre)</h3>
    <p>Tous les ans, Bergerac célèbre ses vins avec animations, dégustations et marchés de producteurs locaux dans le centre historique.</p>
    
    <h3>🍄 Marché aux Truffes (Novembre-Février)</h3>
    <p>Chaque samedi matin place Gambetta, découvrez la truffe du Périgord directement auprès des producteurs locaux.</p>
    
    <h3>🎭 Festival de Théâtre Amateur (Octobre)</h3>
    <p>Une semaine dédiée au théâtre amateur avec des troupes de toute la région Nouvelle-Aquitaine.</p>
    
    <h3>📚 Salon du Livre Régional (Novembre)</h3>
    <p>Rencontrez des auteurs locaux et découvrez l'édition régionale au Palais des Congrès.</p>`,
    excerpt: 'Découvrez tous les événements culturels et gastronomiques de l\'automne à Bergerac. Programme complet des festivités locales.',
    featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    categories: ['2', '4'], // Actualités Locales + Événements
    tags: ['3', '8'], // Bergerac + Tourisme
    metaDescription: 'Événements automne 2024 à Bergerac : fête des vendanges, marché aux truffes, festival théâtre. Programme complet.',
    slug: 'evenements-bergerac-automne-2024',
    status: 'published',
    authorId: '1',
    authorName: 'Admin User',
    publishedAt: '2024-12-05T16:45:00Z',
    updatedAt: '2024-12-05T16:45:00Z',
    views: 1432,
    likes: 67
  },
  {
    id: '5',
    title: 'L\'innovation digitale arrive chez les commerçants bergeracois',
    content: `<h2>Bergerac se digitalise !</h2>
    <p>Les commerçants de Bergerac n'ont pas attendu pour prendre le virage digital. Entre click & collect, livraison à domicile et réseaux sociaux, découvrez comment nos entreprises locales innovent.</p>
    
    <h3>🛒 Click & Collect : la révolution du commerce local</h3>
    <p>De plus en plus de magasins bergeracois proposent la commande en ligne avec retrait en magasin. Pratique pour éviter l'attente et sûr de trouver le produit !</p>
    
    <h3>🚚 Livraison locale : nouveaux services</h3>
    <p>Plusieurs initiatives de livraison locale ont vu le jour, notamment pour les restaurants et l'épicerie fine.</p>
    
    <h3>📱 Réseaux sociaux : vitrine moderne</h3>
    <p>Instagram, Facebook, TikTok... Nos commerçants investissent les réseaux sociaux pour présenter leurs produits et créer du lien avec leur clientèle.</p>
    
    <h3>💳 Paiement sans contact généralisé</h3>
    <p>Cartes, smartphones, montres connectées... Tous les moyens de paiement modernes sont désormais acceptés dans la plupart des commerces.</p>`,
    excerpt: 'Comment les commerçants de Bergerac embrassent l\'innovation digitale. Click & collect, livraison, réseaux sociaux : état des lieux.',
    featuredImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
    categories: ['2', '5'], // Actualités Locales + Innovation
    tags: ['3', '4', '9'], // Bergerac + Digital + Commerce
    metaDescription: 'Innovation digitale chez les commerçants de Bergerac : click & collect, livraison locale, réseaux sociaux. Analyse 2024.',
    slug: 'innovation-digitale-commercants-bergerac',
    status: 'published',
    authorId: '1',
    authorName: 'Admin User',
    publishedAt: '2024-12-01T11:20:00Z',
    updatedAt: '2024-12-01T11:20:00Z',
    views: 987,
    likes: 45
  },
  {
    id: '6',
    title: 'Devenir entrepreneur à Bergerac : accompagnements et aides disponibles',
    content: `<h2>Bergerac, terre d'entrepreneuriat</h2>
    <p>Créer son entreprise à Bergerac, c'est bénéficier d'un écosystème favorable et d'aides nombreuses. Tour d'horizon des dispositifs d'accompagnement locaux.</p>
    
    <h3>🏛️ Les organismes d'accompagnement</h3>
    <ul>
    <li><strong>CCI Dordogne</strong> - Accompagnement complet de la création à la croissance</li>
    <li><strong>BGE Dordogne</strong> - Spécialiste de la micro-entreprise</li>
    <li><strong>Initiative Dordogne</strong> - Prêts d'honneur et parrainage</li>
    <li><strong>Pépinière d'entreprises</strong> - Hébergement et services mutualisés</li>
    </ul>
    
    <h3>💰 Les aides financières disponibles</h3>
    <p>Région, département, état... De nombreuses aides existent pour financer votre projet d'entreprise à Bergerac.</p>
    
    <h3>🤝 Le réseau des entrepreneurs locaux</h3>
    <p>Rejoignez les associations d'entrepreneurs bergeracois pour échanger, partager et développer votre réseau professionnel.</p>`,
    excerpt: 'Guide complet pour créer son entreprise à Bergerac : aides, accompagnements, démarches. Tous les conseils pour réussir.',
    featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    categories: ['1', '3'], // Tips & Conseils + Guide Entreprise
    tags: ['3', '5'], // Bergerac + Entrepreneur
    metaDescription: 'Créer son entreprise à Bergerac : guide des aides, accompagnements, démarches. Conseils d\'experts entrepreneurs 2024.',
    slug: 'devenir-entrepreneur-bergerac-guide-aides',
    status: 'draft',
    authorId: '1',
    authorName: 'Admin User',
    publishedAt: '',
    updatedAt: '2024-11-28T15:30:00Z',
    views: 0,
    likes: 0
  },
  {
    id: '7',
    title: 'Comment créer une bonne fiche professionnelle sur l\'annuaire ?',
    content: `<h2>Les clés d'une fiche professionnelle réussie</h2>
    <p>Votre fiche professionnelle est votre vitrine sur l'annuaire. Voici comment l'optimiser pour attirer plus de clients.</p>
    
    <h3>1. Choisissez un titre accrocheur</h3>
    <p>Votre titre doit être clair et contenir vos mots-clés principaux. Évitez les noms trop génériques comme "Entreprise de service". Préférez "Plombier chauffagiste à Bergerac - Dépannage 24h/24".</p>
    
    <h3>2. Rédigez une description complète</h3>
    <p>Décrivez précisément vos services, votre zone d'intervention, vos spécialités. Mentionnez vos certifications, votre expérience, ce qui vous différencie.</p>
    
    <h3>3. Ajoutez des photos de qualité</h3>
    <p>Les fiches avec photos reçoivent 3 fois plus de vues ! Montrez :</p>
    <ul>
    <li>Votre équipe au travail</li>
    <li>Vos réalisations</li>
    <li>Votre local ou vos véhicules</li>
    <li>Vos certifications</li>
    </ul>
    
    <h3>4. Complétez toutes les informations</h3>
    <p>Horaires, numéro de téléphone, adresse, site web... Plus votre fiche est complète, plus elle inspire confiance.</p>
    
    <h3>5. Utilisez les mots-clés locaux</h3>
    <p>Mentionnez Bergerac et les communes environnantes que vous desservez. Cela améliorera votre référencement local.</p>
    
    <h3>6. Mettez à jour régulièrement</h3>
    <p>Une fiche à jour montre que votre entreprise est active. Modifiez vos horaires pendant les vacances, ajoutez de nouvelles photos...</p>`,
    excerpt: 'Guide complet pour optimiser votre fiche professionnelle et attirer plus de clients grâce à notre annuaire.',
    featuredImage: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop',
    categories: ['1', '3'], // Tips & Conseils + Guide Entreprise
    tags: ['1', '2'], // SEO + Marketing
    metaDescription: 'Découvrez comment optimiser votre fiche professionnelle sur l\'annuaire Bergerac pour attirer plus de clients.',
    slug: 'comment-creer-bonne-fiche-professionnelle-annuaire',
    status: 'published',
    authorId: '1',
    authorName: 'Admin User',
    publishedAt: '2024-11-25T09:00:00Z',
    updatedAt: '2024-11-25T09:00:00Z',
    views: 1245,
    likes: 67
  },
  {
    id: '8',
    title: 'Optimiser sa visibilité locale : 10 conseils pour les entreprises de Bergerac',
    content: `<h2>Boostez votre visibilité locale en 10 étapes</h2>
    <p>En tant qu'entreprise bergeracoise, votre succès dépend de votre visibilité auprès des clients locaux. Voici 10 conseils pratiques.</p>
    
    <h3>1. Maîtrisez Google My Business</h3>
    <p>C'est LA base ! 80% des recherches locales passent par Google. Votre fiche GMB doit être parfaite :</p>
    <ul>
    <li>Informations complètes et exactes</li>
    <li>Photos professionnelles</li>
    <li>Réponses aux avis</li>
    <li>Posts réguliers</li>
    </ul>
    
    <h3>2. Collectez des avis clients</h3>
    <p>Les avis sont cruciaux pour le référencement local. Demandez systématiquement à vos clients satisfaits de laisser un avis.</p>
    
    <h3>3. Créez du contenu local</h3>
    <p>Blog, actualités, événements... Parlez de Bergerac, du Périgord, des événements locaux. Google adore le contenu géolocalisé !</p>
    
    <h3>4. Participez aux événements locaux</h3>
    <p>Marchés, foires, salons... Votre présence physique renforce votre ancrage local et génère du bouche-à-oreille.</p>
    
    <h3>5. Travaillez vos mots-clés locaux</h3>
    <p>Intégrez naturellement "Bergerac", "Dordogne", "Périgord" dans vos contenus. Pensez aussi aux communes voisines.</p>
    
    <h3>6. Partenariats locaux</h3>
    <p>Collaborez avec d'autres entreprises bergeracoises, l'office de tourisme, les associations locales.</p>
    
    <h3>7. Réseaux sociaux géolocalisés</h3>
    <p>Utilisez les hashtags locaux (#Bergerac #Dordogne), géolocalisez vos publications, montrez votre ancrage local.</p>
    
    <h3>8. Annuaires locaux</h3>
    <p>Inscrivez-vous sur tous les annuaires locaux : Annuaire-Bergerac.fr bien sûr, mais aussi Pages Jaunes, Yelp, etc.</p>
    
    <h3>9. Optimisez pour mobile</h3>
    <p>70% des recherches locales se font sur mobile. Votre site doit être parfaitement responsive et rapide.</p>
    
    <h3>10. Suivez vos performances</h3>
    <p>Google Analytics, Google Search Console, avis... Mesurez votre visibilité locale et ajustez votre stratégie.</p>
    
    <h3>Bonus : L'importance des NAP</h3>
    <p>Nom, Adresse, Téléphone : ces informations doivent être identiques partout sur le web. Toute incohérence nuit à votre référencement.</p>`,
    excerpt: '10 conseils pratiques pour booster la visibilité locale de votre entreprise bergeracoise et attirer plus de clients.',
    featuredImage: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=400&fit=crop',
    categories: ['1', '3'], // Tips & Conseils + Guide Entreprise
    tags: ['1', '2', '3'], // SEO + Marketing + Bergerac
    metaDescription: '10 conseils d\'experts pour optimiser la visibilité locale de votre entreprise à Bergerac et attirer plus de clients.',
    slug: 'optimiser-visibilite-locale-entreprises-bergerac',
    status: 'published',
    authorId: '1',
    authorName: 'Admin User',
    publishedAt: '2024-11-20T14:30:00Z',
    updatedAt: '2024-11-20T14:30:00Z',
    views: 1876,
    likes: 94
  },
  {
    id: '9',
    title: 'Les erreurs à éviter absolument sur votre fiche professionnelle',
    content: `<h2>Les 7 erreurs qui tuent votre visibilité</h2>
    <p>Certaines erreurs peuvent ruiner l'efficacité de votre fiche professionnelle. Voici comment les éviter.</p>
    
    <h3>❌ Erreur 1 : Informations incomplètes ou inexactes</h3>
    <p>Une adresse erronée, des horaires non mis à jour, un numéro qui ne répond pas... Ces erreurs font fuir les clients et nuisent à votre crédibilité.</p>
    <p><strong>Solution :</strong> Vérifiez régulièrement toutes vos informations et mettez-les à jour immédiatement en cas de changement.</p>
    
    <h3>❌ Erreur 2 : Photos de mauvaise qualité</h3>
    <p>Photos floues, mal cadrées, prises avec un smartphone dans de mauvaises conditions... Elles donnent une image amateur.</p>
    <p><strong>Solution :</strong> Investissez dans des photos professionnelles ou apprenez les bases de la photographie.</p>
    
    <h3>❌ Erreur 3 : Description trop courte ou générique</h3>
    <p>"Entreprise de qualité depuis 1990" ne dit rien de concret sur vos services.</p>
    <p><strong>Solution :</strong> Décrivez précisément vos services, spécialités, zone d'intervention, ce qui vous différencie.</p>
    
    <h3>❌ Erreur 4 : Ignorer les avis clients</h3>
    <p>Ne pas répondre aux avis, même positifs, donne l'impression que vous ne vous souciez pas de vos clients.</p>
    <p><strong>Solution :</strong> Répondez à TOUS les avis dans les 48h maximum. Remerciez pour les positifs, proposez des solutions pour les négatifs.</p>
    
    <h3>❌ Erreur 5 : Négliger les mots-clés</h3>
    <p>Ne pas mentionner votre localisation ou vos services principaux rend votre fiche invisible dans les recherches.</p>
    <p><strong>Solution :</strong> Intégrez naturellement vos mots-clés dans votre description (ville, services, spécialités).</p>
    
    <h3>❌ Erreur 6 : Fiche jamais mise à jour</h3>
    <p>Une fiche qui ne bouge jamais donne l'impression d'une entreprise inactive.</p>
    <p><strong>Solution :</strong> Ajoutez régulièrement de nouvelles photos, mettez à jour vos services, vos horaires saisonniers.</p>
    
    <h3>❌ Erreur 7 : Informations contradictoires</h3>
    <p>Des horaires différents selon les plateformes, des numéros de téléphone qui changent... Cela sème la confusion.</p>
    <p><strong>Solution :</strong> Harmonisez toutes vos informations sur tous vos supports de communication.</p>
    
    <h3>✅ Checklist de vérification</h3>
    <p>Avant de publier votre fiche, vérifiez :</p>
    <ul>
    <li>☑️ Toutes les informations sont exactes</li>
    <li>☑️ Au moins 3 photos de qualité</li>
    <li>☑️ Description de 150 mots minimum</li>
    <li>☑️ Mots-clés intégrés naturellement</li>
    <li>☑️ Horaires à jour</li>
    <li>☑️ Coordonnées vérifiées</li>
    </ul>`,
    excerpt: 'Évitez ces 7 erreurs courantes qui peuvent ruiner l\'efficacité de votre fiche professionnelle et faire fuir vos clients.',
    featuredImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
    categories: ['1', '3'], // Tips & Conseils + Guide Entreprise
    tags: ['1', '2'], // SEO + Marketing
    metaDescription: 'Les 7 erreurs à éviter absolument sur votre fiche professionnelle pour ne pas faire fuir vos clients potentiels.',
    slug: 'erreurs-eviter-fiche-professionnelle',
    status: 'published',
    authorId: '1',
    authorName: 'Admin User',
    publishedAt: '2024-11-15T16:00:00Z',
    updatedAt: '2024-11-15T16:00:00Z',
    views: 1432,
    likes: 78
  },
  {
    id: '10',
    title: 'Pourquoi choisir un professionnel local à Bergerac ?',
    content: `<h2>Les avantages du commerce de proximité</h2>
    <p>À l'heure du tout numérique, choisir un professionnel local présente de nombreux avantages souvent méconnus.</p>
    
    <h3>🚗 Proximité et rapidité d'intervention</h3>
    <p>Un professionnel bergeracois peut intervenir rapidement chez vous. Fini les longs délais d'attente ou les frais de déplacement exorbitants.</p>
    <p><strong>Exemple :</strong> Votre chaudière tombe en panne un dimanche ? Un chauffagiste local sera là en 2h, pas en 3 jours !</p>
    
    <h3>🤝 Relation de confiance et suivi personnalisé</h3>
    <p>Avec un professionnel local, vous bâtissez une relation sur le long terme. Il connaît votre maison, vos habitudes, vos besoins spécifiques.</p>
    
    <h3>🏛️ Connaissance du territoire et des réglementations</h3>
    <p>Un artisan bergeracois connaît :</p>
    <ul>
    <li>Les spécificités architecturales locales</li>
    <li>Les réglementations municipales</li>
    <li>Les fournisseurs de la région</li>
    <li>Le climat et ses contraintes</li>
    </ul>
    
    <h3>💚 Soutien à l'économie locale</h3>
    <p>Choisir local, c'est :</p>
    <ul>
    <li>Créer et maintenir des emplois à Bergerac</li>
    <li>Faire vivre le tissu économique local</li>
    <li>Réduire l'impact environnemental (moins de transport)</li>
    <li>Participer à la dynamique de votre ville</li>
    </ul>
    
    <h3>📞 Accessibilité et disponibilité</h3>
    <p>Un professionnel local est plus facilement joignable et disponible pour vous conseiller, même après intervention.</p>
    
    <h3>🔧 Service après-vente de qualité</h3>
    <p>En cas de problème, votre professionnel local a tout intérêt à résoudre rapidement le souci pour préserver sa réputation locale.</p>
    
    <h3>💰 Tarifs souvent plus avantageux</h3>
    <p>Sans frais de déplacement importants ni structure lourde, les professionnels locaux proposent souvent des tarifs compétitifs.</p>
    
    <h3>🌟 Recommandations fiables</h3>
    <p>À Bergerac, le bouche-à-oreille fonctionne bien. Vous pouvez facilement vérifier la réputation d'un professionnel auprès de vos voisins.</p>
    
    <h3>🎯 Comment bien choisir ?</h3>
    <p>Pour choisir le bon professionnel local :</p>
    <ol>
    <li>Vérifiez ses assurances et qualifications</li>
    <li>Consultez les avis clients</li>
    <li>Demandez des références locales</li>
    <li>Comparez plusieurs devis</li>
    <li>Privilégiez ceux inscrits sur notre annuaire !</li>
    </ol>`,
    excerpt: 'Découvrez tous les avantages de choisir un professionnel local à Bergerac : proximité, confiance, économie locale.',
    featuredImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400&fit=crop',
    categories: ['1', '2'], // Tips & Conseils + Actualités Locales
    tags: ['3', '6'], // Bergerac + Artisan
    metaDescription: 'Pourquoi privilégier un professionnel local à Bergerac ? Découvrez tous les avantages du commerce de proximité.',
    slug: 'pourquoi-choisir-professionnel-local-bergerac',
    status: 'published',
    authorId: '1',
    authorName: 'Admin User',
    publishedAt: '2024-11-10T10:15:00Z',
    updatedAt: '2024-11-10T10:15:00Z',
    views: 2341,
    likes: 142
  },
  {
    id: '11',
    title: 'Guide des démarches administratives pour les entreprises à Bergerac',
    content: `<h2>Tout savoir sur les démarches administratives</h2>
    <p>Créer ou gérer une entreprise à Bergerac implique plusieurs démarches administratives. Voici un guide pratique.</p>
    
    <h3>🏛️ Les organismes incontournables</h3>
    
    <h4>Mairie de Bergerac</h4>
    <p><strong>Adresse :</strong> 2 Rue Neuve d'Argenson, 24100 Bergerac<br>
    <strong>Téléphone :</strong> 05 53 74 66 00<br>
    <strong>Services :</strong> Autorisation de voirie, enseignes, terrasses</p>
    
    <h4>CCI Dordogne</h4>
    <p><strong>Adresse :</strong> 295 Boulevard des Saveurs, 24660 Coulounieix-Chamiers<br>
    <strong>Services :</strong> Création d'entreprise, formation, accompagnement</p>
    
    <h4>CFE (Centre de Formalités des Entreprises)</h4>
    <p>Depuis janvier 2023, tout se fait sur le guichet unique : <strong>formalites.entreprises.gouv.fr</strong></p>
    
    <h3>📋 Créer son entreprise : étapes clés</h3>
    
    <h4>1. Choisir son statut juridique</h4>
    <ul>
    <li><strong>Micro-entreprise :</strong> Simple, idéal pour débuter</li>
    <li><strong>EURL/SARL :</strong> Plus de protection, comptabilité rigoureuse</li>
    <li><strong>SAS/SASU :</strong> Flexibilité, idéal pour croissance</li>
    </ul>
    
    <h4>2. Démarches obligatoires</h4>
    <ol>
    <li>Déclaration sur formalites.entreprises.gouv.fr</li>
    <li>Obtention du SIRET</li>
    <li>Ouverture d'un compte bancaire professionnel</li>
    <li>Souscription aux assurances obligatoires</li>
    <li>Affichage des mentions légales</li>
    </ol>
    
    <h3>🏪 Autorisations spécifiques à Bergerac</h3>
    
    <h4>Commerce de bouche</h4>
    <ul>
    <li>Déclaration DDPP (Direction Départementale de Protection des Populations)</li>
    <li>Formation hygiène alimentaire obligatoire</li>
    <li>Plan de maîtrise sanitaire</li>
    </ul>
    
    <h4>Débits de boissons</h4>
    <ul>
    <li>Licence débitant de boissons</li>
    <li>Déclaration en mairie 15 jours avant ouverture</li>
    </ul>
    
    <h4>Activités artisanales</h4>
    <ul>
    <li>Inscription au Répertoire des Métiers</li>
    <li>Stage de Préparation à l'Installation (facultatif depuis 2019)</li>
    <li>Assurance responsabilité civile professionnelle</li>
    <li>Pour le bâtiment : garantie décennale obligatoire</li>
    </ul>
    
    <h3>🚗 Spécificités transport et livraison</h3>
    <p>Zone piétonne du centre-ville de Bergerac :</p>
    <ul>
    <li>Livraisons autorisées de 6h à 11h uniquement</li>
    <li>Demande d'autorisation en mairie pour les véhicules > 3,5T</li>
    <li>Stationnement réglementé Place Pélissière</li>
    </ul>
    
    <h3>💡 Aides disponibles</h3>
    
    <h4>Région Nouvelle-Aquitaine</h4>
    <ul>
    <li>Aide à la création d'entreprise</li>
    <li>Subventions équipement</li>
    <li>Formations gratuites</li>
    </ul>
    
    <h4>Département Dordogne</h4>
    <ul>
    <li>Aide au développement économique</li>
    <li>Soutien à l'innovation</li>
    </ul>
    
    <h4>Pôle Emploi</h4>
    <ul>
    <li>ACRE (ex-ACCRE)</li>
    <li>Maintien des allocations</li>
    <li>Aide à la reprise d'entreprise</li>
    </ul>
    
    <h3>📞 Contacts utiles</h3>
    <ul>
    <li><strong>Mairie de Bergerac :</strong> 05 53 74 66 00</li>
    <li><strong>CCI Dordogne :</strong> 05 53 35 80 00</li>
    <li><strong>Chambre des Métiers :</strong> 05 53 35 88 00</li>
    <li><strong>URSSAF :</strong> 3957</li>
    <li><strong>Impôts :</strong> 05 53 63 62 00</li>
    </ul>`,
    excerpt: 'Guide complet des démarches administratives pour créer et gérer votre entreprise à Bergerac. Contacts, étapes, aides disponibles.',
    featuredImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop',
    categories: ['3'], // Guide Entreprise
    tags: ['3', '5'], // Bergerac + Entrepreneur
    metaDescription: 'Guide des démarches administratives pour les entreprises à Bergerac : création, autorisations, contacts utiles.',
    slug: 'guide-demarches-administratives-entreprises-bergerac',
    status: 'published',
    authorId: '1',
    authorName: 'Admin User',
    publishedAt: '2024-11-05T13:45:00Z',
    updatedAt: '2024-11-05T13:45:00Z',
    views: 1687,
    likes: 89
  }
];

export const mockAppSettings: AppSettings = {
  siteName: 'Annuaire-Bergerac.fr',
  siteDescription: 'Trouvez les meilleurs professionnels de Bergerac et ses environs',
  contactEmail: 'jdelong24100@gmail.com',
  apiKeys: {
    googleMaps: 'YOUR_GOOGLE_MAPS_API_KEY',
    tinyMce: 'YOUR_TINYMCE_API_KEY',
    sendGrid: 'YOUR_SENDGRID_API_KEY',
    stripePublishable: 'pk_test_...',
    stripeSecret: 'sk_test_...',
    stripeWebhook: 'whsec_...',
    brevoApi: 'xkeysib-...',
    googleAnalytics: 'G-XXXXXXXXXX',
    googleAds: 'AW-XXXXXXXXX',
    recaptcha: '6Lc...',
    recaptchaSecret: '6Lc...',
    googleOAuthClientId: 'YOUR_GOOGLE_OAUTH_CLIENT_ID',
    googleOAuthClientSecret: 'YOUR_GOOGLE_OAUTH_CLIENT_SECRET',
    twoFactorApiKey: 'YOUR_2FA_API_KEY'
  },
  seoSettings: {
    defaultTitle: 'Annuaire-Bergerac.fr - Professionnels de Bergerac et environs',
    defaultDescription: 'Découvrez les meilleurs professionnels de Bergerac et ses environs. Restaurants, artisans, commerces, services.',
    keywords: ['annuaire', 'bergerac', 'dordogne', 'professionnels', 'artisans', 'restaurants', 'services', 'périgord']
  },
  authSettings: {
    enableGoogleOAuth: false,
    requireEmailVerification: false,
    enable2FA: false,
    sessionTimeout: 7200 // 2 heures en secondes
  }
};
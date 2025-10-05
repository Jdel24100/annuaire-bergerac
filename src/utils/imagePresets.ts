// Presets d'optimisation d'images pour différents cas d'usage
import { ImageOptimizationOptions } from './imageOptimizer';

export interface ImagePreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  options: ImageOptimizationOptions;
  useCases: string[];
  expectedSavings: string;
}

export const imagePresets: ImagePreset[] = [
  {
    id: 'avatar',
    name: 'Avatar / Photo de Profil',
    description: 'Optimisé pour les photos de profil et avatars',
    icon: '👤',
    options: {
      maxWidth: 512,
      maxHeight: 512,
      quality: 0.9,
      format: 'auto',
      progressive: true,
      generateThumbnails: true,
      maxSize: 1 * 1024 * 1024 // 1MB
    },
    useCases: ['Profils utilisateur', 'Photos de contact', 'Réseaux sociaux'],
    expectedSavings: '70-80%'
  },
  {
    id: 'cover',
    name: 'Image de Couverture',
    description: 'Pour bannières, headers et images de couverture',
    icon: '🖼️',
    options: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'auto',
      progressive: true,
      generateThumbnails: true,
      maxSize: 3 * 1024 * 1024 // 3MB
    },
    useCases: ['Bannières web', 'Headers', 'Couvertures Facebook'],
    expectedSavings: '60-75%'
  },
  {
    id: 'product',
    name: 'Photo Produit',
    description: 'Optimisé pour les images de produits e-commerce',
    icon: '📦',
    options: {
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.9,
      format: 'auto',
      progressive: true,
      generateThumbnails: true,
      maxSize: 2 * 1024 * 1024 // 2MB
    },
    useCases: ['E-commerce', 'Catalogues', 'Galeries produits'],
    expectedSavings: '65-80%'
  },
  {
    id: 'gallery',
    name: 'Galerie / Portfolio',
    description: 'Pour galeries photos et portfolios créatifs',
    icon: '🎨',
    options: {
      maxWidth: 2048,
      maxHeight: 2048,
      quality: 0.88,
      format: 'auto',
      progressive: true,
      generateThumbnails: true,
      maxSize: 5 * 1024 * 1024 // 5MB
    },
    useCases: ['Portfolios', 'Galeries photo', 'Œuvres d\'art'],
    expectedSavings: '55-70%'
  },
  {
    id: 'blog',
    name: 'Article de Blog',
    description: 'Images optimisées pour articles et contenus éditoriaux',
    icon: '📝',
    options: {
      maxWidth: 1200,
      maxHeight: 800,
      quality: 0.85,
      format: 'auto',
      progressive: true,
      generateThumbnails: true,
      maxSize: 2 * 1024 * 1024 // 2MB
    },
    useCases: ['Articles de blog', 'Actualités', 'Contenu éditorial'],
    expectedSavings: '60-75%'
  },
  {
    id: 'thumbnail',
    name: 'Miniatures',
    description: 'Petites images pour listes et aperçus',
    icon: '🔍',
    options: {
      maxWidth: 300,
      maxHeight: 300,
      quality: 0.8,
      format: 'auto',
      progressive: false,
      generateThumbnails: false,
      maxSize: 100 * 1024 // 100KB
    },
    useCases: ['Listes de produits', 'Aperçus', 'Miniatures'],
    expectedSavings: '80-90%'
  },
  {
    id: 'print',
    name: 'Qualité Print',
    description: 'Haute qualité pour impression et archivage',
    icon: '🖨️',
    options: {
      maxWidth: 3000,
      maxHeight: 3000,
      quality: 0.95,
      format: 'jpeg', // Force JPEG pour compatibilité print
      progressive: true,
      generateThumbnails: true,
      maxSize: 10 * 1024 * 1024 // 10MB
    },
    useCases: ['Impression', 'Archivage', 'Haute définition'],
    expectedSavings: '20-40%'
  },
  {
    id: 'mobile',
    name: 'Mobile First',
    description: 'Ultra-optimisé pour les connexions mobiles',
    icon: '📱',
    options: {
      maxWidth: 800,
      maxHeight: 600,
      quality: 0.75,
      format: 'auto',
      progressive: true,
      generateThumbnails: true,
      maxSize: 500 * 1024 // 500KB
    },
    useCases: ['Apps mobiles', 'Sites responsive', 'Connexions lentes'],
    expectedSavings: '80-90%'
  },
  {
    id: 'icon',
    name: 'Icône / Logo',
    description: 'Pour logos, icônes et éléments graphiques',
    icon: '🎯',
    options: {
      maxWidth: 256,
      maxHeight: 256,
      quality: 0.95,
      format: 'auto',
      progressive: false,
      generateThumbnails: false,
      maxSize: 50 * 1024 // 50KB
    },
    useCases: ['Logos', 'Icônes', 'Favicons'],
    expectedSavings: '60-80%'
  },
  {
    id: 'social',
    name: 'Réseaux Sociaux',
    description: 'Formats optimisés pour le partage social',
    icon: '📲',
    options: {
      maxWidth: 1200,
      maxHeight: 630, // Format Open Graph
      quality: 0.85,
      format: 'auto',
      progressive: true,
      generateThumbnails: true,
      maxSize: 1 * 1024 * 1024 // 1MB
    },
    useCases: ['Open Graph', 'Twitter Cards', 'LinkedIn'],
    expectedSavings: '65-80%'
  }
];

// Presets spécialisés pour différents secteurs
export const sectorPresets: Record<string, ImagePreset> = {
  restaurant: {
    id: 'restaurant',
    name: 'Restaurant / Food',
    description: 'Optimisé pour photos culinaires et restaurants',
    icon: '🍽️',
    options: {
      maxWidth: 1200,
      maxHeight: 900,
      quality: 0.9, // Qualité élevée pour la food
      format: 'auto',
      progressive: true,
      generateThumbnails: true,
      maxSize: 2 * 1024 * 1024
    },
    useCases: ['Plats', 'Menus', 'Ambiance restaurant'],
    expectedSavings: '60-75%'
  },
  
  realestate: {
    id: 'realestate',
    name: 'Immobilier',
    description: 'Photos de biens immobiliers et visites virtuelles',
    icon: '🏠',
    options: {
      maxWidth: 1920,
      maxHeight: 1280,
      quality: 0.88,
      format: 'auto',
      progressive: true,
      generateThumbnails: true,
      maxSize: 4 * 1024 * 1024
    },
    useCases: ['Photos de biens', 'Visites virtuelles', 'Plans'],
    expectedSavings: '55-70%'
  },
  
  automotive: {
    id: 'automotive',
    name: 'Automobile',
    description: 'Photos de véhicules et concessions',
    icon: '🚗',
    options: {
      maxWidth: 1600,
      maxHeight: 1200,
      quality: 0.88,
      format: 'auto',
      progressive: true,
      generateThumbnails: true,
      maxSize: 3 * 1024 * 1024
    },
    useCases: ['Véhicules', 'Showrooms', 'Détails techniques'],
    expectedSavings: '60-75%'
  },
  
  fashion: {
    id: 'fashion',
    name: 'Mode / Beauté',
    description: 'Photos de mode, vêtements et cosmétiques',
    icon: '👗',
    options: {
      maxWidth: 1200,
      maxHeight: 1800, // Format portrait pour mode
      quality: 0.9,
      format: 'auto',
      progressive: true,
      generateThumbnails: true,
      maxSize: 3 * 1024 * 1024
    },
    useCases: ['Vêtements', 'Cosmétiques', 'Lookbooks'],
    expectedSavings: '65-80%'
  }
};

// Fonction pour obtenir un preset par ID
export function getPreset(id: string): ImagePreset | undefined {
  return imagePresets.find(preset => preset.id === id) || 
         Object.values(sectorPresets).find(preset => preset.id === id);
}

// Fonction pour obtenir les presets recommandés selon le contexte
export function getRecommendedPresets(context?: {
  fileSize?: number;
  dimensions?: { width: number; height: number };
  usage?: string;
  sector?: string;
}): ImagePreset[] {
  if (!context) return imagePresets.slice(0, 3); // Top 3 par défaut

  const recommended: ImagePreset[] = [];

  // Recommandations par secteur
  if (context.sector && sectorPresets[context.sector]) {
    recommended.push(sectorPresets[context.sector]);
  }

  // Recommandations par taille de fichier
  if (context.fileSize) {
    if (context.fileSize > 5 * 1024 * 1024) { // > 5MB
      recommended.push(getPreset('mobile')!);
    } else if (context.fileSize > 2 * 1024 * 1024) { // > 2MB
      recommended.push(getPreset('cover')!);
    } else {
      recommended.push(getPreset('product')!);
    }
  }

  // Recommandations par dimensions
  if (context.dimensions) {
    const { width, height } = context.dimensions;
    const ratio = width / height;

    if (width <= 300 && height <= 300) {
      recommended.push(getPreset('thumbnail')!);
    } else if (ratio > 1.5) { // Format paysage
      recommended.push(getPreset('cover')!);
    } else if (ratio < 0.8) { // Format portrait
      recommended.push(getPreset('product')!);
    } else { // Format carré
      recommended.push(getPreset('avatar')!);
    }
  }

  // Supprimer les doublons et limiter à 3
  const unique = recommended.filter((preset, index, arr) => 
    arr.findIndex(p => p.id === preset.id) === index
  ).slice(0, 3);

  // Compléter avec des presets par défaut si nécessaire
  if (unique.length < 3) {
    const defaults = imagePresets.filter(preset => 
      !unique.some(u => u.id === preset.id)
    ).slice(0, 3 - unique.length);
    unique.push(...defaults);
  }

  return unique;
}

// Configuration pour différents formats de sortie
export const formatConfigs = {
  avif: {
    name: 'AVIF',
    description: 'Format moderne ultra-compressé',
    support: 85,
    savings: '60-90%',
    pros: ['Meilleure compression', 'Support HDR', 'Transparence'],
    cons: ['Support limité (Safari récent)', 'Plus lent à encoder']
  },
  webp: {
    name: 'WebP',
    description: 'Format Google largement supporté',
    support: 95,
    savings: '40-80%',
    pros: ['Largement supporté', 'Bonne compression', 'Animation'],
    cons: ['Pas de support IE', 'Qualité moindre que AVIF']
  },
  jpeg: {
    name: 'JPEG',
    description: 'Format universel avec optimisations',
    support: 100,
    savings: '20-60%',
    pros: ['Support universel', 'Rapide', 'Optimisations modernes'],
    cons: ['Compression avec perte', 'Pas de transparence']
  },
  png: {
    name: 'PNG',
    description: 'Format sans perte avec transparence',
    support: 100,
    savings: '10-40%',
    pros: ['Sans perte', 'Transparence', 'Support universel'],
    cons: ['Fichiers volumineux', 'Pas de compression moderne']
  }
};

// Calculateur d'économies estimées
export function calculateExpectedSavings(
  file: File, 
  preset: ImagePreset
): {
  estimatedSize: number;
  savings: number;
  savingsPercent: number;
} {
  let compressionRatio = 0.5; // 50% par défaut

  // Ajustements selon le format
  if (preset.options.format === 'avif') {
    compressionRatio = 0.2; // 80% de réduction
  } else if (preset.options.format === 'webp') {
    compressionRatio = 0.4; // 60% de réduction
  } else if (preset.options.format === 'jpeg') {
    compressionRatio = 0.6; // 40% de réduction
  }

  // Ajustements selon la qualité
  const qualityFactor = (preset.options.quality || 0.85);
  compressionRatio *= (0.5 + qualityFactor * 0.5);

  // Ajustements selon les dimensions
  if (preset.options.maxWidth && preset.options.maxHeight) {
    const maxPixels = preset.options.maxWidth * preset.options.maxHeight;
    if (maxPixels < 500000) { // < 0.5MP
      compressionRatio *= 0.7;
    } else if (maxPixels > 2000000) { // > 2MP
      compressionRatio *= 1.2;
    }
  }

  const estimatedSize = Math.max(
    file.size * compressionRatio,
    preset.options.maxSize ? preset.options.maxSize * 0.1 : 10 * 1024 // Min 10KB
  );

  const savings = file.size - estimatedSize;
  const savingsPercent = (savings / file.size) * 100;

  return {
    estimatedSize: Math.round(estimatedSize),
    savings: Math.round(savings),
    savingsPercent: Math.round(savingsPercent)
  };
}
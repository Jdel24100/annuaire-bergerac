// Service de détection et prévention des doublons
import { ProfessionalListing } from '../types';

export interface DuplicateMatch {
  id: string;
  listing: ProfessionalListing;
  matchScore: number;
  matchReasons: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  matches: DuplicateMatch[];
  recommendations: string[];
  canProceed: boolean;
}

export interface SiretValidationResult {
  isValid: boolean;
  companyName?: string;
  address?: string;
  status?: string;
  error?: string;
}

// Configuration de détection
const DUPLICATE_THRESHOLDS = {
  HIGH_CONFIDENCE: 0.9,     // 90% - Très probablement un doublon
  MEDIUM_CONFIDENCE: 0.7,   // 70% - Probablement un doublon
  LOW_CONFIDENCE: 0.5       // 50% - Possiblement un doublon
} as const;

export class DuplicateDetectionService {
  private static instance: DuplicateDetectionService;
  
  public static getInstance(): DuplicateDetectionService {
    if (!DuplicateDetectionService.instance) {
      DuplicateDetectionService.instance = new DuplicateDetectionService();
    }
    return DuplicateDetectionService.instance;
  }

  /**
   * Détecte les doublons potentiels pour une nouvelle fiche
   */
  async detectDuplicates(
    newListing: Partial<ProfessionalListing>, 
    existingListings: ProfessionalListing[]
  ): Promise<DuplicateDetectionResult> {
    const matches: DuplicateMatch[] = [];

    for (const existing of existingListings) {
      const matchResult = this.calculateMatchScore(newListing, existing);
      
      if (matchResult.matchScore >= DUPLICATE_THRESHOLDS.LOW_CONFIDENCE) {
        matches.push(matchResult);
      }
    }

    // Trier par score décroissant
    matches.sort((a, b) => b.matchScore - a.matchScore);

    const highConfidenceMatches = matches.filter(m => m.confidence === 'high');
    const isDuplicate = highConfidenceMatches.length > 0;

    return {
      isDuplicate,
      matches,
      recommendations: this.generateRecommendations(matches),
      canProceed: !isDuplicate || this.canBypassDuplicate(newListing, matches)
    };
  }

  /**
   * Calcule le score de correspondance entre deux fiches
   */
  private calculateMatchScore(
    newListing: Partial<ProfessionalListing>,
    existing: ProfessionalListing
  ): DuplicateMatch {
    let score = 0;
    const reasons: string[] = [];
    const weights = {
      siret: 1.0,          // SIRET identique = 100% de correspondance
      exactName: 0.8,      // Nom exact = 80%
      similarName: 0.4,    // Nom similaire = 40%
      phone: 0.6,          // Téléphone = 60%
      email: 0.5,          // Email = 50%
      address: 0.7,        // Adresse = 70%
      googlePlaceId: 0.9   // Google Place ID = 90%
    };

    // 1. Vérification SIRET (priorité absolue)
    if (newListing.siret && existing.siret && newListing.siret === existing.siret) {
      score = 1.0;
      reasons.push('SIRET identique');
      return {
        id: existing.id,
        listing: existing,
        matchScore: score,
        matchReasons: reasons,
        confidence: 'high'
      };
    }

    // 2. Vérification Google Place ID
    if (newListing.contact?.googlePlaceId && 
        existing.contact?.googlePlaceId &&
        newListing.contact.googlePlaceId === existing.contact.googlePlaceId) {
      score += weights.googlePlaceId;
      reasons.push('Google Place ID identique');
    }

    // 3. Vérification nom
    if (newListing.title && existing.title) {
      const nameMatch = this.calculateNameSimilarity(newListing.title, existing.title);
      if (nameMatch >= 0.9) {
        score += weights.exactName;
        reasons.push('Nom quasi-identique');
      } else if (nameMatch >= 0.7) {
        score += weights.similarName;
        reasons.push('Nom similaire');
      }
    }

    // 4. Vérification téléphone
    if (newListing.contact?.phone && existing.contact?.phone) {
      const phone1 = this.normalizePhone(newListing.contact.phone);
      const phone2 = this.normalizePhone(existing.contact.phone);
      if (phone1 === phone2) {
        score += weights.phone;
        reasons.push('Téléphone identique');
      }
    }

    // 5. Vérification email
    if (newListing.contact?.email && existing.contact?.email) {
      if (newListing.contact.email.toLowerCase() === existing.contact.email.toLowerCase()) {
        score += weights.email;
        reasons.push('Email identique');
      }
    }

    // 6. Vérification adresse
    if (newListing.contact?.address && existing.contact?.address) {
      const addressMatch = this.calculateAddressSimilarity(
        newListing.contact.address, 
        existing.contact.address
      );
      if (addressMatch >= 0.8) {
        score += weights.address;
        reasons.push('Adresse très similaire');
      } else if (addressMatch >= 0.6) {
        score += weights.address * 0.5;
        reasons.push('Adresse similaire');
      }
    }

    // Déterminer la confiance
    let confidence: 'high' | 'medium' | 'low';
    if (score >= DUPLICATE_THRESHOLDS.HIGH_CONFIDENCE) {
      confidence = 'high';
    } else if (score >= DUPLICATE_THRESHOLDS.MEDIUM_CONFIDENCE) {
      confidence = 'medium';
    } else {
      confidence = 'low';
    }

    return {
      id: existing.id,
      listing: existing,
      matchScore: score,
      matchReasons: reasons,
      confidence
    };
  }

  /**
   * Calcule la similarité entre deux noms
   */
  private calculateNameSimilarity(name1: string, name2: string): number {
    const normalized1 = this.normalizeName(name1);
    const normalized2 = this.normalizeName(name2);
    
    if (normalized1 === normalized2) return 1.0;
    
    return this.calculateLevenshteinSimilarity(normalized1, normalized2);
  }

  /**
   * Normalise un nom d'entreprise
   */
  private normalizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Supprimer la ponctuation
      .replace(/\b(sarl|sas|eurl|sa|sasu|auto entrepreneur|entreprise|ets|etablissements|societe|cie|compagnie)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Normalise un numéro de téléphone
   */
  private normalizePhone(phone: string): string {
    return phone.replace(/[\s\-\.\(\)]/g, '').replace(/^\+33/, '0');
  }

  /**
   * Calcule la similarité d'adresse
   */
  private calculateAddressSimilarity(address1: string, address2: string): number {
    const normalized1 = this.normalizeAddress(address1);
    const normalized2 = this.normalizeAddress(address2);
    
    if (normalized1 === normalized2) return 1.0;
    
    return this.calculateLevenshteinSimilarity(normalized1, normalized2);
  }

  /**
   * Normalise une adresse
   */
  private normalizeAddress(address: string): string {
    return address
      .toLowerCase()
      .replace(/\b(rue|avenue|av|place|pl|boulevard|bd|impasse|imp|chemin|ch|route|rte|bis|ter|quater)\b/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Calcule la similarité de Levenshtein normalisée
   */
  private calculateLevenshteinSimilarity(str1: string, str2: string): number {
    const matrix = Array.from({ length: str1.length + 1 }, () => 
      Array.from({ length: str2.length + 1 }, () => 0)
    );

    for (let i = 0; i <= str1.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= str2.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= str1.length; i++) {
      for (let j = 1; j <= str2.length; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : 1 - matrix[str1.length][str2.length] / maxLength;
  }

  /**
   * Génère des recommandations basées sur les correspondances
   */
  private generateRecommendations(matches: DuplicateMatch[]): string[] {
    const recommendations: string[] = [];

    if (matches.length === 0) {
      recommendations.push('Aucun doublon détecté. Vous pouvez procéder à la création.');
      return recommendations;
    }

    const highConfidence = matches.filter(m => m.confidence === 'high');
    const mediumConfidence = matches.filter(m => m.confidence === 'medium');

    if (highConfidence.length > 0) {
      recommendations.push(
        `⚠️ ${highConfidence.length} doublon(s) probable(s) détecté(s). Vérifiez si cette entreprise n'existe pas déjà.`
      );
      
      highConfidence.forEach(match => {
        recommendations.push(`• "${match.listing.title}" - ${match.matchReasons.join(', ')}`);
      });

      recommendations.push('💡 Si c\'est votre entreprise, utilisez plutôt la fonction "Revendiquer cette fiche".');
    }

    if (mediumConfidence.length > 0) {
      recommendations.push(
        `ℹ️ ${mediumConfidence.length} correspondance(s) possible(s) trouvée(s). Vérifiez les informations.`
      );
    }

    return recommendations;
  }

  /**
   * Détermine si on peut bypasser la détection de doublons
   */
  private canBypassDuplicate(
    newListing: Partial<ProfessionalListing>,
    matches: DuplicateMatch[]
  ): boolean {
    // On peut bypasser si:
    // 1. L'utilisateur a un SIRET différent
    // 2. Aucun match de haute confiance sur SIRET/Google Place ID
    
    const siretMatches = matches.filter(m => 
      m.matchReasons.includes('SIRET identique')
    );
    
    const googlePlaceMatches = matches.filter(m => 
      m.matchReasons.includes('Google Place ID identique')
    );

    return siretMatches.length === 0 && googlePlaceMatches.length === 0;
  }

  /**
   * Valide un SIRET via l'API INSEE (simulation)
   */
  async validateSiret(siret: string): Promise<SiretValidationResult> {
    // Validation format SIRET
    if (!this.isValidSiretFormat(siret)) {
      return {
        isValid: false,
        error: 'Format SIRET invalide (14 chiffres requis)'
      };
    }

    try {
      // En production, appeler l'API INSEE
      // Pour l'instant, simulation
      const isValid = this.validateSiretChecksum(siret);
      
      if (!isValid) {
        return {
          isValid: false,
          error: 'SIRET invalide (clé de contrôle incorrecte)'
        };
      }

      // Simulation de données entreprise
      return {
        isValid: true,
        companyName: `Entreprise ${siret.substring(0, 9)}`,
        address: `Adresse simulée pour ${siret}`,
        status: 'Actif'
      };

    } catch (error) {
      return {
        isValid: false,
        error: 'Impossible de vérifier le SIRET pour le moment'
      };
    }
  }

  /**
   * Vérifie le format SIRET
   */
  private isValidSiretFormat(siret: string): boolean {
    return /^\d{14}$/.test(siret.replace(/\s/g, ''));
  }

  /**
   * Valide la clé de contrôle SIRET (algorithme de Luhn)
   */
  private validateSiretChecksum(siret: string): boolean {
    const cleanSiret = siret.replace(/\s/g, '');
    let sum = 0;
    
    for (let i = 0; i < 14; i++) {
      let digit = parseInt(cleanSiret[i]);
      
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) {
          digit = Math.floor(digit / 10) + (digit % 10);
        }
      }
      
      sum += digit;
    }
    
    return sum % 10 === 0;
  }

  /**
   * Marque une fiche comme vérifiée pour les doublons
   */
  markDuplicateChecked(listingId: string): void {
    // En production, mettre à jour en base de données
    console.log(`Fiche ${listingId} marquée comme vérifiée pour les doublons`);
  }

  /**
   * Fusionne des fiches dupliquées
   */
  mergeDuplicateListings(
    primaryListing: ProfessionalListing,
    duplicateListings: ProfessionalListing[]
  ): ProfessionalListing {
    // Logique de fusion intelligente
    const merged = { ...primaryListing };

    duplicateListings.forEach(duplicate => {
      // Fusionner les informations manquantes
      if (!merged.contact.website && duplicate.contact.website) {
        merged.contact.website = duplicate.contact.website;
      }
      
      if (!merged.logo && duplicate.logo) {
        merged.logo = duplicate.logo;
      }

      // Fusionner les galeries
      if (duplicate.gallery) {
        merged.gallery = [...new Set([...merged.gallery, ...duplicate.gallery])];
      }

      // Fusionner les liens sociaux
      if (duplicate.contact.socialLinks) {
        merged.contact.socialLinks = {
          ...merged.contact.socialLinks,
          ...duplicate.contact.socialLinks
        };
      }
    });

    return merged;
  }
}

// Instance singleton
export const duplicateDetectionService = DuplicateDetectionService.getInstance();

// Hook React pour la détection de doublons
import React from 'react';

export function useDuplicateDetection() {
  const [isChecking, setIsChecking] = React.useState(false);
  
  const checkDuplicates = React.useCallback(async (
    newListing: Partial<ProfessionalListing>,
    existingListings: ProfessionalListing[]
  ): Promise<DuplicateDetectionResult> => {
    setIsChecking(true);
    try {
      const result = await duplicateDetectionService.detectDuplicates(newListing, existingListings);
      return result;
    } finally {
      setIsChecking(false);
    }
  }, []);

  const validateSiret = React.useCallback(async (siret: string): Promise<SiretValidationResult> => {
    return duplicateDetectionService.validateSiret(siret);
  }, []);

  return {
    checkDuplicates,
    validateSiret,
    isChecking
  };
}
// Système d'optimisation d'images avancé avec support AVIF
import { supabase, projectId, publicAnonKey } from './supabase/client';

// Types et interfaces
export interface ImageOptimizationOptions {
  maxSize?: number; // Taille max du fichier en bytes
  maxWidth?: number; // Largeur max en pixels
  maxHeight?: number; // Hauteur max en pixels
  quality?: number; // Qualité (0-1)
  format?: 'auto' | 'avif' | 'webp' | 'jpeg' | 'png';
  progressive?: boolean; // JPEG progressif
  preserveMetadata?: boolean; // Conserver les métadonnées
  generateThumbnails?: boolean; // Générer des miniatures
  compressionLevel?: number; // Niveau de compression (1-9)
}

export interface OptimizedImageResult {
  original: {
    file: File;
    size: number;
    dimensions: { width: number; height: number };
    format: string;
  };
  optimized: {
    file: File;
    size: number;
    dimensions: { width: number; height: number };
    format: string;
    compressionRatio: number;
    dataUrl: string;
  };
  thumbnails?: {
    small: { file: File; dataUrl: string; size: number };
    medium: { file: File; dataUrl: string; size: number };
    large: { file: File; dataUrl: string; size: number };
  };
  metadata?: ImageMetadata;
}

export interface ImageMetadata {
  originalName: string;
  uploadDate: Date;
  exif?: any;
  colorProfile?: string;
  hasTransparency: boolean;
}

export class ImageOptimizationError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = 'ImageOptimizationError';
  }
}

// Configuration par défaut
const DEFAULT_OPTIONS: Required<ImageOptimizationOptions> = {
  maxSize: 2 * 1024 * 1024, // 2MB
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.85,
  format: 'auto',
  progressive: true,
  preserveMetadata: false,
  generateThumbnails: true,
  compressionLevel: 6
};

// Tailles des miniatures
const THUMBNAIL_SIZES = {
  small: { width: 150, height: 150 },
  medium: { width: 500, height: 500 },
  large: { width: 1024, height: 1024 }
};

/**
 * Détecte le support AVIF du navigateur
 */
export function supportsAVIF(): Promise<boolean> {
  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = () => resolve(true);
    avif.onerror = () => resolve(false);
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
}

/**
 * Détecte le support WebP du navigateur
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webp = new Image();
    webp.onload = () => resolve(true);
    webp.onerror = () => resolve(false);
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * Détermine le meilleur format de sortie
 */
export async function getBestFormat(originalFormat: string, options: ImageOptimizationOptions): Promise<string> {
  if (options.format !== 'auto') {
    return `image/${options.format}`;
  }

  // Si c'est un PNG avec transparence, garder PNG ou utiliser WebP
  if (originalFormat === 'image/png') {
    if (await supportsAVIF()) return 'image/avif';
    if (await supportsWebP()) return 'image/webp';
    return 'image/png';
  }

  // Pour les autres formats, privilégier AVIF > WebP > JPEG
  if (await supportsAVIF()) return 'image/avif';
  if (await supportsWebP()) return 'image/webp';
  return 'image/jpeg';
}

/**
 * Calcule les dimensions optimales en préservant le ratio
 */
function calculateOptimalDimensions(
  originalWidth: number, 
  originalHeight: number, 
  maxWidth: number, 
  maxHeight: number
): { width: number; height: number } {
  if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
    return { width: originalWidth, height: originalHeight };
  }

  const aspectRatio = originalWidth / originalHeight;
  
  let newWidth = maxWidth;
  let newHeight = maxWidth / aspectRatio;
  
  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = maxHeight * aspectRatio;
  }
  
  // Arrondir aux pixels entiers
  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight)
  };
}

/**
 * Extrait les métadonnées EXIF (basique)
 */
async function extractMetadata(file: File): Promise<ImageMetadata> {
  return {
    originalName: file.name,
    uploadDate: new Date(),
    hasTransparency: file.type === 'image/png' || file.type === 'image/gif'
  };
}

/**
 * Crée une image optimisée avec le canvas
 */
async function createOptimizedImage(
  sourceImage: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  format: string,
  quality: number,
  progressive: boolean = true
): Promise<{ file: File; dataUrl: string; size: number }> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new ImageOptimizationError('Impossible de créer le contexte canvas', 'CANVAS_ERROR');
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Amélioration de la qualité de redimensionnement
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Dessiner l'image redimensionnée
  ctx.drawImage(sourceImage, 0, 0, targetWidth, targetHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new ImageOptimizationError('Erreur lors de la création du blob', 'BLOB_ERROR'));
          return;
        }

        const fileName = `optimized_${Date.now()}.${format.split('/')[1]}`;
        const file = new File([blob], fileName, { type: format });
        const dataUrl = canvas.toDataURL(format, quality);

        resolve({
          file,
          dataUrl,
          size: blob.size
        });
      },
      format,
      quality
    );
  });
}

/**
 * Génère des miniatures à différentes tailles
 */
async function generateThumbnails(
  sourceImage: HTMLImageElement,
  format: string,
  quality: number
): Promise<OptimizedImageResult['thumbnails']> {
  const thumbnails: any = {};

  for (const [size, dimensions] of Object.entries(THUMBNAIL_SIZES)) {
    const { width, height } = calculateOptimalDimensions(
      sourceImage.width,
      sourceImage.height,
      dimensions.width,
      dimensions.height
    );

    const result = await createOptimizedImage(
      sourceImage,
      width,
      height,
      format,
      quality * 0.9 // Qualité légèrement réduite pour les miniatures
    );

    thumbnails[size] = result;
  }

  return thumbnails;
}

/**
 * Optimise une image complètement
 */
export async function optimizeImage(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<OptimizedImageResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Validation du fichier
  if (!file.type.startsWith('image/')) {
    throw new ImageOptimizationError('Le fichier n\'est pas une image', 'INVALID_TYPE');
  }

  if (file.size > opts.maxSize) {
    const maxSizeMB = (opts.maxSize / (1024 * 1024)).toFixed(1);
    throw new ImageOptimizationError(
      `Fichier trop volumineux. Taille maximum: ${maxSizeMB}MB`,
      'FILE_TOO_LARGE'
    );
  }

  // Créer l'élément image
  const img = new Image();
  
  return new Promise((resolve, reject) => {
    img.onload = async () => {
      try {
        const originalWidth = img.width;
        const originalHeight = img.height;

        // Calculer les dimensions optimales
        const optimalDimensions = calculateOptimalDimensions(
          originalWidth,
          originalHeight,
          opts.maxWidth,
          opts.maxHeight
        );

        // Déterminer le meilleur format
        const bestFormat = await getBestFormat(file.type, opts);

        // Créer l'image optimisée
        const optimizedImage = await createOptimizedImage(
          img,
          optimalDimensions.width,
          optimalDimensions.height,
          bestFormat,
          opts.quality,
          opts.progressive
        );

        // Résultat de base
        const result: OptimizedImageResult = {
          original: {
            file,
            size: file.size,
            dimensions: { width: originalWidth, height: originalHeight },
            format: file.type
          },
          optimized: {
            file: optimizedImage.file,
            size: optimizedImage.size,
            dimensions: optimalDimensions,
            format: bestFormat,
            compressionRatio: ((file.size - optimizedImage.size) / file.size) * 100,
            dataUrl: optimizedImage.dataUrl
          }
        };

        // Générer les miniatures si demandé
        if (opts.generateThumbnails) {
          result.thumbnails = await generateThumbnails(img, bestFormat, opts.quality);
        }

        // Extraire les métadonnées si demandé
        if (opts.preserveMetadata) {
          result.metadata = await extractMetadata(file);
        }

        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new ImageOptimizationError('Impossible de charger l\'image', 'LOAD_ERROR'));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Upload une image optimisée vers Supabase Storage
 */
export async function uploadOptimizedImage(
  result: OptimizedImageResult,
  bucketName: string = 'images',
  folder: string = 'optimized'
): Promise<{
  mainUrl: string;
  thumbnailUrls?: { small: string; medium: string; large: string };
}> {
  // Utilisation du client Supabase singleton

  try {
    // Upload de l'image principale
    const mainFileName = `${folder}/${Date.now()}_${result.optimized.file.name}`;
    const { data: mainData, error: mainError } = await supabase.storage
      .from(bucketName)
      .upload(mainFileName, result.optimized.file);

    if (mainError) throw mainError;

    const { data: { publicUrl: mainUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(mainFileName);

    const uploadResult: any = { mainUrl };

    // Upload des miniatures si présentes
    if (result.thumbnails) {
      const thumbnailUrls: any = {};
      
      for (const [size, thumbnail] of Object.entries(result.thumbnails)) {
        const thumbnailFileName = `${folder}/thumbnails/${size}/${Date.now()}_${thumbnail.file.name}`;
        
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(thumbnailFileName, thumbnail.file);

        if (error) {
          console.warn(`Erreur upload miniature ${size}:`, error);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(thumbnailFileName);

        thumbnailUrls[size] = publicUrl;
      }

      if (Object.keys(thumbnailUrls).length > 0) {
        uploadResult.thumbnailUrls = thumbnailUrls;
      }
    }

    return uploadResult;
  } catch (error) {
    throw new ImageOptimizationError(
      'Erreur lors de l\'upload vers Supabase',
      'UPLOAD_ERROR',
      error
    );
  }
}

/**
 * Batch optimization de plusieurs images
 */
export async function optimizeMultipleImages(
  files: File[],
  options: ImageOptimizationOptions = {},
  onProgress?: (completed: number, total: number, currentFile: string) => void
): Promise<OptimizedImageResult[]> {
  const results: OptimizedImageResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.(i, files.length, file.name);
    
    try {
      const result = await optimizeImage(file, options);
      results.push(result);
    } catch (error) {
      console.error(`Erreur optimisation ${file.name}:`, error);
      // Continuer avec les autres fichiers
    }
  }
  
  onProgress?.(files.length, files.length, 'Terminé');
  return results;
}

/**
 * Utilitaires de formatage
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatCompressionRatio(ratio: number): string {
  return `${ratio.toFixed(1)}%`;
}

/**
 * Prévisualisation de l'optimisation (sans traitement)
 */
export async function previewOptimization(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<{
  estimatedSize: number;
  estimatedFormat: string;
  estimatedDimensions: { width: number; height: number };
  savings: number;
}> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      const dimensions = calculateOptimalDimensions(
        img.width,
        img.height,
        opts.maxWidth,
        opts.maxHeight
      );
      
      const bestFormat = await getBestFormat(file.type, opts);
      
      // Estimation approximative de la taille (basée sur des heuristiques)
      const pixelCount = dimensions.width * dimensions.height;
      const formatMultiplier = bestFormat.includes('avif') ? 0.3 : 
                             bestFormat.includes('webp') ? 0.5 : 
                             bestFormat.includes('jpeg') ? 0.7 : 1.0;
      
      const estimatedSize = Math.round(pixelCount * formatMultiplier * opts.quality);
      const savings = ((file.size - estimatedSize) / file.size) * 100;
      
      resolve({
        estimatedSize,
        estimatedFormat: bestFormat,
        estimatedDimensions: dimensions,
        savings: Math.max(0, savings)
      });
    };
    
    img.onerror = () => reject(new Error('Impossible de charger l\'image'));
    img.src = URL.createObjectURL(file);
  });
}
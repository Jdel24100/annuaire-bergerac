// Utilitaires pour l'upload et la gestion d'images

export interface ImageUploadOptions {
  maxSize?: number; // en bytes, défaut 5MB
  allowedTypes?: string[]; // types MIME autorisés
  maxWidth?: number; // largeur max en pixels
  maxHeight?: number; // hauteur max en pixels
  quality?: number; // qualité de compression (0-1)
}

export interface ImageUploadResult {
  file: File;
  dataUrl: string;
  dimensions: {
    width: number;
    height: number;
  };
  size: number;
}

const defaultOptions: Required<ImageUploadOptions> = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.85
};

export class ImageUploadError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ImageUploadError';
  }
}

/**
 * Valide et traite un fichier image
 */
export async function processImageFile(
  file: File, 
  options: ImageUploadOptions = {}
): Promise<ImageUploadResult> {
  const opts = { ...defaultOptions, ...options };

  // Validation du type de fichier
  if (!opts.allowedTypes.includes(file.type)) {
    throw new ImageUploadError(
      `Type de fichier non supporté. Types autorisés: ${opts.allowedTypes.join(', ')}`,
      'INVALID_TYPE'
    );
  }

  // Validation de la taille
  if (file.size > opts.maxSize) {
    const maxSizeMB = (opts.maxSize / (1024 * 1024)).toFixed(1);
    throw new ImageUploadError(
      `Fichier trop volumineux. Taille maximum: ${maxSizeMB}MB`,
      'FILE_TOO_LARGE'
    );
  }

  // Créer une image pour obtenir les dimensions
  const img = new Image();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new ImageUploadError('Impossible de créer le contexte canvas', 'CANVAS_ERROR');
  }

  return new Promise((resolve, reject) => {
    img.onload = () => {
      try {
        const { width: originalWidth, height: originalHeight } = img;

        // Calculer les nouvelles dimensions si nécessaire
        let newWidth = originalWidth;
        let newHeight = originalHeight;

        if (originalWidth > opts.maxWidth || originalHeight > opts.maxHeight) {
          const aspectRatio = originalWidth / originalHeight;
          
          if (originalWidth > originalHeight) {
            newWidth = Math.min(opts.maxWidth, originalWidth);
            newHeight = newWidth / aspectRatio;
          } else {
            newHeight = Math.min(opts.maxHeight, originalHeight);
            newWidth = newHeight * aspectRatio;
          }
        }

        // Redimensionner si nécessaire
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convertir en blob avec la qualité spécifiée
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new ImageUploadError('Erreur lors de la compression', 'COMPRESSION_ERROR'));
              return;
            }

            const processedFile = new File([blob], file.name, { type: file.type });
            const dataUrl = canvas.toDataURL(file.type, opts.quality);

            resolve({
              file: processedFile,
              dataUrl,
              dimensions: { width: newWidth, height: newHeight },
              size: blob.size
            });
          },
          file.type,
          opts.quality
        );
      } catch (error) {
        reject(new ImageUploadError('Erreur lors du traitement de l\'image', 'PROCESSING_ERROR'));
      }
    };

    img.onerror = () => {
      reject(new ImageUploadError('Impossible de charger l\'image', 'LOAD_ERROR'));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Crée une prévisualisation d'image avec informations
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Erreur lors de la lecture du fichier'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Formate la taille de fichier en format lisible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Upload d'image vers un service (simulation)
 * Dans un vrai projet, cela utiliserait Supabase Storage
 */
export async function uploadImageToStorage(
  file: File, 
  path: string = 'avatars'
): Promise<string> {
  // Simulation d'upload avec délai
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Dans un vrai projet, on utiliserait Supabase Storage :
  /*
  const supabase = createClient(projectId, publicAnonKey);
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, file);
    
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);
    
  return publicUrl;
  */
  
  // Pour la démo, on retourne une URL factice
  return URL.createObjectURL(file);
}

/**
 * Supprime une image du stockage (simulation)
 */
export async function deleteImageFromStorage(url: string): Promise<void> {
  // Simulation de suppression
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Dans un vrai projet :
  /*
  const supabase = createClient(projectId, publicAnonKey);
  const path = extractPathFromUrl(url);
  
  const { error } = await supabase.storage
    .from('images')
    .remove([path]);
    
  if (error) throw error;
  */
  
  // Nettoyer les URLs d'objet si nécessaire
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Crée une image de placeholder avec initiales
 */
export function createAvatarPlaceholder(
  name: string, 
  size: number = 200, 
  backgroundColor: string = '#3b82f6'
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  canvas.width = size;
  canvas.height = size;
  
  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, size, size);
  
  // Text
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.4}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
    
  ctx.fillText(initials, size / 2, size / 2);
  
  return canvas.toDataURL('image/png');
}
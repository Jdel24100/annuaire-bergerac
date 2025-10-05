import React from 'react';
import { 
  optimizeImage,
  optimizeMultipleImages,
  uploadOptimizedImage,
  previewOptimization,
  supportsAVIF,
  supportsWebP,
  ImageOptimizationOptions,
  OptimizedImageResult,
  ImageOptimizationError
} from '../utils/imageOptimizer';

export interface UseImageOptimizationOptions {
  bucketName?: string;
  folder?: string;
  autoUpload?: boolean;
  showProgress?: boolean;
}

export interface OptimizationState {
  isOptimizing: boolean;
  isUploading: boolean;
  progress: number;
  error: string | null;
  result: OptimizedImageResult | null;
  previewData: any;
  formatSupport: { avif: boolean; webp: boolean };
}

export function useImageOptimization(options: UseImageOptimizationOptions = {}) {
  const {
    bucketName = 'images',
    folder = 'optimized',
    autoUpload = true,
    showProgress = true
  } = options;

  const [state, setState] = React.useState<OptimizationState>({
    isOptimizing: false,
    isUploading: false,
    progress: 0,
    error: null,
    result: null,
    previewData: null,
    formatSupport: { avif: false, webp: false }
  });

  const [optimizationQueue, setOptimizationQueue] = React.useState<File[]>([]);
  const [currentBatch, setCurrentBatch] = React.useState<OptimizedImageResult[]>([]);

  // Détecter le support des formats modernes au montage
  React.useEffect(() => {
    const checkSupport = async () => {
      const [avif, webp] = await Promise.all([
        supportsAVIF(),
        supportsWebP()
      ]);
      
      setState(prev => ({
        ...prev,
        formatSupport: { avif, webp }
      }));
    };
    
    checkSupport();
  }, []);

  // Réinitialiser l'état
  const reset = React.useCallback(() => {
    setState({
      isOptimizing: false,
      isUploading: false,
      progress: 0,
      error: null,
      result: null,
      previewData: null,
      formatSupport: state.formatSupport
    });
    setOptimizationQueue([]);
    setCurrentBatch([]);
  }, [state.formatSupport]);

  // Prévisualiser l'optimisation
  const preview = React.useCallback(async (
    file: File, 
    optimizationOptions: ImageOptimizationOptions = {}
  ) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      const previewData = await previewOptimization(file, optimizationOptions);
      setState(prev => ({ ...prev, previewData }));
      return previewData;
    } catch (error) {
      const errorMessage = error instanceof ImageOptimizationError 
        ? error.message 
        : 'Erreur lors de la prévisualisation';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Optimiser une seule image
  const optimizeSingle = React.useCallback(async (
    file: File,
    optimizationOptions: ImageOptimizationOptions = {},
    onUploadComplete?: (url: string, result: OptimizedImageResult) => void
  ): Promise<OptimizedImageResult> => {
    setState(prev => ({
      ...prev,
      isOptimizing: true,
      progress: 0,
      error: null,
      result: null
    }));

    try {
      // Simulation du progrès si demandé
      let progressInterval: NodeJS.Timeout | null = null;
      
      if (showProgress) {
        progressInterval = setInterval(() => {
          setState(prev => ({
            ...prev,
            progress: Math.min(prev.progress + 15, 85)
          }));
        }, 200);
      }

      // Optimisation
      const result = await optimizeImage(file, optimizationOptions);
      
      if (progressInterval) {
        clearInterval(progressInterval);
      }

      setState(prev => ({
        ...prev,
        progress: 100,
        result,
        isOptimizing: false
      }));

      // Upload automatique si activé
      if (autoUpload) {
        const uploadResult = await uploadSingle(result);
        onUploadComplete?.(uploadResult.mainUrl, result);
        return result;
      }

      return result;

    } catch (error) {
      setState(prev => ({
        ...prev,
        isOptimizing: false,
        progress: 0,
        error: error instanceof ImageOptimizationError 
          ? error.message 
          : 'Erreur lors de l\'optimisation'
      }));
      throw error;
    }
  }, [autoUpload, showProgress]);

  // Upload d'un résultat d'optimisation
  const uploadSingle = React.useCallback(async (
    result: OptimizedImageResult
  ): Promise<{ mainUrl: string; thumbnailUrls?: any }> => {
    setState(prev => ({
      ...prev,
      isUploading: true,
      progress: 0
    }));

    try {
      // Simulation du progrès d'upload
      let uploadInterval: NodeJS.Timeout | null = null;
      
      if (showProgress) {
        uploadInterval = setInterval(() => {
          setState(prev => ({
            ...prev,
            progress: Math.min(prev.progress + 10, 90)
          }));
        }, 300);
      }

      const uploadResult = await uploadOptimizedImage(result, bucketName, folder);
      
      if (uploadInterval) {
        clearInterval(uploadInterval);
      }

      setState(prev => ({
        ...prev,
        progress: 100,
        isUploading: false
      }));

      return uploadResult;

    } catch (error) {
      setState(prev => ({
        ...prev,
        isUploading: false,
        progress: 0,
        error: 'Erreur lors de l\'upload'
      }));
      throw error;
    }
  }, [bucketName, folder, showProgress]);

  // Optimiser plusieurs images (batch)
  const optimizeMultiple = React.useCallback(async (
    files: File[],
    optimizationOptions: ImageOptimizationOptions = {},
    onProgress?: (completed: number, total: number, currentFile: string) => void,
    onBatchComplete?: (results: OptimizedImageResult[]) => void
  ): Promise<OptimizedImageResult[]> => {
    setState(prev => ({
      ...prev,
      isOptimizing: true,
      progress: 0,
      error: null
    }));

    setOptimizationQueue(files);
    setCurrentBatch([]);

    try {
      const results = await optimizeMultipleImages(
        files, 
        optimizationOptions,
        (completed, total, currentFile) => {
          const progress = (completed / total) * 100;
          setState(prev => ({ ...prev, progress }));
          onProgress?.(completed, total, currentFile);
        }
      );

      setState(prev => ({
        ...prev,
        isOptimizing: false,
        progress: 100
      }));

      setCurrentBatch(results);
      onBatchComplete?.(results);

      return results;

    } catch (error) {
      setState(prev => ({
        ...prev,
        isOptimizing: false,
        progress: 0,
        error: 'Erreur lors de l\'optimisation batch'
      }));
      throw error;
    }
  }, []);

  // Upload d'un batch de résultats
  const uploadBatch = React.useCallback(async (
    results: OptimizedImageResult[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<Array<{ mainUrl: string; thumbnailUrls?: any }>> => {
    setState(prev => ({
      ...prev,
      isUploading: true,
      progress: 0
    }));

    const uploadResults: Array<{ mainUrl: string; thumbnailUrls?: any }> = [];

    try {
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const uploadResult = await uploadOptimizedImage(result, bucketName, folder);
        uploadResults.push(uploadResult);

        const progress = ((i + 1) / results.length) * 100;
        setState(prev => ({ ...prev, progress }));
        onProgress?.(i + 1, results.length);
      }

      setState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100
      }));

      return uploadResults;

    } catch (error) {
      setState(prev => ({
        ...prev,
        isUploading: false,
        progress: 0,
        error: 'Erreur lors de l\'upload batch'
      }));
      throw error;
    }
  }, [bucketName, folder]);

  // Obtenir les recommandations d'optimisation
  const getRecommendations = React.useCallback((file: File) => {
    const recommendations: string[] = [];
    
    // Recommandations basées sur la taille
    if (file.size > 5 * 1024 * 1024) {
      recommendations.push('Fichier volumineux: réduire la qualité à 75-80%');
    }
    
    // Recommandations basées sur le format
    if (file.type === 'image/png' && file.size > 1024 * 1024) {
      recommendations.push('PNG volumineux: considérer JPEG ou WebP');
    }
    
    if (file.type === 'image/gif') {
      recommendations.push('GIF détecté: considérer MP4 ou WebP pour les animations');
    }

    // Recommandations basées sur le support des formats
    if (state.formatSupport.avif) {
      recommendations.push('AVIF supporté: économies importantes possibles');
    } else if (state.formatSupport.webp) {
      recommendations.push('WebP supporté: bonne alternative moderne');
    }

    return recommendations;
  }, [state.formatSupport]);

  // Obtenir des statistiques globales
  const getStats = React.useCallback(() => {
    if (currentBatch.length === 0) return null;

    const totalOriginalSize = currentBatch.reduce((sum, r) => sum + r.original.size, 0);
    const totalOptimizedSize = currentBatch.reduce((sum, r) => sum + r.optimized.size, 0);
    const totalSavings = totalOriginalSize - totalOptimizedSize;
    const averageCompression = (totalSavings / totalOriginalSize) * 100;

    return {
      processedImages: currentBatch.length,
      totalOriginalSize,
      totalOptimizedSize,
      totalSavings,
      averageCompression,
      formats: currentBatch.reduce((acc, r) => {
        const format = r.optimized.format.split('/')[1];
        acc[format] = (acc[format] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }, [currentBatch]);

  return {
    // État
    ...state,
    optimizationQueue,
    currentBatch,

    // Actions principales
    optimizeSingle,
    optimizeMultiple,
    uploadSingle,
    uploadBatch,
    preview,

    // Utilitaires
    reset,
    getRecommendations,
    getStats,

    // État dérivé
    isProcessing: state.isOptimizing || state.isUploading,
    hasResults: state.result !== null || currentBatch.length > 0,
    canUpload: state.result !== null || currentBatch.length > 0
  };
}
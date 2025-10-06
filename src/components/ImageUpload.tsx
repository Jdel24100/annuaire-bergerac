import React from 'react';
import { Upload, X, Camera, Image as ImageIcon, AlertCircle, Check, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { 
  processImageFile, 
  ImageUploadError, 
  formatFileSize, 
  uploadImageToStorage,
  ImageUploadOptions 
} from '../utils/imageUpload';
// import { OptimizedImageUpload } from './OptimizedImageUpload'; // Temporairement désactivé

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string | null) => void;
  options?: ImageUploadOptions;
  className?: string;
  placeholder?: string;
  variant?: 'avatar' | 'cover' | 'gallery';
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  options = {},
  className = '',
  placeholder = 'Cliquez pour ajouter une image',
  variant = 'avatar',
  disabled = false
}: ImageUploadProps) {
  // Composant d'upload simple (OptimizedImageUpload temporairement désactivé)
  const useOptimized = false;

  if (useOptimized) {
    // Temporairement désactivé - composant manquant
    console.warn('OptimizedImageUpload component not available');
  }

  // Ancien code pour compatibilité...
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [preview, setPreview] = React.useState<string | null>(value || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Configuration par défaut selon la variante
  const getDefaultOptions = (): ImageUploadOptions => {
    switch (variant) {
      case 'avatar':
        return {
          maxSize: 2 * 1024 * 1024, // 2MB
          maxWidth: 500,
          maxHeight: 500,
          quality: 0.9,
          ...options
        };
      case 'cover':
        return {
          maxSize: 5 * 1024 * 1024, // 5MB
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.85,
          ...options
        };
      case 'gallery':
        return {
          maxSize: 8 * 1024 * 1024, // 8MB
          maxWidth: 2048,
          maxHeight: 2048,
          quality: 0.85,
          ...options
        };
      default:
        return options;
    }
  };

  const uploadOptions = getDefaultOptions();

  const handleFileSelect = async (file: File) => {
    if (disabled) return;

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Traitement de l'image
      const result = await processImageFile(file, uploadOptions);
      setPreview(result.dataUrl);
      setUploadProgress(50);

      // Simulation d'upload avec progression
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload vers le stockage
      const uploadedUrl = await uploadImageToStorage(result.file, 
        variant === 'avatar' ? 'avatars' : 
        variant === 'cover' ? 'covers' : 'gallery'
      );

      clearInterval(uploadInterval);
      setUploadProgress(100);

      // Attendre un peu pour montrer la completion
      setTimeout(() => {
        onChange(uploadedUrl);
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);

    } catch (err) {
      setIsUploading(false);
      setUploadProgress(0);
      setPreview(value || null);

      if (err instanceof ImageUploadError) {
        setError(err.message);
      } else {
        setError('Erreur lors de l\'upload de l\'image');
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const removeImage = () => {
    if (disabled || isUploading) return;
    
    setPreview(null);
    onChange(null);
    setError(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const getContainerClasses = () => {
    const baseClasses = "relative border-2 border-dashed rounded-lg transition-all cursor-pointer";
    
    if (disabled) {
      return `${baseClasses} border-muted bg-muted/20 cursor-not-allowed`;
    }
    
    if (isDragging) {
      return `${baseClasses} border-primary bg-primary/10`;
    }
    
    if (error) {
      return `${baseClasses} border-destructive bg-destructive/10`;
    }
    
    return `${baseClasses} border-border hover:border-primary hover:bg-muted/50`;
  };

  const renderContent = () => {
    if (preview && !isUploading) {
      return (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className={`w-full h-full object-cover rounded-lg ${
              variant === 'avatar' ? 'aspect-square' : 
              variant === 'cover' ? 'aspect-video' : 'aspect-square'
            }`}
          />
          
          {!disabled && (
            <>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      openFileDialog();
                    }}
                  >
                    <Camera className="w-4 h-4 mr-1" />
                    Changer
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>
      );
    }

    if (isUploading) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-sm font-medium mb-2">Upload en cours...</p>
          <Progress value={uploadProgress} className="w-full max-w-xs" />
          <p className="text-xs text-muted-foreground mt-2">{uploadProgress}%</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          {variant === 'avatar' ? (
            <Camera className="w-6 h-6 text-muted-foreground" />
          ) : (
            <ImageIcon className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        
        <p className="font-medium mb-1">{placeholder}</p>
        <p className="text-sm text-muted-foreground mb-4">
          Glissez-déposez ou cliquez pour parcourir
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">
            Max: {formatFileSize(uploadOptions.maxSize || 5 * 1024 * 1024)}
          </Badge>
          <Badge variant="outline">
            JPG, PNG, GIF, WebP
          </Badge>
          {uploadOptions.maxWidth && uploadOptions.maxHeight && (
            <Badge variant="outline">
              Max: {uploadOptions.maxWidth}x{uploadOptions.maxHeight}px
            </Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      <div
        className={getContainerClasses()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        {renderContent()}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {error && (
        <Alert className="mt-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isUploading && uploadProgress === 100 && (
        <Alert className="mt-4">
          <Check className="h-4 w-4" />
          <AlertDescription>Image uploadée avec succès !</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
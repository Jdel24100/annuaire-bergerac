import React from 'react';
import { 
  Upload, 
  X, 
  Zap, 
  Download, 
  TrendingDown, 
  FileImage, 
  Settings,
  Info,
  CheckCircle,
  AlertCircle,
  Loader2,
  BarChart3
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { 
  formatFileSize, 
  formatCompressionRatio,
  ImageOptimizationOptions
} from '../utils/imageOptimizer';
import { useImageOptimization } from '../hooks/useImageOptimization';

interface ImageBatchOptimizerProps {
  onComplete?: (results: Array<{ url: string; originalName: string }>) => void;
  bucketName?: string;
  folder?: string;
  maxFiles?: number;
  className?: string;
}

export function ImageBatchOptimizer({
  onComplete,
  bucketName = 'images',
  folder = 'batch',
  maxFiles = 10,
  className = ''
}: ImageBatchOptimizerProps) {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [optimizationOptions, setOptimizationOptions] = React.useState<ImageOptimizationOptions>({
    format: 'auto',
    quality: 0.85,
    maxWidth: 1920,
    maxHeight: 1920,
    progressive: true,
    generateThumbnails: false
  });
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [processingStep, setProcessingStep] = React.useState<'select' | 'optimize' | 'upload' | 'complete'>('select');

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    isOptimizing,
    isUploading,
    progress,
    error,
    currentBatch,
    formatSupport,
    optimizeMultiple,
    uploadBatch,
    getStats,
    getRecommendations,
    reset
  } = useImageOptimization({
    bucketName,
    folder,
    autoUpload: false
  });

  // Gestion de la sélection de fichiers
  const handleFileSelect = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length + selectedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} fichiers autorisés`);
      return;
    }

    setSelectedFiles(prev => [...prev, ...imageFiles]);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFileSelect(event.target.files);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      handleFileSelect(event.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setSelectedFiles([]);
    reset();
    setProcessingStep('select');
  };

  // Démarrer l'optimisation
  const startOptimization = async () => {
    if (selectedFiles.length === 0) return;

    setProcessingStep('optimize');
    
    try {
      await optimizeMultiple(
        selectedFiles,
        optimizationOptions,
        (completed, total, currentFile) => {
          // Le progrès est géré par le hook
        }
      );
      setProcessingStep('upload');
    } catch (error) {
      console.error('Erreur optimisation:', error);
    }
  };

  // Démarrer l'upload
  const startUpload = async () => {
    if (currentBatch.length === 0) return;

    try {
      const uploadResults = await uploadBatch(currentBatch);
      
      const results = uploadResults.map((result, index) => ({
        url: result.mainUrl,
        originalName: selectedFiles[index]?.name || `image_${index}`
      }));

      setProcessingStep('complete');
      onComplete?.(results);
    } catch (error) {
      console.error('Erreur upload:', error);
    }
  };

  // Statistiques globales
  const stats = getStats();

  const renderFileList = () => {
    if (selectedFiles.length === 0) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Fichiers sélectionnés ({selectedFiles.length})</span>
            <Button variant="outline" size="sm" onClick={clearAll}>
              <X className="w-4 h-4 mr-1" />
              Tout effacer
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileImage className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium truncate max-w-48">
                        {file.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getRecommendations(file).length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <Info className="w-3 h-3 mr-1" />
                        {getRecommendations(file).length}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  };

  const renderAdvancedOptions = () => (
    <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full">
          <Settings className="w-4 h-4 mr-2" />
          Options d'optimisation
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="mt-4">
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Format de sortie</Label>
                <Select 
                  value={optimizationOptions.format || 'auto'}
                  onValueChange={(value) => setOptimizationOptions({
                    ...optimizationOptions,
                    format: value as any
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">
                      Automatique {formatSupport.avif ? '(AVIF)' : '(WebP/JPEG)'}
                    </SelectItem>
                    <SelectItem value="avif" disabled={!formatSupport.avif}>
                      AVIF {!formatSupport.avif && '(non supporté)'}
                    </SelectItem>
                    <SelectItem value="webp" disabled={!formatSupport.webp}>
                      WebP {!formatSupport.webp && '(non supporté)'}
                    </SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">
                  Qualité ({Math.round((optimizationOptions.quality || 0.85) * 100)}%)
                </Label>
                <Slider
                  value={[(optimizationOptions.quality || 0.85) * 100]}
                  onValueChange={([value]) => setOptimizationOptions({
                    ...optimizationOptions,
                    quality: value / 100
                  })}
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Largeur max (px)</Label>
                <Select 
                  value={optimizationOptions.maxWidth?.toString() || '1920'}
                  onValueChange={(value) => setOptimizationOptions({
                    ...optimizationOptions,
                    maxWidth: parseInt(value)
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="800">800px</SelectItem>
                    <SelectItem value="1024">1024px</SelectItem>
                    <SelectItem value="1920">1920px</SelectItem>
                    <SelectItem value="2048">2048px</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Hauteur max (px)</Label>
                <Select 
                  value={optimizationOptions.maxHeight?.toString() || '1920'}
                  onValueChange={(value) => setOptimizationOptions({
                    ...optimizationOptions,
                    maxHeight: parseInt(value)
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="600">600px</SelectItem>
                    <SelectItem value="1024">1024px</SelectItem>
                    <SelectItem value="1920">1920px</SelectItem>
                    <SelectItem value="2048">2048px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm">JPEG progressif</Label>
              <Switch
                checked={optimizationOptions.progressive}
                onCheckedChange={(checked) => setOptimizationOptions({
                  ...optimizationOptions,
                  progressive: checked
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm">Générer des miniatures</Label>
              <Switch
                checked={optimizationOptions.generateThumbnails}
                onCheckedChange={(checked) => setOptimizationOptions({
                  ...optimizationOptions,
                  generateThumbnails: checked
                })}
              />
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );

  const renderStats = () => {
    if (!stats) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Statistiques d'optimisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-xs text-muted-foreground">Taille originale</Label>
              <div className="font-medium">{formatFileSize(stats.totalOriginalSize)}</div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Taille optimisée</Label>
              <div className="font-medium text-green-600">
                {formatFileSize(stats.totalOptimizedSize)}
              </div>
            </div>
            <div className="col-span-2">
              <Label className="text-xs text-muted-foreground">Économies totales</Label>
              <div className="flex items-center gap-2">
                <div className="font-medium text-green-600">
                  -{formatFileSize(stats.totalSavings)}
                </div>
                <Badge variant="secondary">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  {formatCompressionRatio(stats.averageCompression)}
                </Badge>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Formats utilisés</Label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(stats.formats).map(([format, count]) => (
                <Badge key={format} variant="outline" className="text-xs">
                  {format.toUpperCase()}: {count}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderProgress = () => {
    if (processingStep === 'select') return null;

    const stepText = {
      optimize: 'Optimisation des images...',
      upload: 'Upload vers le serveur...',
      complete: 'Terminé !'
    }[processingStep];

    const isActive = isOptimizing || isUploading;

    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            {isActive ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            ) : processingStep === 'complete' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Zap className="w-5 h-5 text-primary" />
            )}
            <span className="font-medium">{stepText}</span>
          </div>
          
          {isActive && (
            <>
              <Progress value={progress} className="mb-2" />
              <div className="text-xs text-muted-foreground text-center">
                {progress}%
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderActions = () => {
    if (processingStep === 'complete') {
      return (
        <div className="flex gap-2">
          <Button onClick={clearAll} variant="outline" className="flex-1">
            Nouveau batch
          </Button>
        </div>
      );
    }

    if (processingStep === 'upload') {
      return (
        <div className="flex gap-2">
          <Button 
            onClick={startUpload} 
            disabled={isUploading || currentBatch.length === 0}
            className="flex-1"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Uploader les images
              </>
            )}
          </Button>
        </div>
      );
    }

    if (processingStep === 'optimize') {
      return null; // Pas d'actions pendant l'optimisation
    }

    return (
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          disabled={selectedFiles.length >= maxFiles}
        >
          <Upload className="w-4 h-4 mr-2" />
          Ajouter des images
        </Button>
        <Button 
          onClick={startOptimization}
          disabled={selectedFiles.length === 0 || isOptimizing}
          className="flex-1"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Optimisation...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Optimiser ({selectedFiles.length})
            </>
          )}
        </Button>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Zone de drop */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          selectedFiles.length >= maxFiles 
            ? 'border-muted cursor-not-allowed' 
            : 'border-border hover:border-primary cursor-pointer'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => {
          if (selectedFiles.length < maxFiles) {
            fileInputRef.current?.click();
          }
        }}
      >
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-medium mb-2">
              {selectedFiles.length >= maxFiles 
                ? `Maximum ${maxFiles} fichiers atteint`
                : 'Glissez-déposez vos images ici'
              }
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Optimisation automatique avec compression AVIF/WebP
            </p>
            <div className="flex justify-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">Max: {maxFiles} fichiers</Badge>
              <Badge variant="outline">JPG, PNG, WebP</Badge>
              {formatSupport.avif && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  AVIF ✨
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Liste des fichiers */}
      {renderFileList()}

      {/* Options avancées */}
      {selectedFiles.length > 0 && renderAdvancedOptions()}

      {/* Progrès */}
      {renderProgress()}

      {/* Statistiques */}
      {renderStats()}

      {/* Erreurs */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      {renderActions()}
    </div>
  );
}
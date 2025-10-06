import React from 'react';
import { 
  Upload, 
  Download, 
  Zap, 
  RefreshCw, 
  FileImage, 
  Settings,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Loader2,
  Info
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { 
  optimizeImage,
  formatFileSize,
  formatCompressionRatio,
  ImageOptimizationOptions,
  OptimizedImageResult,
  supportsAVIF,
  supportsWebP
} from '../utils/imageOptimizer';

interface ImageConverterToolProps {
  className?: string;
  onConversionComplete?: (results: OptimizedImageResult[]) => void;
}

export function ImageConverterTool({ 
  className = '',
  onConversionComplete 
}: ImageConverterToolProps) {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [convertedResults, setConvertedResults] = React.useState<OptimizedImageResult[]>([]);
  const [isConverting, setIsConverting] = React.useState(false);
  const [conversionProgress, setConversionProgress] = React.useState(0);
  const [currentFile, setCurrentFile] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);
  const [formatSupport, setFormatSupport] = React.useState({ avif: false, webp: false });
  const [conversionOptions, setConversionOptions] = React.useState<ImageOptimizationOptions>({
    format: 'auto',
    quality: 0.85,
    maxWidth: 1920,
    maxHeight: 1920,
    progressive: true,
    generateThumbnails: false
  });
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Détecter le support des formats modernes
  React.useEffect(() => {
    const checkSupport = async () => {
      const [avif, webp] = await Promise.all([
        supportsAVIF(),
        supportsWebP()
      ]);
      setFormatSupport({ avif, webp });
    };
    checkSupport();
  }, []);

  // Gestion de la sélection de fichiers
  const handleFileSelect = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    setSelectedFiles(imageFiles);
    setConvertedResults([]);
    setError(null);
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

  // Conversion des images
  const startConversion = async () => {
    if (selectedFiles.length === 0) return;

    setIsConverting(true);
    setConversionProgress(0);
    setError(null);
    const results: OptimizedImageResult[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setCurrentFile(file.name);
        
        // Mettre à jour le progrès
        const progress = (i / selectedFiles.length) * 100;
        setConversionProgress(progress);

        try {
          const result = await optimizeImage(file, conversionOptions);
          results.push(result);
        } catch (error) {
          console.error(`Erreur conversion ${file.name}:`, error);
          // Continuer avec les autres fichiers
        }
      }

      setConversionProgress(100);
      setConvertedResults(results);
      onConversionComplete?.(results);

    } catch (error) {
      setError('Erreur lors de la conversion');
    } finally {
      setIsConverting(false);
      setCurrentFile('');
    }
  };

  // Télécharger toutes les images converties
  const downloadAll = async () => {
    if (convertedResults.length === 0) return;

    // Créer un ZIP virtuel (simple téléchargement séquentiel pour cette démo)
    for (const result of convertedResults) {
      const link = document.createElement('a');
      link.href = result.optimized.dataUrl;
      link.download = `optimized_${result.original.file.name}`;
      link.click();
      
      // Petit délai entre les téléchargements
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  // Télécharger une image spécifique
  const downloadSingle = (result: OptimizedImageResult) => {
    const link = document.createElement('a');
    link.href = result.optimized.dataUrl;
    link.download = `optimized_${result.original.file.name}`;
    link.click();
  };

  // Statistiques globales
  const getGlobalStats = () => {
    if (convertedResults.length === 0) return null;

    const totalOriginalSize = convertedResults.reduce((sum, r) => sum + r.original.size, 0);
    const totalOptimizedSize = convertedResults.reduce((sum, r) => sum + r.optimized.size, 0);
    const totalSavings = totalOriginalSize - totalOptimizedSize;
    const averageCompression = (totalSavings / totalOriginalSize) * 100;

    return {
      totalFiles: convertedResults.length,
      totalOriginalSize,
      totalOptimizedSize,
      totalSavings,
      averageCompression,
      formats: convertedResults.reduce((acc, r) => {
        const format = r.optimized.format.split('/')[1];
        acc[format] = (acc[format] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  };

  const stats = getGlobalStats();

  const renderFileList = () => {
    if (selectedFiles.length === 0) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Images à convertir ({selectedFiles.length})</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedFiles([])}
            >
              Effacer
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-48 overflow-y-auto">
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
                
                {convertedResults[index] && (
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Converti
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderAdvancedOptions = () => (
    <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full">
          <Settings className="w-4 h-4 mr-2" />
          Options de conversion
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="mt-4">
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Format de sortie</Label>
                <Select 
                  value={conversionOptions.format || 'auto'}
                  onValueChange={(value) => setConversionOptions({
                    ...conversionOptions,
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
                  Qualité ({Math.round((conversionOptions.quality || 0.85) * 100)}%)
                </Label>
                <Slider
                  value={[(conversionOptions.quality || 0.85) * 100]}
                  onValueChange={([value]) => setConversionOptions({
                    ...conversionOptions,
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
                  value={conversionOptions.maxWidth?.toString() || '1920'}
                  onValueChange={(value) => setConversionOptions({
                    ...conversionOptions,
                    maxWidth: parseInt(value)
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="800">800px</SelectItem>
                    <SelectItem value="1024">1024px</SelectItem>
                    <SelectItem value="1920">1920px (Recommandé)</SelectItem>
                    <SelectItem value="2048">2048px</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Hauteur max (px)</Label>
                <Select 
                  value={conversionOptions.maxHeight?.toString() || '1920'}
                  onValueChange={(value) => setConversionOptions({
                    ...conversionOptions,
                    maxHeight: parseInt(value)
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="600">600px</SelectItem>
                    <SelectItem value="1024">1024px</SelectItem>
                    <SelectItem value="1920">1920px (Recommandé)</SelectItem>
                    <SelectItem value="2048">2048px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm">JPEG progressif</Label>
              <Switch
                checked={conversionOptions.progressive}
                onCheckedChange={(checked) => setConversionOptions({
                  ...conversionOptions,
                  progressive: checked
                })}
              />
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );

  const renderProgress = () => {
    if (!isConverting) return null;

    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <div>
              <div className="font-medium">Conversion en cours...</div>
              {currentFile && (
                <div className="text-sm text-muted-foreground">
                  {currentFile}
                </div>
              )}
            </div>
          </div>
          
          <Progress value={conversionProgress} className="mb-2" />
          <div className="text-xs text-muted-foreground text-center">
            {conversionProgress.toFixed(0)}%
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderResults = () => {
    if (convertedResults.length === 0) return null;

    return (
      <>
        {/* Statistiques globales */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-500" />
                Résultats de conversion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {formatFileSize(stats.totalOriginalSize)}
                  </div>
                  <div className="text-sm text-muted-foreground">Taille originale</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatFileSize(stats.totalOptimizedSize)}
                  </div>
                  <div className="text-sm text-muted-foreground">Taille optimisée</div>
                </div>
              </div>

              <div className="text-center mb-4">
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -{formatCompressionRatio(stats.averageCompression)} économisé
                </Badge>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-center">
                <Button onClick={downloadAll} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger toutes les images ({stats.totalFiles})
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des résultats détaillés */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Images converties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {convertedResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm truncate max-w-48">
                      {result.original.file.name}
                    </div>
                    <div className="text-xs text-muted-foreground space-x-2">
                      <span>{formatFileSize(result.original.size)}</span>
                      <span>→</span>
                      <span className="text-green-600">{formatFileSize(result.optimized.size)}</span>
                      <Badge variant="outline" className="ml-2">
                        -{formatCompressionRatio(result.optimized.compressionRatio)}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => downloadSingle(result)}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Télécharger
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Zone de drop */}
      <Card 
        className="border-2 border-dashed border-border hover:border-primary cursor-pointer transition-colors"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-medium mb-2">
              Convertisseur d'Images
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Glissez-déposez vos images ou cliquez pour les sélectionner
            </p>
            <div className="flex justify-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">Formats : JPG, PNG, WebP</Badge>
              {formatSupport.avif && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Sortie AVIF ✨
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

      {/* Erreurs */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Bouton de conversion */}
      {selectedFiles.length > 0 && !isConverting && convertedResults.length === 0 && (
        <div className="flex justify-center">
          <Button onClick={startConversion} className="w-full">
            <Zap className="w-4 h-4 mr-2" />
            Convertir les images ({selectedFiles.length})
          </Button>
        </div>
      )}

      {/* Résultats */}
      {renderResults()}

      {/* Info sur les formats */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-1">
            <div className="font-medium">Formats de sortie automatiques :</div>
            <div className="text-xs space-y-1">
              {formatSupport.avif && <div>• AVIF : Réduction jusqu'à 90% (navigateurs modernes)</div>}
              {formatSupport.webp && <div>• WebP : Réduction jusqu'à 80% (largement supporté)</div>}
              <div>• JPEG : Fallback universel avec optimisation</div>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
import React from 'react';
import { 
  Check, 
  Info, 
  TrendingDown, 
  Zap,
  Star,
  Users,
  Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { 
  imagePresets, 
  sectorPresets, 
  getRecommendedPresets, 
  calculateExpectedSavings,
  formatConfigs,
  ImagePreset 
} from '../utils/imagePresets';
import { formatFileSize } from '../utils/imageOptimizer';

interface ImagePresetSelectorProps {
  selectedFile?: File;
  selectedPreset?: ImagePreset;
  onPresetSelect: (preset: ImagePreset) => void;
  className?: string;
  showRecommendations?: boolean;
  context?: {
    fileSize?: number;
    dimensions?: { width: number; height: number };
    usage?: string;
    sector?: string;
  };
}

export function ImagePresetSelector({
  selectedFile,
  selectedPreset,
  onPresetSelect,
  className = '',
  showRecommendations = true,
  context
}: ImagePresetSelectorProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<'all' | 'recommended' | 'standard' | 'sector'>('recommended');

  // Obtenir les presets recommandés
  const recommendedPresets = React.useMemo(() => {
    if (!selectedFile && !context) return imagePresets.slice(0, 3);
    
    const fileContext = selectedFile ? {
      fileSize: selectedFile.size,
      // On pourrait extraire les dimensions ici avec une image
      ...context
    } : context;
    
    return getRecommendedPresets(fileContext);
  }, [selectedFile, context]);

  // Catégories de presets
  const categories = {
    recommended: { 
      label: 'Recommandés', 
      presets: recommendedPresets,
      icon: <Star className="w-4 h-4" />
    },
    standard: { 
      label: 'Standards', 
      presets: imagePresets,
      icon: <ImageIcon className="w-4 h-4" />
    },
    sector: { 
      label: 'Par Secteur', 
      presets: Object.values(sectorPresets),
      icon: <Users className="w-4 h-4" />
    },
    all: { 
      label: 'Tous', 
      presets: [...imagePresets, ...Object.values(sectorPresets)],
      icon: <Zap className="w-4 h-4" />
    }
  };

  const currentPresets = categories[selectedCategory].presets;

  const renderPresetCard = (preset: ImagePreset) => {
    const isSelected = selectedPreset?.id === preset.id;
    const isRecommended = recommendedPresets.some(p => p.id === preset.id);
    
    // Calculer les économies estimées si on a un fichier
    const expectedSavings = selectedFile ? 
      calculateExpectedSavings(selectedFile, preset) : null;

    return (
      <Card 
        key={preset.id}
        className={`cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
        }`}
        onClick={() => onPresetSelect(preset)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{preset.icon}</span>
              <div>
                <h4 className="font-medium text-sm">{preset.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {preset.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {isRecommended && (
                <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Recommandé
                </Badge>
              )}
              {isSelected && (
                <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>
          </div>

          {/* Options du preset */}
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Dimensions max:</span>
              <span>{preset.options.maxWidth}×{preset.options.maxHeight}px</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Qualité:</span>
              <span>{Math.round((preset.options.quality || 0.85) * 100)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Taille max:</span>
              <span>{formatFileSize(preset.options.maxSize || 5 * 1024 * 1024)}</span>
            </div>
          </div>

          {/* Économies estimées */}
          {expectedSavings && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-700 font-medium">Économies estimées:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -{expectedSavings.savingsPercent}%
                </Badge>
              </div>
              <div className="text-xs text-green-600 mt-1">
                {formatFileSize(selectedFile.size)} → {formatFileSize(expectedSavings.estimatedSize)}
              </div>
            </div>
          )}

          {/* Cas d'usage */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Cas d'usage:</Label>
            <div className="flex flex-wrap gap-1">
              {preset.useCases.slice(0, 2).map((useCase, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {useCase}
                </Badge>
              ))}
              {preset.useCases.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{preset.useCases.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFormatInfo = () => {
    if (!selectedPreset) return null;

    const format = selectedPreset.options.format === 'auto' ? 'avif' : selectedPreset.options.format;
    const formatInfo = formatConfigs[format as keyof typeof formatConfigs];

    if (!formatInfo) return null;

    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <div className="font-medium">Format de sortie : {formatInfo.name}</div>
            <div className="text-sm text-muted-foreground">
              {formatInfo.description}
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Support:</span>
                <Badge variant={formatInfo.support > 90 ? 'default' : 'secondary'}>
                  {formatInfo.support}%
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Économies:</span>
                <span className="text-green-600">{formatInfo.savings}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-muted-foreground mb-1">Avantages:</div>
                <ul className="space-y-0.5">
                  {formatInfo.pros.slice(0, 2).map((pro, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-600" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Limites:</div>
                <ul className="space-y-0.5">
                  {formatInfo.cons.slice(0, 2).map((con, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <Info className="w-3 h-3 text-muted-foreground" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Informations sur le fichier sélectionné */}
      {selectedFile && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm truncate">{selectedFile.name}</div>
                <div className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type.split('/')[1].toUpperCase()}
                </div>
              </div>
              {showRecommendations && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Star className="w-3 h-3 mr-1" />
                  {recommendedPresets.length} recommandés
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sélecteur de catégorie */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(categories).map(([key, category]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(key as any)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            {category.icon}
            {category.label}
            <Badge variant="secondary" className="ml-1">
              {category.presets.length}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Grille des presets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">
            {categories[selectedCategory].label} 
            <span className="text-muted-foreground font-normal ml-2">
              ({currentPresets.length} options)
            </span>
          </h3>
          {selectedPreset && (
            <Badge variant="outline" className="bg-primary/5 border-primary/20">
              <Check className="w-3 h-3 mr-1" />
              {selectedPreset.name}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentPresets.map(renderPresetCard)}
        </div>
      </div>

      {/* Informations sur le preset sélectionné */}
      {selectedPreset && (
        <div className="space-y-4">
          <Separator />
          
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <span className="text-lg">{selectedPreset.icon}</span>
              Configuration : {selectedPreset.name}
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">Format</Label>
                <div className="font-medium">
                  {selectedPreset.options.format === 'auto' ? 'Automatique' : 
                   selectedPreset.options.format?.toUpperCase()}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Qualité</Label>
                <div className="font-medium">
                  {Math.round((selectedPreset.options.quality || 0.85) * 100)}%
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Résolution max</Label>
                <div className="font-medium">
                  {selectedPreset.options.maxWidth}×{selectedPreset.options.maxHeight}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Taille max</Label>
                <div className="font-medium">
                  {formatFileSize(selectedPreset.options.maxSize || 5 * 1024 * 1024)}
                </div>
              </div>
            </div>

            {/* Cas d'usage détaillés */}
            <div className="mt-4">
              <Label className="text-xs text-muted-foreground">Cas d'usage recommandés</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedPreset.useCases.map((useCase, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {useCase}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Informations sur le format */}
          {renderFormatInfo()}
        </div>
      )}
    </div>
  );
}
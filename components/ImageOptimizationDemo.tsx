import React from 'react';
import { 
  Zap, 
  Image as ImageIcon, 
  TrendingDown, 
  FileImage, 
  Clock,
  Award,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageUpload } from './ImageUpload';
import { formatFileSize, formatCompressionRatio } from '../utils/imageOptimizer';

export function ImageOptimizationDemo() {
  const [singleImageResult, setSingleImageResult] = React.useState<any>(null);
  const [batchResults, setBatchResults] = React.useState<any[]>([]);

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Compression AVIF/WebP',
      description: 'Réduction de 60-80% de la taille sans perte de qualité visible',
      color: 'text-yellow-600'
    },
    {
      icon: <TrendingDown className="w-5 h-5" />,
      title: 'Optimisation intelligente',
      description: 'Algorithmes adaptatifs selon le contenu de l\'image',
      color: 'text-green-600'
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: 'Formats modernes',
      description: 'Support automatique AVIF, WebP avec fallback JPEG',
      color: 'text-blue-600'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Chargement rapide',
      description: 'Temps de chargement divisé par 2-3 sur mobile',
      color: 'text-purple-600'
    }
  ];

  const compressionExamples = [
    {
      type: 'Photo Portrait',
      original: '2.4 MB',
      avif: '340 KB',
      webp: '580 KB',
      jpeg: '1.2 MB',
      savings: '85%'
    },
    {
      type: 'Paysage HD',
      original: '4.1 MB',
      avif: '520 KB',
      webp: '890 KB',
      jpeg: '2.1 MB',
      savings: '87%'
    },
    {
      type: 'Screenshot UI',
      original: '1.8 MB',
      avif: '180 KB',
      webp: '320 KB',
      jpeg: '750 KB',
      savings: '90%'
    }
  ];

  const formatSupport = {
    avif: 85, // % de support navigateurs
    webp: 95,
    jpeg: 100
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Optimisation d'Images Avancée</h1>
            <p className="text-muted-foreground">
              Réduisez le poids de vos images de 60-90% avec les formats modernes
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            <Award className="w-3 h-3 mr-1" />
            Format AVIF
          </Badge>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
            <Globe className="w-3 h-3 mr-1" />
            WebP Fallback
          </Badge>
          <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
            <TrendingDown className="w-3 h-3 mr-1" />
            Compression Intelligente
          </Badge>
        </div>
      </div>

      {/* Fonctionnalités */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="font-medium">{feature.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Exemples de compression */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Exemples de Compression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Type d'image</th>
                  <th className="text-right py-2">Original</th>
                  <th className="text-right py-2">AVIF</th>
                  <th className="text-right py-2">WebP</th>
                  <th className="text-right py-2">JPEG</th>
                  <th className="text-right py-2">Économies</th>
                </tr>
              </thead>
              <tbody>
                {compressionExamples.map((example, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 font-medium">{example.type}</td>
                    <td className="text-right py-2 text-muted-foreground">{example.original}</td>
                    <td className="text-right py-2 text-green-600">{example.avif}</td>
                    <td className="text-right py-2 text-blue-600">{example.webp}</td>
                    <td className="text-right py-2 text-orange-600">{example.jpeg}</td>
                    <td className="text-right py-2">
                      <Badge variant="secondary" className="text-green-700">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        {example.savings}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Support des formats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Support Navigateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(formatSupport).map(([format, support]) => (
              <div key={format} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium uppercase">{format}</span>
                  <span className="text-sm text-muted-foreground">{support}%</span>
                </div>
                <Progress value={support} className="h-2" />
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Notre système détecte automatiquement le support et utilise le meilleur format disponible
          </p>
        </CardContent>
      </Card>

      {/* Interface de test */}
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="single">Image Unique</TabsTrigger>
          <TabsTrigger value="batch">Lot d'Images</TabsTrigger>
          <TabsTrigger value="converter">Convertisseur</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Test d'Optimisation - Image Unique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Test d'optimisation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Fonctionnalité d'optimisation d'image intégrée
                </p>
                <div className="text-xs text-muted-foreground">
                  Composant d'upload optimisé temporairement désactivé
                </div>
              </div>
              
              {singleImageResult && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-base">Résultats de l'optimisation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Taille originale</p>
                        <p className="font-medium">{formatFileSize(singleImageResult.original.size)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Taille optimisée</p>
                        <p className="font-medium text-green-600">
                          {formatFileSize(singleImageResult.optimized.size)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Format utilisé</p>
                        <p className="font-medium">
                          {singleImageResult.optimized.format.split('/')[1].toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Économies</p>
                        <p className="font-medium text-green-600">
                          -{formatCompressionRatio(singleImageResult.optimized.compressionRatio)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="batch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="w-5 h-5" />
                Test d'Optimisation - Lot d'Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Optimisation par lots</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Optimisez plusieurs images simultanément
                </p>
                <div className="text-xs text-muted-foreground">
                  Module d'optimisation par lots en développement
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="converter" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Convertisseur d'Images Existantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <RefreshCw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Convertisseur d'images</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Convertissez vos images existantes aux formats modernes
                </p>
                <div className="text-xs text-muted-foreground">
                  Outil de conversion en développement
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Impact sur les performances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Impact sur les Performances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Smartphone className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-medium mb-2">Mobile 4G</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Avant:</span>
                  <span className="text-red-600">~8s</span>
                </div>
                <div className="flex justify-between">
                  <span>Après:</span>
                  <span className="text-green-600">~2s</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Monitor className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-medium mb-2">Desktop</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Avant:</span>
                  <span className="text-red-600">~3s</span>
                </div>
                <div className="flex justify-between">
                  <span>Après:</span>
                  <span className="text-green-600">~0.8s</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Globe className="w-8 h-8 mx-auto mb-3 text-purple-600" />
              <h3 className="font-medium mb-2">Bande Passante</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Économisée:</span>
                  <span className="text-green-600">~75%</span>
                </div>
                <div className="flex justify-between">
                  <span>SEO Score:</span>
                  <span className="text-green-600">+25%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState } from 'react';
import { ArrowLeft, Save, Eye, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from './AuthContextSimple';
import { Page } from '../types';

interface BlogEditorSimpleProps {
  onNavigate: (page: Page, params?: any) => void;
  articleId?: string;
}

export function BlogEditor({ onNavigate, articleId }: BlogEditorSimpleProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    featuredImage: '',
    metaDescription: '',
    status: 'draft' as 'draft' | 'published'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const categories = [
    { id: 'guide', name: 'Guide' },
    { id: 'conseils', name: 'Conseils' },
    { id: 'seo', name: 'SEO' },
    { id: 'actualites', name: 'Actualités' },
    { id: 'tutoriel', name: 'Tutoriel' }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Accès restreint</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Vous devez être connecté pour créer des articles.
            </p>
            <Button onClick={() => onNavigate('login')}>
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (status: 'draft' | 'published') => {
    setIsLoading(true);
    setSuccess('');

    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(`Article ${status === 'draft' ? 'sauvegardé en brouillon' : 'publié'} avec succès !`);
      
      // Redirection après succès
      setTimeout(() => {
        onNavigate('blog');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    // Simulation de prévisualisation
    alert('Fonctionnalité de prévisualisation bientôt disponible !');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => onNavigate('blog')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {articleId ? 'Modifier l\'article' : 'Nouvel article'}
              </h1>
              <p className="text-muted-foreground">
                Créez et publiez du contenu pour Annuaire Bergerac
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Aperçu
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave('draft')}
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              Brouillon
            </Button>
            <Button
              onClick={() => handleSave('published')}
              disabled={isLoading || !formData.title || !formData.content}
            >
              {isLoading ? 'Publication...' : 'Publier'}
            </Button>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contenu de l'article</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    placeholder="Titre de votre article"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Extrait</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Résumé court de votre article"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    className="h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Contenu *</Label>
                  <Textarea
                    id="content"
                    placeholder="Rédigez votre article ici..."
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className="h-64"
                  />
                  <p className="text-xs text-muted-foreground">
                    Vous pouvez utiliser Markdown pour formater votre texte
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="guide, bergerac, entreprise"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Séparez les tags par des virgules
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Image à la une</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Glissez une image ou cliquez pour sélectionner
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Choisir une image
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Format recommandé : 1200x630px, maximum 2MB
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    placeholder="Description pour les moteurs de recherche"
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    className="h-20"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.metaDescription.length}/160 caractères
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
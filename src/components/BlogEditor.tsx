import React from 'react';
import { ArrowLeft, Save, Eye, Image, Hash, Folder, Calendar, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { useAuth } from './AuthContextSimple';
import { Page, BlogArticle, BlogCategory, BlogTag } from '../types';

interface BlogEditorProps {
  onNavigate: (page: Page, params?: any) => void;
  articleId?: string;
}

// Mock data pour les catégories et tags
const blogCategories: BlogCategory[] = [
  { id: '1', name: 'Tips & Conseils', slug: 'tips-conseils', color: 'bg-blue-100 text-blue-800' },
  { id: '2', name: 'Actualités Locales', slug: 'actualites-locales', color: 'bg-green-100 text-green-800' },
  { id: '3', name: 'Guide Entreprise', slug: 'guide-entreprise', color: 'bg-purple-100 text-purple-800' },
  { id: '4', name: 'Événements', slug: 'evenements', color: 'bg-orange-100 text-orange-800' },
  { id: '5', name: 'Innovation', slug: 'innovation', color: 'bg-indigo-100 text-indigo-800' }
];

const blogTags: BlogTag[] = [
  { id: '1', name: 'SEO', slug: 'seo', color: 'bg-red-100 text-red-800' },
  { id: '2', name: 'Marketing', slug: 'marketing', color: 'bg-yellow-100 text-yellow-800' },
  { id: '3', name: 'Bergerac', slug: 'bergerac', color: 'bg-green-100 text-green-800' },
  { id: '4', name: 'Digital', slug: 'digital', color: 'bg-blue-100 text-blue-800' },
  { id: '5', name: 'Entrepreneur', slug: 'entrepreneur', color: 'bg-purple-100 text-purple-800' },
  { id: '6', name: 'Artisan', slug: 'artisan', color: 'bg-amber-100 text-amber-800' },
  { id: '7', name: 'Restaurant', slug: 'restaurant', color: 'bg-orange-100 text-orange-800' },
  { id: '8', name: 'Tourisme', slug: 'tourisme', color: 'bg-teal-100 text-teal-800' },
  { id: '9', name: 'Commerce', slug: 'commerce', color: 'bg-pink-100 text-pink-800' }
];

export function BlogEditor({ onNavigate, articleId }: BlogEditorProps) {
  const { user } = useAuth();
  const [article, setArticle] = React.useState<Partial<BlogArticle>>({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    categories: [],
    tags: [],
    metaDescription: '',
    slug: '',
    status: 'draft'
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('content');
  const [tinymceLoaded, setTinymceLoaded] = React.useState(false);

  // Génération automatique du slug à partir du titre
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Chargement de TinyMCE
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.tiny.cloud/1/YOUR_TINYMCE_API_KEY/tinymce/6/tinymce.min.js';
    script.onload = () => {
      setTinymceLoaded(true);
      if (window.tinymce) {
        window.tinymce.init({
          selector: '#blog-editor',
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | image link',
          content_style: 'body { font-family: Poppins, sans-serif; font-size:14px }',
          setup: (editor: any) => {
            editor.on('change', () => {
              const content = editor.getContent();
              setArticle(prev => ({ ...prev, content }));
            });
          }
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (window.tinymce) {
        window.tinymce.remove('#blog-editor');
      }
      document.head.removeChild(script);
    };
  }, []);

  // Mise à jour du slug quand le titre change
  React.useEffect(() => {
    if (article.title && !articleId) {
      setArticle(prev => ({ ...prev, slug: generateSlug(article.title) }));
    }
  }, [article.title, articleId]);

  const handleSave = async (status: 'draft' | 'published') => {
    setIsLoading(true);
    try {
      // Ici on sauvegarderait l'article
      const articleData = {
        ...article,
        status,
        authorId: user?.id,
        authorName: user?.name,
        updatedAt: new Date().toISOString(),
        publishedAt: status === 'published' ? new Date().toISOString() : article.publishedAt
      };

      console.log('Saving article:', articleData);
      
      // Simulation d'une sauvegarde
      setTimeout(() => {
        setIsLoading(false);
        if (status === 'published') {
          alert('Article publié avec succès !');
        } else {
          alert('Brouillon sauvegardé !');
        }
        onNavigate('admin');
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setArticle(prev => ({
      ...prev,
      categories: prev.categories?.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...(prev.categories || []), categoryId]
    }));
  };

  const handleTagToggle = (tagId: string) => {
    const currentTags = article.tags || [];
    if (currentTags.includes(tagId)) {
      setArticle(prev => ({
        ...prev,
        tags: prev.tags?.filter(id => id !== tagId)
      }));
    } else if (currentTags.length < 3) {
      setArticle(prev => ({
        ...prev,
        tags: [...currentTags, tagId]
      }));
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
        <p className="text-muted-foreground mb-4">
          Seuls les administrateurs peuvent créer des articles.
        </p>
        <Button onClick={() => onNavigate('home')}>
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button
            variant="ghost"
            onClick={() => onNavigate('admin')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'administration
          </Button>
          <h1 className="text-3xl font-bold">
            {articleId ? 'Modifier l\'article' : 'Nouvel article'}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave('draft')}
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder le brouillon
          </Button>
          <Button
            onClick={() => handleSave('published')}
            disabled={isLoading || !article.title || !article.content}
          >
            <Globe className="w-4 h-4 mr-2" />
            Publier
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contenu principal */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Contenu</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="preview">Aperçu</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contenu de l'article</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      value={article.title}
                      onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Titre de votre article"
                      className="text-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Extrait</Label>
                    <Textarea
                      id="excerpt"
                      value={article.excerpt}
                      onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Résumé de votre article (affiché dans la liste)"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="blog-editor">Contenu *</Label>
                    <div className="mt-2">
                      {tinymceLoaded ? (
                        <textarea
                          id="blog-editor"
                          value={article.content}
                          onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
                        />
                      ) : (
                        <div className="w-full h-[500px] bg-muted rounded-md flex items-center justify-center">
                          <p className="text-muted-foreground">Chargement de l'éditeur...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Optimisation SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="slug">Slug URL</Label>
                    <Input
                      id="slug"
                      value={article.slug}
                      onChange={(e) => setArticle(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="url-de-votre-article"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      URL finale: /blog/{article.slug}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={article.metaDescription}
                      onChange={(e) => setArticle(prev => ({ ...prev, metaDescription: e.target.value }))}
                      placeholder="Description qui apparaîtra dans les résultats Google (max 160 caractères)"
                      rows={3}
                      maxLength={160}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {article.metaDescription?.length || 0}/160 caractères
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Aperçu de l'article</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <h1>{article.title || 'Titre de l\'article'}</h1>
                    {article.featuredImage && (
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}
                    <p className="text-muted-foreground">{article.excerpt}</p>
                    <div dangerouslySetInnerHTML={{ __html: article.content || '<p>Contenu de l\'article...</p>' }} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Aperçu de l'article</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-6 bg-background">
                    {/* En-tête de l'article */}
                    <header className="mb-8">
                      <h1 className="text-4xl font-bold mb-4 text-foreground">
                        {article.title || 'Titre de l\'article'}
                      </h1>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <span>Par {article.authorName || 'Auteur'}</span>
                        <span>•</span>
                        <span>{new Date().toLocaleDateString('fr-FR')}</span>
                        <span>•</span>
                        <span>Lecture : 5 min</span>
                      </div>

                      {article.featuredImage && (
                        <div className="aspect-video rounded-lg overflow-hidden mb-8">
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {article.excerpt && (
                        <div className="prose-preview mb-8 p-6 bg-muted/30 rounded-lg border-l-4 border-primary">
                          <p className="text-lg font-normal leading-relaxed text-muted-foreground italic">
                            {article.excerpt}
                          </p>
                        </div>
                      )}
                    </header>

                    {/* Contenu de l'article */}
                    <article className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: article.content || '<p>Le contenu de l\'article apparaîtra ici...</p>' }} />
                    </article>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="mt-8 pt-8 border-t">
                        <h3 className="font-semibold mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tagId) => {
                            const tag = blogTags.find(t => t.id === tagId);
                            return tag ? (
                              <Badge key={tagId} className={tag.color}>
                                #{tag.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image à la une */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Image à la une
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  value={article.featuredImage}
                  onChange={(e) => setArticle(prev => ({ ...prev, featuredImage: e.target.value }))}
                  placeholder="URL de l'image"
                />
                {article.featuredImage && (
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={article.featuredImage}
                      alt="Image à la une"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Catégories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="w-4 h-4" />
                Catégories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {blogCategories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Switch
                      id={`category-${category.id}`}
                      checked={article.categories?.includes(category.id)}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Badge className={category.color}>
                        {category.name}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Tags (max 3)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {blogTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={article.tags?.includes(tag.id) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        article.tags?.includes(tag.id) ? tag.color : ''
                      }`}
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {article.tags?.length || 0}/3 tags sélectionnés
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Statut de publication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Publication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Statut actuel</Label>
                  <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                    {article.status === 'published' ? 'Publié' : 'Brouillon'}
                  </Badge>
                </div>
                {article.publishedAt && (
                  <div>
                    <Label>Date de publication</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Déclaration TypeScript pour TinyMCE
declare global {
  interface Window {
    tinymce: any;
  }
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Database, Users, MapPin, FileText, Settings, 
  Search, Filter, RefreshCw, ArrowRight, Eye,
  CheckCircle, Clock, Star, Building, Tag
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/client';
import { toast } from 'sonner';

interface OrganizedDatabaseBrowserProps {
  onNavigate: (page: string) => void;
}

export function OrganizedDatabaseBrowser({ onNavigate }: OrganizedDatabaseBrowserProps) {
  const [collections, setCollections] = React.useState<any>({});
  const [selectedCollection, setSelectedCollection] = React.useState<string>('overview');
  const [collectionData, setCollectionData] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOrganized, setIsOrganized] = React.useState(false);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-93b2910a`;

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  };

  const loadOverview = async () => {
    setIsLoading(true);
    try {
      const response = await apiCall('/overview');
      setCollections(response.data.collections);
      setIsOrganized(response.data.isOrganized);
      
      if (!response.data.isOrganized) {
        toast.info('Base de données non organisée. Migration recommandée.');
      }
    } catch (error) {
      console.error('Error loading overview:', error);
      toast.error('Erreur lors du chargement de l\'aperçu');
    } finally {
      setIsLoading(false);
    }
  };

  const migrateToOrganized = async () => {
    setIsLoading(true);
    try {
      await apiCall('/migrate/organized', { method: 'POST' });
      toast.success('Migration vers structure organisée terminée !');
      setTimeout(loadOverview, 1000);
    } catch (error) {
      console.error('Migration error:', error);
      toast.error('Erreur lors de la migration');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCollectionData = async (collectionType: string, params: string = '') => {
    setIsLoading(true);
    setCollectionData([]);
    
    try {
      let endpoint = '';
      
      switch (collectionType) {
        case 'users':
          endpoint = '/users';
          break;
        case 'users-admin':
          endpoint = '/users/role/admin';
          break;
        case 'users-author':
          endpoint = '/users/role/author';
          break;
        case 'users-user':
          endpoint = '/users/role/user';
          break;
        case 'listings-approved':
          endpoint = '/listings/status/approved';
          break;
        case 'listings-pending':
          endpoint = '/listings/status/pending';
          break;
        case 'listings-featured':
          endpoint = '/listings/featured';
          break;
        case 'listings-restaurants':
          endpoint = '/listings/category/Restaurants & Cafés';
          break;
        case 'listings-bergerac':
          endpoint = '/listings/city/Bergerac';
          break;
        default:
          return;
      }
      
      const response = await apiCall(endpoint + params);
      setCollectionData(response.data || []);
      
    } catch (error) {
      console.error('Error loading collection data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadOverview();
  }, []);

  React.useEffect(() => {
    if (selectedCollection !== 'overview') {
      loadCollectionData(selectedCollection);
    }
  }, [selectedCollection]);

  const filteredData = collectionData.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title?.toLowerCase().includes(query) ||
      item.name?.toLowerCase().includes(query) ||
      item.email?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Navigateur de Base de Données</h1>
          <p className="text-muted-foreground">
            Explorez vos données organisées par collection et index
          </p>
        </div>
        
        <div className="flex gap-2">
          {!isOrganized && (
            <Button onClick={migrateToOrganized} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Organiser la DB
            </Button>
          )}
          
          <Button variant="outline" onClick={loadOverview} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          
          <Button onClick={() => onNavigate('admin')}>
            Retour Admin
          </Button>
        </div>
      </div>

      {/* État de l'organisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            État de la Base de Données
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              {isOrganized ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <Clock className="w-8 h-8 text-orange-500" />
              )}
              <div>
                <div className="font-medium">
                  {isOrganized ? 'Base Organisée' : 'Base Non Organisée'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isOrganized ? 'Index et collections configurés' : 'Migration requise'}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold">{Object.keys(collections).length}</div>
              <div className="text-sm text-muted-foreground">Collections actives</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Object.values(collections).reduce((total: number, collection: any) => 
                  total + (collection.main || 0), 0
                )}
              </div>
              <div className="text-sm text-muted-foreground">Éléments principaux</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedCollection} onValueChange={setSelectedCollection}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="listings">Fiches Pro</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="search">Recherche</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Collection Utilisateurs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Utilisateurs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total</span>
                  <Badge>{collections.users?.main || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Index par rôle</span>
                  <Badge variant="outline">{collections.users?.byRole || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Index par email</span>
                  <Badge variant="outline">{collections.users?.byEmail || 0}</Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setSelectedCollection('users')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Explorer
                </Button>
              </CardContent>
            </Card>

            {/* Collection Fiches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Fiches Professionnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total</span>
                  <Badge>{collections.listings?.main || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Par catégorie</span>
                  <Badge variant="outline">{collections.listings?.byCategory || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Par ville</span>
                  <Badge variant="outline">{collections.listings?.byCity || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Mises en avant</span>
                  <Badge variant="outline">{collections.listings?.featured || 0}</Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setSelectedCollection('listings')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Explorer
                </Button>
              </CardContent>
            </Card>

            {/* Collection Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Articles & Blog
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total</span>
                  <Badge>{collections.articles?.main || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Par auteur</span>
                  <Badge variant="outline">{collections.articles?.byAuthor || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Publiés</span>
                  <Badge variant="outline">{collections.articles?.published || 0}</Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setSelectedCollection('articles')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Explorer
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="flex gap-4">
            <Select value={selectedCollection} onValueChange={setSelectedCollection}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="users">Tous les utilisateurs</SelectItem>
                <SelectItem value="users-admin">Administrateurs</SelectItem>
                <SelectItem value="users-author">Auteurs</SelectItem>
                <SelectItem value="users-user">Utilisateurs</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredData.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border-b last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings" className="space-y-4">
          <div className="flex gap-4">
            <Select value={selectedCollection} onValueChange={setSelectedCollection}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="listings-approved">Fiches approuvées</SelectItem>
                <SelectItem value="listings-pending">En attente</SelectItem>
                <SelectItem value="listings-featured">Mises en avant</SelectItem>
                <SelectItem value="listings-restaurants">Restaurants</SelectItem>
                <SelectItem value="listings-bergerac">Bergerac</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredData.map((listing, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border-b last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{listing.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {listing.category} • {listing.location?.city}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {listing.isFeatured && <Star className="w-4 h-4 text-yellow-500" />}
                      {listing.isVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                      <Badge variant={listing.isApproved ? 'default' : 'secondary'}>
                        {listing.isApproved ? 'Approuvé' : 'En attente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles" className="space-y-4">
          <Input
            placeholder="Rechercher dans les articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <div className="text-center text-muted-foreground py-8">
            Fonctionnalité d'exploration des articles en cours de développement
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <div className="text-center text-muted-foreground py-8">
            Recherche globale dans toutes les collections en cours de développement
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
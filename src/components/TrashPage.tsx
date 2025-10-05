import React from 'react';
import { 
  Trash2, 
  RotateCcw, 
  Search, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  User, 
  Building,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { TrashItem, Page } from '../types';

interface TrashPageProps {
  onNavigate: (page: Page, params?: any) => void;
}

// Données mock pour la démonstration
const mockTrashItems: TrashItem[] = [
  {
    id: '1',
    type: 'listing',
    originalId: 'listing_1',
    title: 'Restaurant Le Bergeracois',
    deletedBy: 'admin@bergerac.fr',
    deletedAt: '2024-01-15T14:30:00Z',
    restoreData: {
      category: 'Restaurants',
      description: 'Restaurant traditionnel au cœur de Bergerac'
    }
  },
  {
    id: '2',
    type: 'article',
    originalId: 'article_1',
    title: 'Les meilleurs vignobles de la région',
    deletedBy: 'editor@bergerac.fr',
    deletedAt: '2024-01-14T09:15:00Z',
    restoreData: {
      excerpt: 'Découvrez les vignobles emblématiques...'
    }
  },
  {
    id: '3',
    type: 'listing',
    originalId: 'listing_2',
    title: 'Boulangerie Artisanale Dupont',
    deletedBy: 'admin@bergerac.fr',
    deletedAt: '2024-01-13T16:45:00Z',
    restoreData: {
      category: 'Alimentation',
      description: 'Boulangerie artisanale depuis 1950'
    }
  },
  {
    id: '4',
    type: 'user',
    originalId: 'user_1',
    title: 'Jean Martin',
    deletedBy: 'admin@bergerac.fr',
    deletedAt: '2024-01-12T11:20:00Z',
    restoreData: {
      email: 'jean.martin@example.com',
      role: 'user'
    }
  }
];

export function TrashPage({ onNavigate }: TrashPageProps) {
  const [trashItems, setTrashItems] = React.useState<TrashItem[]>(mockTrashItems);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<string>('deletedAt');
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const filteredItems = trashItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'deletedAt') {
      return new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime();
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'type') {
      return a.type.localeCompare(b.type);
    }
    return 0;
  });

  const handleRestore = async (itemId: string) => {
    try {
      // Ici on appellerait l'API pour restaurer l'élément
      setTrashItems(prev => prev.filter(item => item.id !== itemId));
      
      // Animation de sortie
      const element = document.querySelector(`[data-trash-id="${itemId}"]`);
      if (element) {
        element.classList.add('trash-item-exit');
        setTimeout(() => {
          setTrashItems(prev => prev.filter(item => item.id !== itemId));
        }, 300);
      }
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
    }
  };

  const handlePermanentDelete = async (itemId: string) => {
    try {
      // Ici on appellerait l'API pour supprimer définitivement
      setTrashItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Erreur lors de la suppression définitive:', error);
    }
  };

  const handleBulkRestore = async () => {
    try {
      setTrashItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    } catch (error) {
      console.error('Erreur lors de la restauration en masse:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setTrashItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    } catch (error) {
      console.error('Erreur lors de la suppression en masse:', error);
    }
  };

  const handleEmptyTrash = async () => {
    try {
      setTrashItems([]);
      setSelectedItems([]);
    } catch (error) {
      console.error('Erreur lors du vidage de la corbeille:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'listing':
        return <Building className="w-4 h-4" />;
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'listing':
        return 'Fiche';
      case 'article':
        return 'Article';
      case 'user':
        return 'Utilisateur';
      default:
        return 'Élément';
    }
  };

  const toggleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    if (selectedItems.length === sortedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedItems.map(item => item.id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => onNavigate('admin')} className="mb-4">
            ← Retour
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trash2 className="w-8 h-8" />
            Corbeille
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez les éléments supprimés • {trashItems.length} élément(s)
          </p>
        </div>

        {trashItems.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="hover-scale">
                <Trash2 className="w-4 h-4 mr-2" />
                Vider la corbeille
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Vider la corbeille
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action supprimera définitivement tous les éléments de la corbeille. 
                  Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleEmptyTrash} className="bg-destructive">
                  Vider définitivement
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Filters and Search */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="text-lg">Filtres et recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Type d'élément" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="listing">Fiches</SelectItem>
                <SelectItem value="article">Articles</SelectItem>
                <SelectItem value="user">Utilisateurs</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deletedAt">Date de suppression</SelectItem>
                <SelectItem value="title">Nom</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Card className="border-primary/20 bg-primary/5 animate-scale-in">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {selectedItems.length} élément(s) sélectionné(s)
                </Badge>
                <Button variant="outline" size="sm" onClick={selectAllItems}>
                  {selectedItems.length === sortedItems.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkRestore}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restaurer
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer définitivement
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer définitivement</AlertDialogTitle>
                      <AlertDialogDescription>
                        Voulez-vous vraiment supprimer définitivement ces {selectedItems.length} élément(s) ? 
                        Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive">
                        Supprimer définitivement
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trash Items */}
      <div className="space-y-4">
        {sortedItems.length === 0 ? (
          <Card className="animate-bounce-in">
            <CardContent className="text-center py-12">
              <Trash2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Corbeille vide</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== 'all' 
                  ? 'Aucun élément ne correspond à vos critères de recherche.'
                  : 'Aucun élément supprimé pour le moment.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 stagger-children">
            {sortedItems.map((item) => (
              <Card 
                key={item.id} 
                className={`trash-item hover-lift transition-smooth cursor-pointer ${
                  selectedItems.includes(item.id) ? 'ring-2 ring-primary' : ''
                }`}
                data-trash-id={item.id}
                onClick={() => toggleSelectItem(item.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="w-4 h-4 rounded border-2 border-border"
                        onClick={(e) => e.stopPropagation()}
                      />
                      
                      <div className="flex items-center gap-3">
                        {getTypeIcon(item.type)}
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {getTypeLabel(item.type)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Supprimé le {formatDate(item.deletedAt)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Par {item.deletedBy}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(item.id)}
                        className="hover-scale"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Restaurer
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer définitivement</AlertDialogTitle>
                            <AlertDialogDescription>
                              Voulez-vous vraiment supprimer définitivement "{item.title}" ? 
                              Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handlePermanentDelete(item.id)}
                              className="bg-destructive"
                            >
                              Supprimer définitivement
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {trashItems.length > 0 && (
        <Card className="bg-muted/50 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-medium mb-2">Information importante</h3>
                <p className="text-sm text-muted-foreground">
                  Les éléments dans la corbeille sont automatiquement supprimés définitivement après 30 jours. 
                  Vous pouvez restaurer ou supprimer manuellement les éléments à tout moment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
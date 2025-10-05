import React from 'react';
import { 
  Bug, Lightbulb, MessageCircle, Filter, Search, Eye, Edit,
  CheckCircle, Clock, AlertTriangle, XCircle, User, Calendar,
  FileText, Image as ImageIcon, ExternalLink, ArrowUpDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from './AuthContext';
import { Feedback, FeedbackCategory } from '../types';

interface FeedbackManagerProps {
  onNavigate?: (page: any) => void;
}

// Mock data des feedbacks
const mockFeedbacks: Feedback[] = [
  {
    id: '1',
    type: 'bug',
    title: 'Problème d\'affichage sur mobile',
    description: 'Sur mon smartphone, la page d\'accueil ne s\'affiche pas correctement. Les boutons sont coupés et le menu ne s\'ouvre pas.',
    userEmail: 'jean.dupont@email.com',
    userName: 'Jean Dupont',
    userId: 'user_123',
    status: 'nouveau',
    createdAt: '2024-02-20T10:30:00Z',
    updatedAt: '2024-02-20T10:30:00Z'
  },
  {
    id: '2',
    type: 'suggestion',
    title: 'Ajouter un système de notation',
    description: 'Il serait intéressant d\'avoir un système de notation pour les entreprises, comme sur Google. Cela aiderait les utilisateurs à choisir.',
    category: '2',
    userEmail: 'marie.martin@entreprise.com',
    userName: 'Marie Martin',
    userId: 'user_456',
    status: 'en_cours',
    adminNotes: 'En cours d\'étude avec l\'équipe technique',
    createdAt: '2024-02-18T14:15:00Z',
    updatedAt: '2024-02-19T09:20:00Z'
  },
  {
    id: '3',
    type: 'bug',
    title: 'Erreur lors de l\'inscription',
    description: 'Impossible de m\'inscrire avec mon adresse email professionnelle. Le formulaire affiche "Erreur serveur" après validation.',
    fileUrl: '/uploads/screenshot-error.png',
    userEmail: 'paul.bernard@gmail.com',
    userName: 'Paul Bernard',
    status: 'resolu',
    adminNotes: 'Bug corrigé dans la version 1.2.3',
    resolvedAt: '2024-02-17T16:45:00Z',
    createdAt: '2024-02-15T11:20:00Z',
    updatedAt: '2024-02-17T16:45:00Z'
  },
  {
    id: '4',
    type: 'suggestion',
    title: 'Recherche par géolocalisation',
    description: 'Pouvoir chercher des entreprises près de ma position actuelle serait très pratique. Comme sur les applis de livraison.',
    category: '1',
    userEmail: 'sophie.dubois@hotmail.fr',
    userName: 'Sophie Dubois',
    status: 'nouveau',
    createdAt: '2024-02-19T16:00:00Z',
    updatedAt: '2024-02-19T16:00:00Z'
  },
  {
    id: '5',
    type: 'bug',
    title: 'Lenteur de chargement',
    description: 'La page des résultats de recherche met plus de 10 secondes à se charger. C\'est très long, surtout sur mobile.',
    userEmail: 'thomas.petit@outlook.com',
    status: 'en_cours',
    adminNotes: 'Optimisation en cours côté serveur',
    createdAt: '2024-02-16T13:45:00Z',
    updatedAt: '2024-02-18T10:15:00Z'
  }
];

const feedbackCategories: FeedbackCategory[] = [
  { id: '1', name: 'Interface utilisateur', description: 'Améliorations de l\'interface', type: 'suggestion' },
  { id: '2', name: 'Nouvelles fonctionnalités', description: 'Proposer de nouvelles fonctions', type: 'suggestion' },
  { id: '3', name: 'Performance', description: 'Vitesse et optimisation', type: 'suggestion' },
  { id: '4', name: 'Mobile', description: 'Expérience mobile', type: 'suggestion' },
  { id: '5', name: 'Contenu', description: 'Amélioration du contenu', type: 'suggestion' },
  { id: '6', name: 'Autre', description: 'Autres suggestions', type: 'suggestion' }
];

export function FeedbackManager({ onNavigate }: FeedbackManagerProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selectedFeedback, setSelectedFeedback] = React.useState<Feedback | null>(null);
  const [adminNotes, setAdminNotes] = React.useState('');
  const [newStatus, setNewStatus] = React.useState('');

  const filteredFeedbacks = mockFeedbacks.filter(feedback => {
    const matchesSearch = feedback.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feedback.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feedback.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || feedback.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || feedback.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'nouveau':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Nouveau</Badge>;
      case 'en_cours':
        return <Badge className="bg-orange-100 text-orange-800"><AlertTriangle className="w-3 h-3 mr-1" />En cours</Badge>;
      case 'resolu':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Résolu</Badge>;
      case 'ferme':
        return <Badge className="bg-gray-100 text-gray-800"><XCircle className="w-3 h-3 mr-1" />Fermé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === 'bug' 
      ? <Badge variant="destructive"><Bug className="w-3 h-3 mr-1" />Bug</Badge>
      : <Badge className="bg-yellow-100 text-yellow-800"><Lightbulb className="w-3 h-3 mr-1" />Suggestion</Badge>;
  };

  const handleStatusUpdate = (feedbackId: string, status: string, notes?: string) => {
    console.log('Updating feedback status:', { feedbackId, status, notes });
    // En production, ceci ferait un appel API
    alert(`Statut mis à jour : ${status}${notes ? '\nNotes: ' + notes : ''}`);
    setSelectedFeedback(null);
    setAdminNotes('');
    setNewStatus('');
  };

  const calculateStats = () => {
    const total = mockFeedbacks.length;
    const bugs = mockFeedbacks.filter(f => f.type === 'bug').length;
    const suggestions = mockFeedbacks.filter(f => f.type === 'suggestion').length;
    const nouveau = mockFeedbacks.filter(f => f.status === 'nouveau').length;
    const enCours = mockFeedbacks.filter(f => f.status === 'en_cours').length;
    const resolu = mockFeedbacks.filter(f => f.status === 'resolu').length;

    return { total, bugs, suggestions, nouveau, enCours, resolu };
  };

  const stats = calculateStats();

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
        <p className="text-muted-foreground mb-4">
          Seuls les administrateurs peuvent accéder à la gestion des feedbacks.
        </p>
        <Button onClick={() => onNavigate?.('home')}>
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Feedbacks</h2>
          <p className="text-muted-foreground">
            Gérez les signalements de bugs et suggestions d'amélioration des utilisateurs
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MessageCircle className="w-6 h-6 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bugs</p>
                <p className="text-2xl font-bold text-red-600">{stats.bugs}</p>
              </div>
              <Bug className="w-6 h-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suggestions</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.suggestions}</p>
              </div>
              <Lightbulb className="w-6 h-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nouveaux</p>
                <p className="text-2xl font-bold text-blue-600">{stats.nouveau}</p>
              </div>
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En cours</p>
                <p className="text-2xl font-bold text-orange-600">{stats.enCours}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Résolus</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolu}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            <MessageCircle className="w-4 h-4 mr-2" />
            Tous ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="bugs">
            <Bug className="w-4 h-4 mr-2" />
            Bugs ({stats.bugs})
          </TabsTrigger>
          <TabsTrigger value="suggestions">
            <Lightbulb className="w-4 h-4 mr-2" />
            Suggestions ({stats.suggestions})
          </TabsTrigger>
          <TabsTrigger value="nouveau">
            <Clock className="w-4 h-4 mr-2" />
            Nouveaux ({stats.nouveau})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <FeedbackList 
            feedbacks={filteredFeedbacks}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onSelectFeedback={setSelectedFeedback}
            onStatusUpdate={handleStatusUpdate}
            getStatusBadge={getStatusBadge}
            getTypeBadge={getTypeBadge}
          />
        </TabsContent>

        <TabsContent value="bugs" className="space-y-6">
          <FeedbackList 
            feedbacks={filteredFeedbacks.filter(f => f.type === 'bug')}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            typeFilter="bug"
            setTypeFilter={setTypeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onSelectFeedback={setSelectedFeedback}
            onStatusUpdate={handleStatusUpdate}
            getStatusBadge={getStatusBadge}
            getTypeBadge={getTypeBadge}
          />
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          <FeedbackList 
            feedbacks={filteredFeedbacks.filter(f => f.type === 'suggestion')}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            typeFilter="suggestion"
            setTypeFilter={setTypeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onSelectFeedback={setSelectedFeedback}
            onStatusUpdate={handleStatusUpdate}
            getStatusBadge={getStatusBadge}
            getTypeBadge={getTypeBadge}
          />
        </TabsContent>

        <TabsContent value="nouveau" className="space-y-6">
          <FeedbackList 
            feedbacks={filteredFeedbacks.filter(f => f.status === 'nouveau')}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            statusFilter="nouveau"
            setStatusFilter={setStatusFilter}
            onSelectFeedback={setSelectedFeedback}
            onStatusUpdate={handleStatusUpdate}
            getStatusBadge={getStatusBadge}
            getTypeBadge={getTypeBadge}
          />
        </TabsContent>
      </Tabs>

      {/* Dialog de détail */}
      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedFeedback && getTypeBadge(selectedFeedback.type)}
              {selectedFeedback?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedFeedback && (
            <FeedbackDetail 
              feedback={selectedFeedback}
              adminNotes={adminNotes}
              setAdminNotes={setAdminNotes}
              newStatus={newStatus}
              setNewStatus={setNewStatus}
              onStatusUpdate={handleStatusUpdate}
              getStatusBadge={getStatusBadge}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Composant de liste des feedbacks
interface FeedbackListProps {
  feedbacks: Feedback[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onSelectFeedback: (feedback: Feedback) => void;
  onStatusUpdate: (id: string, status: string, notes?: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  getTypeBadge: (type: string) => React.ReactNode;
}

function FeedbackList({ 
  feedbacks, 
  searchQuery, 
  setSearchQuery, 
  typeFilter, 
  setTypeFilter,
  statusFilter, 
  setStatusFilter, 
  onSelectFeedback,
  onStatusUpdate,
  getStatusBadge,
  getTypeBadge 
}: FeedbackListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Liste des feedbacks</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="bug">Bugs</SelectItem>
                <SelectItem value="suggestion">Suggestions</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="nouveau">Nouveau</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="resolu">Résolu</SelectItem>
                <SelectItem value="ferme">Fermé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {feedbacks.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun feedback trouvé</h3>
            <p className="text-muted-foreground">
              Aucun feedback ne correspond à vos critères de recherche.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbacks.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell>{getTypeBadge(feedback.type)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{feedback.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {feedback.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{feedback.userName || 'Anonyme'}</div>
                      <div className="text-sm text-muted-foreground">{feedback.userEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(feedback.createdAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>{getStatusBadge(feedback.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onSelectFeedback(feedback)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Select 
                        defaultValue={feedback.status} 
                        onValueChange={(status) => onStatusUpdate(feedback.id, status)}
                      >
                        <SelectTrigger className="w-[100px] h-8">
                          <ArrowUpDown className="w-3 h-3" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nouveau">Nouveau</SelectItem>
                          <SelectItem value="en_cours">En cours</SelectItem>
                          <SelectItem value="resolu">Résolu</SelectItem>
                          <SelectItem value="ferme">Fermé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// Composant de détail d'un feedback
interface FeedbackDetailProps {
  feedback: Feedback;
  adminNotes: string;
  setAdminNotes: (notes: string) => void;
  newStatus: string;
  setNewStatus: (status: string) => void;
  onStatusUpdate: (id: string, status: string, notes?: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

function FeedbackDetail({ 
  feedback, 
  adminNotes, 
  setAdminNotes, 
  newStatus, 
  setNewStatus,
  onStatusUpdate,
  getStatusBadge 
}: FeedbackDetailProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStatusUpdate(feedback.id, newStatus || feedback.status, adminNotes);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{feedback.title}</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{feedback.userName || 'Anonyme'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{new Date(feedback.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          {getStatusBadge(feedback.status)}
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="font-semibold mb-2">Description</h4>
        <p className="text-sm bg-muted p-4 rounded-lg">{feedback.description}</p>
      </div>

      {/* Informations utilisateur */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2">Informations utilisateur</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Email :</strong> {feedback.userEmail}</div>
            {feedback.userName && <div><strong>Nom :</strong> {feedback.userName}</div>}
            {feedback.userId && <div><strong>ID :</strong> {feedback.userId}</div>}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Détails techniques</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Type :</strong> {feedback.type === 'bug' ? 'Bug' : 'Suggestion'}</div>
            {feedback.category && <div><strong>Catégorie :</strong> {feedback.category}</div>}
            <div><strong>Créé le :</strong> {new Date(feedback.createdAt).toLocaleString('fr-FR')}</div>
            <div><strong>Modifié le :</strong> {new Date(feedback.updatedAt).toLocaleString('fr-FR')}</div>
            {feedback.resolvedAt && (
              <div><strong>Résolu le :</strong> {new Date(feedback.resolvedAt).toLocaleString('fr-FR')}</div>
            )}
          </div>
        </div>
      </div>

      {/* Fichier joint */}
      {feedback.fileUrl && (
        <div>
          <h4 className="font-semibold mb-2">Fichier joint</h4>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <a 
              href={feedback.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              Voir la capture d'écran
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Notes admin existantes */}
      {feedback.adminNotes && (
        <div>
          <h4 className="font-semibold mb-2">Notes administrateur</h4>
          <p className="text-sm bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            {feedback.adminNotes}
          </p>
        </div>
      )}

      {/* Formulaire de mise à jour */}
      <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
        <h4 className="font-semibold">Mettre à jour le statut</h4>
        
        <div>
          <Label htmlFor="new-status">Nouveau statut</Label>
          <Select value={newStatus || feedback.status} onValueChange={setNewStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nouveau">Nouveau</SelectItem>
              <SelectItem value="en_cours">En cours</SelectItem>
              <SelectItem value="resolu">Résolu</SelectItem>
              <SelectItem value="ferme">Fermé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="admin-notes">Notes administrateur</Label>
          <Textarea
            id="admin-notes"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Ajoutez des notes sur le traitement de ce feedback..."
            rows={3}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="submit">
            Mettre à jour
          </Button>
        </div>
      </form>
    </div>
  );
}
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Merge,
  Eye,
  UserCheck,
  FileText,
  Shield,
  Zap,
  TrendingUp,
  Database
} from 'lucide-react';
import { ProfessionalListing } from '../types';
import { useDuplicateDetection, DuplicateMatch } from '../utils/duplicateDetection';
import { mockListings } from './mockData';

interface DuplicateManagerProps {
  onNavigate?: (page: string) => void;
}

interface DuplicateGroup {
  id: string;
  primaryListing: ProfessionalListing;
  duplicates: DuplicateMatch[];
  status: 'pending' | 'resolved' | 'dismissed';
  confidence: 'high' | 'medium' | 'low';
  lastChecked: string;
}

interface ClaimRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  claimantName: string;
  claimantEmail: string;
  siret: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  evidence?: string;
}

export function DuplicateManager({ onNavigate }: DuplicateManagerProps) {
  const [activeTab, setActiveTab] = React.useState('duplicates');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDuplicate, setSelectedDuplicate] = React.useState<DuplicateGroup | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [siretSearch, setSiretSearch] = React.useState('');
  
  const { checkDuplicates, validateSiret, isChecking } = useDuplicateDetection();

  // Données simulées de doublons détectés
  const mockDuplicateGroups: DuplicateGroup[] = [
    {
      id: 'dup-1',
      primaryListing: mockListings[0],
      duplicates: [
        {
          id: 'dup-match-1',
          listing: mockListings[1],
          matchScore: 0.92,
          matchReasons: ['Nom quasi-identique', 'Téléphone identique', 'Adresse similaire'],
          confidence: 'high'
        }
      ],
      status: 'pending',
      confidence: 'high',
      lastChecked: '2025-01-06T10:00:00Z'
    },
    {
      id: 'dup-2',
      primaryListing: mockListings[2],
      duplicates: [
        {
          id: 'dup-match-2',
          listing: mockListings[3],
          matchScore: 0.75,
          matchReasons: ['Adresse très similaire', 'Catégorie identique'],
          confidence: 'medium'
        }
      ],
      status: 'pending',
      confidence: 'medium',
      lastChecked: '2025-01-06T09:30:00Z'
    }
  ];

  // Données simulées de revendications
  const mockClaimRequests: ClaimRequest[] = [
    {
      id: 'claim-1',
      listingId: 'listing-1',
      listingTitle: 'Restaurant Le Cyrano',
      claimantName: 'Jean Dupont',
      claimantEmail: 'jean.dupont@cyrano-bergerac.fr',
      siret: '12345678901234',
      status: 'pending',
      submittedAt: '2025-01-05T14:30:00Z',
      evidence: 'Je suis le propriétaire de ce restaurant depuis 2018. Voici mon SIRET officiel.'
    },
    {
      id: 'claim-2',
      listingId: 'listing-2',
      listingTitle: 'Boulangerie Martin',
      claimantName: 'Marie Martin',
      claimantEmail: 'marie@boulangerie-martin.fr',
      siret: '98765432109876',
      status: 'pending',
      submittedAt: '2025-01-04T16:45:00Z',
      evidence: 'Cette boulangerie m\'appartient. Je peux fournir les documents officiels.'
    }
  ];

  const [duplicateGroups] = React.useState(mockDuplicateGroups);
  const [claimRequests] = React.useState(mockClaimRequests);

  const filteredDuplicates = duplicateGroups.filter(group =>
    group.primaryListing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.duplicates.some(dup => 
      dup.listing.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const runFullDuplicateCheck = async () => {
    setIsProcessing(true);
    try {
      // Simulation de vérification complète
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('Vérification complète des doublons terminée');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMergeDuplicates = async (groupId: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`Fusion des doublons du groupe ${groupId}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDismissDuplicate = async (groupId: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Doublon ${groupId} rejeté`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClaimApproval = async (claimId: string, approved: boolean) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`Revendication ${claimId} ${approved ? 'approuvée' : 'rejetée'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSiretValidation = async () => {
    if (!siretSearch) return;
    
    try {
      const result = await validateSiret(siretSearch);
      console.log('Résultat validation SIRET:', result);
    } catch (error) {
      console.error('Erreur validation SIRET:', error);
    }
  };

  const getConfidenceBadge = (confidence: 'high' | 'medium' | 'low') => {
    const variants = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };

    const labels = {
      high: 'Très probable',
      medium: 'Probable',
      low: 'Possible'
    };

    return (
      <Badge className={variants[confidence]}>
        {labels[confidence]}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>;
      case 'resolved':
        return <Badge className="bg-blue-100 text-blue-800">Résolu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Doublons & Revendications</h1>
          <p className="text-muted-foreground">
            Détection automatique des doublons et gestion des revendications de fiches
          </p>
        </div>
        <Button 
          onClick={runFullDuplicateCheck} 
          disabled={isProcessing}
          className="bg-primary hover:bg-primary/90"
        >
          {isProcessing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Search className="w-4 h-4 mr-2" />
          )}
          Analyser Tous les Doublons
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Doublons Détectés</p>
                <p className="text-2xl font-bold text-red-600">{duplicateGroups.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revendications</p>
                <p className="text-2xl font-bold text-yellow-600">{claimRequests.length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Haute Confiance</p>
                <p className="text-2xl font-bold text-orange-600">
                  {duplicateGroups.filter(g => g.confidence === 'high').length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">SIRET Validés</p>
                <p className="text-2xl font-bold text-green-600">127</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="duplicates">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Doublons ({duplicateGroups.length})
          </TabsTrigger>
          <TabsTrigger value="claims">
            <UserCheck className="w-4 h-4 mr-2" />
            Revendications ({claimRequests.length})
          </TabsTrigger>
          <TabsTrigger value="siret">
            <FileText className="w-4 h-4 mr-2" />
            Validation SIRET
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytiques
          </TabsTrigger>
        </TabsList>

        {/* Onglet Doublons */}
        <TabsContent value="duplicates" className="space-y-6">
          {/* Barre de recherche */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les doublons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Liste des groupes de doublons */}
          <div className="space-y-4">
            {filteredDuplicates.map((group) => (
              <Card key={group.id} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{group.primaryListing.title}</CardTitle>
                      {getConfidenceBadge(group.confidence)}
                      {getStatusBadge(group.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDuplicate(group)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir Détails
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMergeDuplicates(group.id)}
                        disabled={isProcessing}
                      >
                        <Merge className="w-4 h-4 mr-2" />
                        Fusionner
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDismissDuplicate(group.id)}
                        disabled={isProcessing}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rejeter
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {group.duplicates.length} correspondance(s) trouvée(s) - 
                    Dernière vérification : {new Date(group.lastChecked).toLocaleDateString('fr-FR')}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {group.duplicates.map((duplicate) => (
                      <div key={duplicate.id} className="p-3 border rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{duplicate.listing.title}</h4>
                          <div className="flex items-center gap-2">
                            <Progress value={duplicate.matchScore * 100} className="w-20 h-2" />
                            <span className="text-sm font-medium">
                              {Math.round(duplicate.matchScore * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {duplicate.matchReasons.map((reason, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDuplicates.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun doublon trouvé</h3>
                <p className="text-muted-foreground">
                  Tous les doublons ont été traités ou aucun doublon n'a été détecté.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Revendications */}
        <TabsContent value="claims" className="space-y-6">
          <div className="space-y-4">
            {claimRequests.map((claim) => (
              <Card key={claim.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{claim.listingTitle}</CardTitle>
                      <CardDescription>
                        Revendiquée par {claim.claimantName} ({claim.claimantEmail})
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(claim.status)}
                      <Badge variant="outline">SIRET: {claim.siret}</Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Justification :</Label>
                      <p className="text-sm text-muted-foreground mt-1">{claim.evidence}</p>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Soumis le {new Date(claim.submittedAt).toLocaleDateString('fr-FR')} à {new Date(claim.submittedAt).toLocaleTimeString('fr-FR')}
                    </div>

                    {claim.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleClaimApproval(claim.id, true)}
                          disabled={isProcessing}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approuver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleClaimApproval(claim.id, false)}
                          disabled={isProcessing}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rejeter
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Onglet Validation SIRET */}
        <TabsContent value="siret" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Validation SIRET</CardTitle>
              <CardDescription>
                Vérifiez la validité d'un numéro SIRET via l'API INSEE
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Numéro SIRET (14 chiffres)"
                  value={siretSearch}
                  onChange={(e) => setSiretSearch(e.target.value)}
                  maxLength={14}
                />
                <Button 
                  onClick={handleSiretValidation}
                  disabled={!siretSearch || isChecking}
                >
                  {isChecking ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Valider
                </Button>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Confidentialité :</strong> Les numéros SIRET ne sont jamais affichés publiquement. 
                  Ils sont utilisés uniquement pour la vérification administrative et les revendications de fiches.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques de Détection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Doublons haute confiance :</span>
                    <span className="font-medium">
                      {duplicateGroups.filter(g => g.confidence === 'high').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Doublons moyenne confiance :</span>
                    <span className="font-medium">
                      {duplicateGroups.filter(g => g.confidence === 'medium').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taux de précision :</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revendications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>En attente :</span>
                    <span className="font-medium text-yellow-600">
                      {claimRequests.filter(c => c.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approuvées :</span>
                    <span className="font-medium text-green-600">
                      {claimRequests.filter(c => c.status === 'approved').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taux d'approbation :</span>
                    <span className="font-medium">87.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
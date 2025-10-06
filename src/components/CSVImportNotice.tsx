import React from 'react';
import { 
  FileUp, 
  Download, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Copy, 
  ExternalLink,
  Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

export function CSVImportNotice() {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  // Format CSV attendu
  const csvFormat = [
    'title', 'description', 'category', 'subCategory', 'authorName', 'authorEmail',
    'email', 'phone', 'website', 'address', 'city', 'zipCode', 'lat', 'lng',
    'facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok',
    'whatsapp', 'google_business', 'doctolib', 'tripadvisor', 'ubereats',
    'price', 'highlights', 'openingHours', 'isVerified', 'subscriptionPlan'
  ];

  // Exemple de données CSV
  const csvExample = `title,description,category,subCategory,authorName,authorEmail,email,phone,website,address,city,zipCode,lat,lng,facebook,instagram,twitter,linkedin,youtube,tiktok,whatsapp,google_business,doctolib,tripadvisor,ubereats,price,highlights,openingHours,isVerified,subscriptionPlan
"Restaurant Le Bergeracois","Restaurant traditionnel du Périgord avec spécialités locales et terrasse","Restaurants","Cuisine traditionnelle","Jean Dupont","jean.dupont@email.com","contact@lebergeracois.fr","05 53 XX XX XX","https://lebergeracois.fr","15 Rue de la République","Bergerac","24100","44.8378","0.4816","https://facebook.com/lebergeracois","https://instagram.com/lebergeracois","","","","","33612345678","https://goo.gl/maps/xxx","","https://tripadvisor.com/xxx","https://ubereats.com/xxx","€€","Terrasse ombragée|Produits locaux|Cuisine maison","Lu-Ve:12:00-14:00,19:00-22:00|Sa:12:00-14:00,19:00-23:00|Di:Fermé","true","premium"
"Garage Martin","Garage automobile - Réparation et vente","Automobile","Garage automobile","Pierre Martin","p.martin@email.com","contact@garage-martin.fr","05 53 XX XX XX","https://garage-martin.fr","Zone Industrielle Sud","Bergerac","24100","44.8250","0.4950","","","","","","","","https://goo.gl/maps/yyy","","","","€","Devis gratuit|Véhicules de courtoisie|Toutes marques","Lu-Ve:08:00-12:00,14:00-18:00|Sa:08:00-12:00|Di:Fermé","false","basic"`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié dans le presse-papiers !`);
  };

  const downloadTemplate = () => {
    const headers = csvFormat.join(',');
    const template = headers + '\n' + csvExample;
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_import_fiches_bergerac.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('Modèle CSV téléchargé !');
  };

  const requiredFields = [
    { field: 'title', description: 'Nom de l\'entreprise/établissement', example: 'Restaurant Le Bergeracois' },
    { field: 'description', description: 'Description détaillée', example: 'Restaurant traditionnel du Périgord...' },
    { field: 'category', description: 'Catégorie principale', example: 'Restaurants' },
    { field: 'subCategory', description: 'Sous-catégorie', example: 'Cuisine traditionnelle' },
    { field: 'authorName', description: 'Nom du responsable', example: 'Jean Dupont' },
    { field: 'authorEmail', description: 'Email du responsable', example: 'jean.dupont@email.com' },
    { field: 'email', description: 'Email professionnel', example: 'contact@entreprise.fr' },
    { field: 'phone', description: 'Téléphone', example: '05 53 XX XX XX' },
    { field: 'address', description: 'Adresse complète', example: '15 Rue de la République' },
    { field: 'city', description: 'Ville', example: 'Bergerac' },
    { field: 'zipCode', description: 'Code postal', example: '24100' }
  ];

  const optionalFields = [
    { field: 'website', description: 'Site web', example: 'https://monsite.fr' },
    { field: 'lat', description: 'Latitude GPS', example: '44.8378' },
    { field: 'lng', description: 'Longitude GPS', example: '0.4816' },
    { field: 'facebook', description: 'Page Facebook', example: 'https://facebook.com/monentreprise' },
    { field: 'instagram', description: 'Compte Instagram', example: 'https://instagram.com/monentreprise' },
    { field: 'google_business', description: 'Google Business', example: 'https://goo.gl/maps/xxx' },
    { field: 'price', description: 'Gamme de prix', example: '€, €€ ou €€€' },
    { field: 'highlights', description: '3 points forts max', example: 'Terrasse|Produits locaux|Cuisine maison' },
    { field: 'openingHours', description: 'Horaires d\'ouverture', example: 'Lu-Ve:08:00-12:00,14:00-18:00|Sa:08:00-12:00' },
    { field: 'isVerified', description: 'Fiche vérifiée', example: 'true ou false' },
    { field: 'subscriptionPlan', description: 'Plan d\'abonnement', example: 'basic, premium, enterprise' }
  ];

  const socialNetworks = [
    'facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok', 'whatsapp',
    'google_business', 'doctolib', 'tripadvisor', 'ubereats', 'deliveroo', 'justeat'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Import CSV - Fiches Professionnelles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Importez en masse des fiches professionnelles via un fichier CSV. 
            Respectez le format ci-dessous pour un import réussi.
          </p>
          
          <div className="flex gap-2">
            <Button onClick={downloadTemplate} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Télécharger le modèle CSV
            </Button>
            <Button 
              variant="outline" 
              onClick={() => copyToClipboard(csvFormat.join(','), 'En-têtes CSV')}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copier les en-têtes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alertes importantes */}
      <div className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Encodage :</strong> Utilisez UTF-8 pour les caractères spéciaux (accents). 
            Délimiteur : virgule (,). Échappement : guillemets doubles.
          </AlertDescription>
        </Alert>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Attention :</strong> Les fiches importées seront en attente de validation admin. 
            Vérifiez les données avant l'import car les modifications en masse sont limitées.
          </AlertDescription>
        </Alert>
      </div>

      {/* Champs obligatoires */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Champs Obligatoires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requiredFields.map((field, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <Badge variant="destructive" className="mt-0.5">
                  {field.field}
                </Badge>
                <div className="flex-1">
                  <p className="font-medium">{field.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Exemple : {field.example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Champs optionnels */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-muted/20 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  Champs Optionnels ({optionalFields.length + socialNetworks.length})
                </span>
                <span className="text-sm text-muted-foreground">
                  {showAdvanced ? 'Masquer' : 'Afficher'}
                </span>
              </CardTitle>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Informations générales</h4>
                  <div className="grid gap-3">
                    {optionalFields.map((field, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 bg-muted/20 rounded">
                        <Badge variant="outline" className="mt-0.5 text-xs">
                          {field.field}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{field.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {field.example}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Réseaux sociaux et plateformes</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {socialNetworks.map((network, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {network}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    URL complètes recommandées (https://...)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Format spécial */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Formats Spéciaux</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Highlights (Points forts)</h4>
                <code className="block p-2 bg-muted rounded text-sm">
                  Terrasse ombragée|Produits locaux|Cuisine maison
                </code>
                <p className="text-xs text-muted-foreground">
                  Séparez par des pipes (|). Maximum 3 points.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Horaires d'ouverture</h4>
                <code className="block p-2 bg-muted rounded text-sm">
                  Lu-Ve:08:00-12:00,14:00-18:00|Sa:08:00-12:00|Di:Fermé
                </code>
                <p className="text-xs text-muted-foreground">
                  Format : Jour:Heure1-Heure2,Heure3-Heure4|Jour:...
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Coordonnées GPS</h4>
                <code className="block p-2 bg-muted rounded text-sm">
                  lat: 44.8378, lng: 0.4816
                </code>
                <p className="text-xs text-muted-foreground">
                  Format décimal. Utilisez Google Maps pour les obtenir.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Gamme de prix</h4>
                <code className="block p-2 bg-muted rounded text-sm">
                  € (économique), €€ (moyen), €€€ (premium)
                </code>
                <p className="text-xs text-muted-foreground">
                  Utilisez les symboles € exactement comme indiqué.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Catégories disponibles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Catégories Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {[
              'Restaurants', 'Santé & Bien-être', 'Artisans & Services', 'Commerce & Shopping',
              'Loisirs & Culture', 'Automobile', 'Immobilier', 'Beauté & Esthétique',
              'Sport & Fitness', 'Éducation & Formation', 'Juridique & Finance', 'Technologie'
            ].map((category, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Respectez exactement ces noms pour la colonne "category". 
            Les sous-catégories peuvent être personnalisées.
          </p>
        </CardContent>
      </Card>

      {/* Exemples par secteur */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Exemples par Secteur d'Activité</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="restaurant" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
              <TabsTrigger value="garage">Garage</TabsTrigger>
              <TabsTrigger value="coiffeur">Coiffeur</TabsTrigger>
              <TabsTrigger value="medecin">Médecin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="restaurant" className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Restaurant traditionnel</h4>
                <code className="text-xs block whitespace-pre-wrap">
{`"Restaurant Le Terroir","Cuisine traditionnelle périgordine avec terrasse ombragée","Restaurants","Cuisine traditionnelle","Marie Dubois","marie@terroir.fr","contact@terroir.fr","05 53 12 34 56","https://restaurant-terroir.fr","12 Place du Marché","Bergerac","24100","44.8378","0.4816","https://facebook.com/terroir","https://instagram.com/terroir","","","","","33612345678","https://goo.gl/maps/abc","","https://tripadvisor.com/terroir","https://ubereats.com/terroir","€€","Terrasse ombragée|Produits locaux|Cuisine familiale","Lu-Sa:12:00-14:00,19:00-22:00|Di:Fermé","true","premium"`}
                </code>
              </div>
            </TabsContent>
            
            <TabsContent value="garage" className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Garage automobile</h4>
                <code className="text-xs block whitespace-pre-wrap">
{`"Garage Martin Auto","Réparation automobile toutes marques - Diagnostics électroniques","Automobile","Garage automobile","Pierre Martin","p.martin@email.com","contact@garage-martin.fr","05 53 22 33 44","https://garage-martin.fr","ZI Les Platanes","Bergerac","24100","44.8250","0.4950","","","","","","","","https://goo.gl/maps/def","","","","€","Devis gratuit|Véhicules de courtoisie|Toutes marques","Lu-Ve:08:00-12:00,14:00-18:00|Sa:08:00-12:00|Di:Fermé","false","basic"`}
                </code>
              </div>
            </TabsContent>
            
            <TabsContent value="coiffeur" className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Salon de coiffure</h4>
                <code className="text-xs block whitespace-pre-wrap">
{`"Salon Christine","Coiffure femme et homme - Coloration et soins capillaires","Beauté & Esthétique","Coiffure","Christine Blanc","christine.blanc@email.com","salon.christine@email.com","05 53 33 44 55","","45 Rue Neuve d'Argenson","Bergerac","24100","44.8400","0.4820","https://facebook.com/salonchristine","https://instagram.com/salonchristine","","","","","","","","","","€","Produits bio|Conseil personnalisé|Ambiance zen","Ma-Sa:09:00-12:00,14:00-18:00|Lu:Fermé|Di:Fermé","true","basic"`}
                </code>
              </div>
            </TabsContent>
            
            <TabsContent value="medecin" className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Cabinet médical</h4>
                <code className="text-xs block whitespace-pre-wrap">
{`"Dr. Durand - Médecin Généraliste","Médecine générale - Consultations et visites à domicile","Santé & Bien-être","Médecin généraliste","Dr. Paul Durand","dr.durand@email.com","secretariat@cabinet-durand.fr","05 53 44 55 66","","8 Avenue Pasteur","Bergerac","24100","44.8356","0.4825","","","","","","","","","https://doctolib.fr/dr-durand","","","€","Téléconsultation|Visites à domicile|Urgences","Lu-Ve:08:30-12:00,14:00-18:00|Sa:08:30-12:00|Di:Fermé","true","premium"`}
                </code>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard(csvExample, 'Template CSV complet')}
            >
              <Copy className="w-4 h-4 mr-1" />
              Copier template complet
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Validation et contraintes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Règles de Validation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-green-600">✅ Formats acceptés</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Emails : format standard (test@domain.com)</li>
                  <li>• Téléphones : 05 53 XX XX XX ou +33 5 53 XX XX XX</li>
                  <li>• URLs : https:// ou http:// obligatoire</li>
                  <li>• Codes postaux : 5 chiffres (24100, 33000...)</li>
                  <li>• Coordonnées GPS : format décimal</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-red-600">❌ Erreurs communes</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Caractères spéciaux non échappés</li>
                  <li>• Virgules dans les champs (utiliser "quotes")</li>
                  <li>• Coordonnées GPS incorrectes</li>
                  <li>• Catégories inexistantes</li>
                  <li>• Emails/téléphones invalides</li>
                </ul>
              </div>
            </div>
            
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Zone géographique :</strong> Seules les entreprises dans un rayon de 60km autour de Bergerac (24100) 
                sont acceptées. Vérifiez les coordonnées GPS avant l'import.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Liens utiles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ressources Utiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Outils de préparation</h4>
              <div className="space-y-1">
                <a 
                  href="https://www.google.com/maps" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  Google Maps (coordonnées GPS)
                </a>
                <a 
                  href="https://csvlint.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  CSV Lint (validation CSV)
                </a>
                <a 
                  href="https://convertio.co/fr/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  Convertio (Excel vers CSV)
                </a>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Après l'import</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Les fiches seront en attente de validation</p>
                <p>• Vérification automatique des doublons</p>
                <p>• Contrôle de la zone géographique</p>
                <p>• Notification par email du résultat</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
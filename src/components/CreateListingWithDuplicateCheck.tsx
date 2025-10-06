import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { 
  AlertTriangle, 
  CheckCircle, 
  Shield, 
  Building,
  Phone,
  Mail,
  MapPin,
  Eye,
  EyeOff,
  Zap,
  ArrowRight
} from 'lucide-react';
import { ProfessionalListing } from '../types';
import { useDuplicateDetection, DuplicateDetectionResult } from '../utils/duplicateDetection';
import { mockListings } from './mockData';

interface CreateListingWithDuplicateCheckProps {
  onSubmit: (listingData: Partial<ProfessionalListing>) => void;
  onCancel: () => void;
}

interface ListingFormData {
  title: string;
  description: string;
  category: string;
  contact: {
    email: string;
    phone: string;
    address: string;
    website?: string;
  };
  siret?: string;
}

export function CreateListingWithDuplicateCheck({ 
  onSubmit, 
  onCancel 
}: CreateListingWithDuplicateCheckProps) {
  const [formData, setFormData] = React.useState<ListingFormData>({
    title: '',
    description: '',
    category: '',
    contact: {
      email: '',
      phone: '',
      address: '',
      website: ''
    },
    siret: ''
  });

  const [duplicateCheck, setDuplicateCheck] = React.useState<DuplicateDetectionResult | null>(null);
  const [showSiret, setShowSiret] = React.useState(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState<'form' | 'duplicate-check' | 'confirmation'>('form');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const { checkDuplicates, validateSiret, isChecking } = useDuplicateDetection();

  const categories = [
    'Restaurants', 'Commerce', 'Services', 'Santé', 'Artisanat', 
    'Tourisme', 'Immobilier', 'Transport', 'Éducation', 'Culture'
  ];

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('contact.')) {
      const contactField = field.replace('contact.', '');
      setFormData(prev => ({
        ...prev,
        contact: { ...prev.contact, [contactField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le nom de l\'entreprise est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Une description est requise';
    } else if (formData.description.length < 50) {
      newErrors.description = 'La description doit contenir au moins 50 caractères';
    }

    if (!formData.category) {
      newErrors.category = 'Une catégorie est requise';
    }

    if (!formData.contact.email.trim()) {
      newErrors['contact.email'] = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
      newErrors['contact.email'] = 'Format d\'email invalide';
    }

    if (!formData.contact.phone.trim()) {
      newErrors['contact.phone'] = 'Le téléphone est requis';
    }

    if (!formData.contact.address.trim()) {
      newErrors['contact.address'] = 'L\'adresse est requise';
    }

    if (formData.siret && !/^\d{14}$/.test(formData.siret.replace(/\s/g, ''))) {
      newErrors.siret = 'Le SIRET doit contenir exactement 14 chiffres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    setCurrentStep('duplicate-check');
    
    try {
      const result = await checkDuplicates(formData, mockListings);
      setDuplicateCheck(result);

      if (result.isDuplicate) {
        setShowDuplicateWarning(true);
      } else {
        setCurrentStep('confirmation');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des doublons:', error);
      setCurrentStep('confirmation');
    }
  };

  const handleProceed = () => {
    if (duplicateCheck?.canProceed) {
      setCurrentStep('confirmation');
      setShowDuplicateWarning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const listingData: Partial<ProfessionalListing> = {
        ...formData,
        duplicateChecked: true,
        potentialDuplicates: duplicateCheck?.matches.map(m => m.id) || [],
        verificationStatus: 'pending'
      };

      await new Promise(resolve => setTimeout(resolve, 2000));
      onSubmit(listingData);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSiret = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4');
    return formatted;
  };

  const renderForm = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Informations de votre entreprise</h2>
        
        {/* Informations de base */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">
              Nom de l'entreprise <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Restaurant Le Cyrano"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="category">
              Catégorie <span className="text-red-500">*</span>
            </Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full p-2 border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre entreprise, vos services, votre spécialité..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
              <p className="text-xs text-muted-foreground ml-auto">
                {formData.description.length}/500 caractères
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informations de contact</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@entreprise.fr"
                value={formData.contact.email}
                onChange={(e) => handleInputChange('contact.email', e.target.value)}
                className={errors['contact.email'] ? 'border-red-500' : ''}
              />
              {errors['contact.email'] && (
                <p className="text-sm text-red-500 mt-1">{errors['contact.email']}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">
                Téléphone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="05 53 12 34 56"
                value={formData.contact.phone}
                onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                className={errors['contact.phone'] ? 'border-red-500' : ''}
              />
              {errors['contact.phone'] && (
                <p className="text-sm text-red-500 mt-1">{errors['contact.phone']}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="address">
              Adresse <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              placeholder="15 rue de la République, 24100 Bergerac"
              value={formData.contact.address}
              onChange={(e) => handleInputChange('contact.address', e.target.value)}
              className={errors['contact.address'] ? 'border-red-500' : ''}
            />
            {errors['contact.address'] && (
              <p className="text-sm text-red-500 mt-1">{errors['contact.address']}</p>
            )}
          </div>

          <div>
            <Label htmlFor="website">Site web (optionnel)</Label>
            <Input
              id="website"
              placeholder="https://www.monsite.fr"
              value={formData.contact.website}
              onChange={(e) => handleInputChange('contact.website', e.target.value)}
            />
          </div>
        </div>

        <Separator className="my-6" />

        {/* SIRET */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Vérification administrative (optionnel)</h3>
          
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Le SIRET n'est jamais affiché publiquement. Il permet de vérifier l'authenticité 
              de votre entreprise et facilite les revendications futures.
            </AlertDescription>
          </Alert>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="siret">Numéro SIRET</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowSiret(!showSiret)}
              >
                {showSiret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            
            <Input
              id="siret"
              type={showSiret ? 'text' : 'password'}
              placeholder="123 456 789 01234"
              value={formatSiret(formData.siret || '')}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\s/g, '');
                if (cleaned.length <= 14 && /^\d*$/.test(cleaned)) {
                  handleInputChange('siret', cleaned);
                }
              }}
              className={errors.siret ? 'border-red-500' : ''}
              maxLength={17}
            />
            
            {errors.siret && (
              <p className="text-sm text-red-500 mt-1">{errors.siret}</p>
            )}

            <p className="text-xs text-muted-foreground mt-1">
              Recommandé pour les entreprises françaises (facilite la vérification)
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
        <Button onClick={handleNext} disabled={isChecking} className="flex-1">
          {isChecking ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <ArrowRight className="w-4 h-4 mr-2" />
          )}
          Continuer
        </Button>
      </div>
    </div>
  );

  const renderDuplicateCheck = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Vérification des doublons</h2>
        <p className="text-muted-foreground">
          Nous vérifions si votre entreprise n'existe pas déjà dans notre annuaire
        </p>
      </div>

      {isChecking && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>Analyse en cours...</p>
          </CardContent>
        </Card>
      )}

      {duplicateCheck && !isChecking && (
        <div className="space-y-4">
          {duplicateCheck.isDuplicate ? (
            <Alert className="border-yellow-500 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                <strong>Attention :</strong> Nous avons trouvé {duplicateCheck.matches.length} correspondance(s) 
                possible(s) avec votre entreprise.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <strong>Parfait :</strong> Aucun doublon détecté. Votre entreprise semble unique dans notre annuaire.
              </AlertDescription>
            </Alert>
          )}

          {/* Recommandations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommandations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {duplicateCheck.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-sm">
                    {recommendation}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Correspondances trouvées */}
          {duplicateCheck.matches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Entreprises similaires trouvées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {duplicateCheck.matches.map((match) => (
                  <div key={match.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{match.listing.title}</h4>
                      <div className="flex items-center gap-2">
                        <Progress value={match.matchScore * 100} className="w-20 h-2" />
                        <span className="text-sm font-medium">
                          {Math.round(match.matchScore * 100)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {match.listing.contact.address}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {match.matchReasons.map((reason, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setCurrentStep('form')} className="flex-1">
              Modifier mes informations
            </Button>
            
            {duplicateCheck.canProceed ? (
              <Button onClick={handleProceed} className="flex-1">
                Continuer malgré tout
              </Button>
            ) : (
              <Button 
                onClick={() => alert('Veuillez vérifier les correspondances ou revendiquer une fiche existante')}
                variant="outline" 
                className="flex-1"
              >
                Examiner les correspondances
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Confirmation de création</h2>
        <p className="text-muted-foreground">
          Vérifiez vos informations avant la création de votre fiche
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Récapitulatif</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{formData.title}</p>
              <p className="text-sm text-muted-foreground">{formData.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm">{formData.contact.address}</p>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm">{formData.contact.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm">{formData.contact.phone}</p>
          </div>

          {duplicateCheck && duplicateCheck.matches.length > 0 && (
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                Cette fiche sera créée malgré {duplicateCheck.matches.length} correspondance(s) 
                détectée(s). Elle sera soumise à validation manuelle.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentStep('form')} className="flex-1">
          Modifier
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <CheckCircle className="w-4 h-4 mr-2" />
          )}
          {isSubmitting ? 'Création en cours...' : 'Créer ma fiche'}
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Créer une fiche entreprise</CardTitle>
        <CardDescription>
          Ajoutez votre entreprise à l'annuaire de Bergerac
        </CardDescription>
        
        {/* Indicateur de progression */}
        <div className="flex items-center gap-2 mt-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep === 'form' ? 'bg-primary text-white' : 
            currentStep === 'duplicate-check' || currentStep === 'confirmation' ? 'bg-green-600 text-white' : 
            'bg-muted text-muted-foreground'
          }`}>
            1
          </div>
          <div className={`flex-1 h-1 ${
            currentStep === 'duplicate-check' || currentStep === 'confirmation' ? 'bg-green-600' : 'bg-muted'
          }`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep === 'duplicate-check' ? 'bg-primary text-white' : 
            currentStep === 'confirmation' ? 'bg-green-600 text-white' : 
            'bg-muted text-muted-foreground'
          }`}>
            2
          </div>
          <div className={`flex-1 h-1 ${
            currentStep === 'confirmation' ? 'bg-green-600' : 'bg-muted'
          }`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep === 'confirmation' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
          }`}>
            3
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {currentStep === 'form' && renderForm()}
        {currentStep === 'duplicate-check' && renderDuplicateCheck()}
        {currentStep === 'confirmation' && renderConfirmation()}
      </CardContent>
    </Card>
  );
}
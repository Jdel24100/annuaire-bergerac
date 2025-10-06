import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  UserCheck, 
  FileText, 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  EyeOff,
  Building,
  Mail,
  Phone,
  Send
} from 'lucide-react';
import { ProfessionalListing } from '../types';
import { useDuplicateDetection } from '../utils/duplicateDetection';

interface ClaimListingFormProps {
  listing: ProfessionalListing;
  onClose: () => void;
  onSubmit: (claimData: any) => void;
}

interface ClaimFormData {
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  siret: string;
  companyRole: string;
  evidence: string;
  acceptTerms: boolean;
}

export function ClaimListingForm({ listing, onClose, onSubmit }: ClaimListingFormProps) {
  const [formData, setFormData] = React.useState<ClaimFormData>({
    claimantName: '',
    claimantEmail: '',
    claimantPhone: '',
    siret: '',
    companyRole: '',
    evidence: '',
    acceptTerms: false
  });

  const [showSiret, setShowSiret] = React.useState(false);
  const [siretValidation, setSiretValidation] = React.useState<{
    isValid: boolean;
    companyName?: string;
    error?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const { validateSiret } = useDuplicateDetection();

  const handleInputChange = (field: keyof ClaimFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSiretValidation = async () => {
    if (!formData.siret) return;

    try {
      const result = await validateSiret(formData.siret);
      setSiretValidation(result);
    } catch (error) {
      setSiretValidation({
        isValid: false,
        error: 'Erreur lors de la validation du SIRET'
      });
    }
  };

  React.useEffect(() => {
    if (formData.siret.length === 14) {
      handleSiretValidation();
    } else {
      setSiretValidation(null);
    }
  }, [formData.siret]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.claimantName.trim()) {
      newErrors.claimantName = 'Le nom est requis';
    }

    if (!formData.claimantEmail.trim()) {
      newErrors.claimantEmail = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.claimantEmail)) {
      newErrors.claimantEmail = 'Format d\'email invalide';
    }

    if (!formData.siret.trim()) {
      newErrors.siret = 'Le SIRET est requis pour la revendication';
    } else if (!/^\d{14}$/.test(formData.siret.replace(/\s/g, ''))) {
      newErrors.siret = 'Le SIRET doit contenir exactement 14 chiffres';
    } else if (siretValidation && !siretValidation.isValid) {
      newErrors.siret = siretValidation.error || 'SIRET invalide';
    }

    if (!formData.companyRole.trim()) {
      newErrors.companyRole = 'Votre rôle dans l\'entreprise est requis';
    }

    if (!formData.evidence.trim()) {
      newErrors.evidence = 'Une justification est requise';
    } else if (formData.evidence.length < 20) {
      newErrors.evidence = 'La justification doit contenir au moins 20 caractères';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const claimData = {
        ...formData,
        listingId: listing.id,
        listingTitle: listing.title,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      onSubmit(claimData);
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSiret = (value: string) => {
    // Formatter le SIRET avec des espaces pour la lisibilité
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4');
    return formatted;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                Revendiquer cette fiche
              </CardTitle>
              <CardDescription>
                Cette entreprise vous appartient ? Revendiquez votre fiche pour la gérer
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Informations de la fiche */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2">Fiche à revendiquer :</h3>
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{listing.title}</p>
                <p className="text-sm text-muted-foreground">{listing.contact.address}</p>
              </div>
            </div>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Confidentialité garantie :</strong> Votre SIRET ne sera jamais affiché publiquement. 
              Il est utilisé uniquement pour vérifier votre identité et valider votre revendication.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Vos informations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="claimantName">
                    Nom complet <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="claimantName"
                    placeholder="Jean Dupont"
                    value={formData.claimantName}
                    onChange={(e) => handleInputChange('claimantName', e.target.value)}
                    className={errors.claimantName ? 'border-red-500' : ''}
                  />
                  {errors.claimantName && (
                    <p className="text-sm text-red-500 mt-1">{errors.claimantName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="claimantEmail">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="claimantEmail"
                    type="email"
                    placeholder="jean@entreprise.fr"
                    value={formData.claimantEmail}
                    onChange={(e) => handleInputChange('claimantEmail', e.target.value)}
                    className={errors.claimantEmail ? 'border-red-500' : ''}
                  />
                  {errors.claimantEmail && (
                    <p className="text-sm text-red-500 mt-1">{errors.claimantEmail}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="claimantPhone">Téléphone</Label>
                  <Input
                    id="claimantPhone"
                    placeholder="06 12 34 56 78"
                    value={formData.claimantPhone}
                    onChange={(e) => handleInputChange('claimantPhone', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="companyRole">
                    Votre rôle dans l'entreprise <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyRole"
                    placeholder="Gérant, Propriétaire, Directeur..."
                    value={formData.companyRole}
                    onChange={(e) => handleInputChange('companyRole', e.target.value)}
                    className={errors.companyRole ? 'border-red-500' : ''}
                  />
                  {errors.companyRole && (
                    <p className="text-sm text-red-500 mt-1">{errors.companyRole}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* SIRET */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Vérification administrative</h3>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="siret">
                    Numéro SIRET <span className="text-red-500">*</span>
                  </Label>
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
                  value={formatSiret(formData.siret)}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\s/g, '');
                    if (cleaned.length <= 14 && /^\d*$/.test(cleaned)) {
                      handleInputChange('siret', cleaned);
                    }
                  }}
                  className={errors.siret ? 'border-red-500' : ''}
                  maxLength={17} // Pour inclure les espaces
                />
                
                {errors.siret && (
                  <p className="text-sm text-red-500 mt-1">{errors.siret}</p>
                )}

                {/* Validation SIRET */}
                {siretValidation && (
                  <div className="mt-2">
                    {siretValidation.isValid ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">
                          SIRET valide
                          {siretValidation.companyName && ` - ${siretValidation.companyName}`}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">
                          {siretValidation.error || 'SIRET invalide'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-1">
                  Le SIRET est votre identifiant d'établissement officiel (14 chiffres). 
                  Il confirme que vous êtes bien le représentant légal de cette entreprise.
                </p>
              </div>
            </div>

            <Separator />

            {/* Justification */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="evidence">
                  Justification de votre revendication <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="evidence"
                  placeholder="Expliquez pourquoi cette fiche vous appartient. Mentionnez depuis quand vous dirigez cette entreprise, vos documents officiels disponibles, etc."
                  value={formData.evidence}
                  onChange={(e) => handleInputChange('evidence', e.target.value)}
                  className={`min-h-[120px] ${errors.evidence ? 'border-red-500' : ''}`}
                  maxLength={1000}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.evidence && (
                    <p className="text-sm text-red-500">{errors.evidence}</p>
                  )}
                  <p className="text-xs text-muted-foreground ml-auto">
                    {formData.evidence.length}/1000 caractères
                  </p>
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <Label htmlFor="acceptTerms" className="text-sm">
                    J'accepte les conditions de revendication <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    En revendiquant cette fiche, je certifie être le représentant légal de cette entreprise 
                    et m'engage à fournir des informations exactes et à jour.
                  </p>
                  {errors.acceptTerms && (
                    <p className="text-sm text-red-500 mt-1">{errors.acceptTerms}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || (siretValidation && !siretValidation.isValid)}
                className="flex-1"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer la revendication'}
              </Button>
            </div>
          </form>

          {/* Information sur le processus */}
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <strong>Processus de validation :</strong> Votre demande sera examinée sous 48h. 
              Si approuvée, vous recevrez un email avec les accès pour gérer votre fiche.
              Vous pourrez alors modifier les informations, ajouter des photos et gérer votre abonnement.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
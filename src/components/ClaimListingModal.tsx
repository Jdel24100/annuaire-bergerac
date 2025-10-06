import React from 'react';
import { Building, Mail, Phone, FileText, Send, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useGoogleCaptcha } from './GoogleCaptcha';
import { useAuth } from './AuthContextSimple';
import { ProfessionalListing } from '../types';

interface ClaimListingModalProps {
  listing: ProfessionalListing;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (claimData: ClaimData) => void;
}

export interface ClaimData {
  listingId: string;
  userEmail: string;
  userName: string;
  phone: string;
  businessRole: string;
  proofDocument?: File;
  additionalInfo: string;
  contactPreference: 'email' | 'phone';
}

export function ClaimListingModal({ listing, isOpen, onClose, onSubmit }: ClaimListingModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [proofFile, setProofFile] = React.useState<File | null>(null);
  const captcha = useGoogleCaptcha();

  const [formData, setFormData] = React.useState({
    userEmail: user?.email || '',
    userName: user?.name || '',
    phone: '',
    businessRole: '',
    additionalInfo: '',
    contactPreference: 'email' as 'email' | 'phone'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validation du fichier
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      
      if (file.size > maxSize) {
        alert('Le fichier est trop volumineux. Taille maximum : 10MB');
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        alert('Format de fichier non supporté. Utilisez PDF, JPG ou PNG');
        return;
      }
      
      setProofFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captcha.isCaptchaVerified) {
      alert('Veuillez valider le captcha');
      return;
    }

    if (!formData.businessRole.trim()) {
      alert('Veuillez préciser votre rôle dans l\'entreprise');
      return;
    }

    setLoading(true);

    try {
      const claimData: ClaimData = {
        listingId: listing.id,
        userEmail: formData.userEmail,
        userName: formData.userName,
        phone: formData.phone,
        businessRole: formData.businessRole,
        proofDocument: proofFile || undefined,
        additionalInfo: formData.additionalInfo,
        contactPreference: formData.contactPreference
      };

      // Simulation de soumission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onSubmit(claimData);
      setSubmitted(true);
      
      // Reset form after success
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFormData({
          userEmail: user?.email || '',
          userName: user?.name || '',
          phone: '',
          businessRole: '',
          additionalInfo: '',
          contactPreference: 'email'
        });
        setProofFile(null);
        captcha.resetCaptcha();
      }, 3000);

    } catch (error) {
      console.error('Error submitting claim:', error);
      alert('Erreur lors de la soumission. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Demande envoyée !</h3>
            <p className="text-muted-foreground mb-4">
              Votre demande de revendication a été transmise à notre équipe. 
              Vous recevrez une réponse sous 48h.
            </p>
            <Badge variant="secondary" className="text-xs">
              Référence : CLAIM-{listing.id}-{Date.now()}
            </Badge>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Revendiquer cette fiche
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Info sur la fiche */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Fiche à revendiquer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <img
                  src={listing.logo || listing.gallery[0]}
                  alt={listing.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{listing.title}</h4>
                  <p className="text-sm text-muted-foreground">{listing.category}</p>
                  <p className="text-sm text-muted-foreground">{listing.contact.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              En revendiquant cette fiche, vous certifiez être autorisé(e) à représenter cette entreprise. 
              Notre équipe vérifiera votre demande avant validation.
            </AlertDescription>
          </Alert>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userName">Nom complet *</Label>
                <Input
                  id="userName"
                  value={formData.userName}
                  onChange={(e) => handleInputChange('userName', e.target.value)}
                  placeholder="Votre nom complet"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="userEmail">Email *</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => handleInputChange('userEmail', e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="05 53 XX XX XX"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="businessRole">Votre rôle dans l'entreprise *</Label>
                <Input
                  id="businessRole"
                  value={formData.businessRole}
                  onChange={(e) => handleInputChange('businessRole', e.target.value)}
                  placeholder="Ex: Gérant, Directeur, Propriétaire"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="contactPreference">Préférence de contact</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="contactPreference"
                    value="email"
                    checked={formData.contactPreference === 'email'}
                    onChange={(e) => handleInputChange('contactPreference', e.target.value)}
                  />
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="contactPreference"
                    value="phone"
                    checked={formData.contactPreference === 'phone'}
                    onChange={(e) => handleInputChange('contactPreference', e.target.value)}
                  />
                  <Phone className="w-4 h-4" />
                  <span>Téléphone</span>
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="proofDocument">
                Document justificatif (optionnel)
              </Label>
              <div className="mt-2">
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  {proofFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{proofFile.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setProofFile(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Ajoutez un document prouvant votre lien avec l'entreprise
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        Ex: Kbis, carte de visite, contrat de travail, etc.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('proof-upload')?.click()}
                      >
                        Choisir un fichier
                      </Button>
                      <input
                        id="proof-upload"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Formats acceptés : PDF, JPG, PNG (max 10MB)
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="additionalInfo">
                Informations complémentaires
              </Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="Précisez pourquoi vous souhaitez revendiquer cette fiche, depuis quand vous travaillez dans cette entreprise, etc."
                rows={4}
              />
            </div>

            {/* Captcha */}
            <captcha.CaptchaComponent />

            {/* Boutons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading || !captcha.isCaptchaVerified}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer la demande
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Bouton pour déclencher la revendication
interface ClaimListingButtonProps {
  listing: ProfessionalListing;
  onClaimSubmitted?: (claimData: ClaimData) => void;
}

export function ClaimListingButton({ listing, onClaimSubmitted }: ClaimListingButtonProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { user } = useAuth();

  const handleClaimSubmit = (claimData: ClaimData) => {
    console.log('Claim submitted:', claimData);
    
    // Ici on enverrait les données au backend
    // En production, cela créerait une nouvelle entrée en base de données
    // avec le statut "en attente de validation"
    
    if (onClaimSubmitted) {
      onClaimSubmitted(claimData);
    }
  };

  if (!user) {
    return null; // Seuls les utilisateurs connectés peuvent revendiquer
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="w-full"
      >
        <Building className="w-4 h-4 mr-2" />
        Revendiquer cette fiche
      </Button>

      <ClaimListingModal
        listing={listing}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleClaimSubmit}
      />
    </>
  );
}
import React from 'react';
import { Save, Upload, X, User, Mail, Phone, MapPin, Calendar, Camera, Eye, EyeOff } from 'lucide-react';
import { FixedImageUpload } from './FixedImageUpload';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from './AuthContext';
import { User as UserType } from '../types';

interface ProfileEditorProps {
  onSave?: (updates: Partial<UserType>) => void;
  onCancel?: () => void;
}

export function ProfileEditor({ onSave, onCancel }: ProfileEditorProps) {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarError, setAvatarError] = React.useState<string | null>(null);
  const [showPasswordChange, setShowPasswordChange] = React.useState(false);

  const [profileData, setProfileData] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (success) setSuccess(false); // Clear success message when editing
  };

  const handleAvatarChange = (imageUrl: string | null) => {
    setAvatarError(null);
    setProfileData(prev => ({ ...prev, avatar: imageUrl || '' }));
    if (success) setSuccess(false); // Clear success message when editing
    
    // Upload immédiat de l'avatar sans validation complète du formulaire
    if (imageUrl) {
      handleAvatarUpload(imageUrl);
    }
  };

  const handleAvatarUpload = async (imageUrl: string) => {
    try {
      // Mettre à jour seulement l'avatar dans le profil utilisateur
      updateProfile({ avatar: imageUrl });
      console.log('Avatar mis à jour avec succès');
    } catch (error) {
      setAvatarError('Erreur lors de la mise à jour de l\'avatar');
      console.error('Erreur avatar:', error);
    }
  };

  const validateForm = () => {
    // Validation de base
    if (!profileData.name.trim()) {
      throw new Error('Le nom est obligatoire');
    }
    
    if (!profileData.email.trim()) {
      throw new Error('L\'email est obligatoire');
    }
    
    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      throw new Error('Format d\'email invalide');
    }
    
    if (profileData.phone && !/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(profileData.phone.replace(/\s/g, ''))) {
      throw new Error('Format de téléphone invalide');
    }

    // Validation du changement de mot de passe
    if (showPasswordChange) {
      if (!profileData.currentPassword) {
        throw new Error('Mot de passe actuel requis');
      }
      
      if (!profileData.newPassword) {
        throw new Error('Nouveau mot de passe requis');
      }
      
      if (profileData.newPassword.length < 8) {
        throw new Error('Le nouveau mot de passe doit contenir au moins 8 caractères');
      }
      
      if (profileData.newPassword !== profileData.confirmPassword) {
        throw new Error('Les nouveaux mots de passe ne correspondent pas');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      validateForm();
      
      // Simulation de l'upload de l'avatar
      let avatarUrl = profileData.avatar;
      if (avatarFile) {
        // Dans un vrai projet, on uploadrait le fichier vers un service de stockage
        avatarUrl = URL.createObjectURL(avatarFile);
      }

      // Préparer les données à mettre à jour
      const updates: Partial<UserType> = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone || undefined,
        bio: profileData.bio || undefined,
        avatar: avatarUrl || undefined
      };

      // Simulation de la validation du mot de passe actuel
      if (showPasswordChange) {
        if (user?.email === 'jdelong24100@gmail.com' && profileData.currentPassword !== '@Gochene24') {
          throw new Error('Mot de passe actuel incorrect');
        }
        // Dans un vrai projet, on changerait le mot de passe ici
        console.log('Password change requested');
      }

      // Simuler l'API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mettre à jour le profil
      updateProfile(updates);
      
      if (onSave) {
        onSave(updates);
      }

      setSuccess(true);
      
      // Reset password fields
      if (showPasswordChange) {
        setProfileData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setShowPasswordChange(false);
      }

    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Reset form to original values
      setProfileData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        avatar: user?.avatar || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setAvatarFile(null);
      setShowPasswordChange(false);
      setSuccess(false);
    }
  };

  return (
    <div className="space-y-6">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <AlertDescription className="text-green-800">
              Profil mis à jour avec succès !
            </AlertDescription>
          </div>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo de profil */}
        <Card>
          <CardHeader>
            <CardTitle>Photo de profil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Prévisualisation actuelle */}
              <div className="flex flex-col items-center">
                <h4 className="font-medium mb-4">Photo actuelle</h4>
                <Avatar className="w-32 h-32">
                  <AvatarImage src={profileData.avatar} alt={profileData.name} />
                  <AvatarFallback className="text-2xl">
                    {profileData.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  {profileData.avatar ? 'Photo de profil actuelle' : 'Aucune photo de profil'}
                </p>
              </div>

              {/* Upload nouvelle photo */}
              <div>
                <h4 className="font-medium mb-4">Nouvelle photo</h4>
                <FixedImageUpload
                  value={profileData.avatar}
                  onChange={handleAvatarChange}
                  variant="avatar"
                  placeholder="Ajouter une photo de profil"
                  className="h-32"
                  options={{
                    maxSize: 2 * 1024 * 1024, // 2MB pour un avatar
                    maxWidth: 500,
                    maxHeight: 500,
                    quality: 0.9
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom complet *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Votre nom complet"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Adresse email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="votre@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="05 53 XX XX XX"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Parlez-nous de vous, vos intérêts, votre profession..."
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {profileData.bio.length}/500 caractères
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informations du compte */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du compte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Rôle</p>
                <p className="text-sm text-muted-foreground">
                  {user?.role === 'admin' ? 'Administrateur' : 
                   user?.role === 'author' ? 'Auteur' : 'Utilisateur'}
                </p>
              </div>
              <Badge variant={user?.role === 'admin' ? 'destructive' : 'secondary'}>
                {user?.role === 'admin' ? 'Admin' : 
                 user?.role === 'author' ? 'Auteur' : 'Utilisateur'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Membre depuis</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Date inconnue'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changement de mot de passe */}
        <Card>
          <CardHeader>
            <CardTitle>Sécurité</CardTitle>
          </CardHeader>
          <CardContent>
            {!showPasswordChange ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordChange(true)}
              >
                Changer le mot de passe
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Mot de passe actuel *</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={profileData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    placeholder="Votre mot de passe actuel"
                    required={showPasswordChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="newPassword">Nouveau mot de passe *</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={profileData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    placeholder="Nouveau mot de passe (min. 8 caractères)"
                    required={showPasswordChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirmez le nouveau mot de passe"
                    required={showPasswordChange}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowPasswordChange(false);
                      setProfileData(prev => ({
                        ...prev,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      }));
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
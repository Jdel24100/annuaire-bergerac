import React from 'react';
import { ArrowLeft, Save, Upload, X, MapPin, Phone, Mail, Globe, Camera, FileText, Clock, Star, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from './AuthContext';
import { categories } from './mockData';
import { Page, ProfessionalListing, OpeningHours, DaySchedule } from '../types';

interface ListingEditorProps {
  onNavigate: (page: Page, params?: any) => void;
  listingId?: string;
}

export function ListingEditor({ onNavigate, listingId }: ListingEditorProps) {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('basic');

  // État du formulaire
  const [formData, setFormData] = React.useState<Partial<ProfessionalListing>>({
    title: '',
    description: '',
    category: '',
    subCategory: '',
    contact: {
      phone: '',
      email: user?.email || '',
      website: '',
      address: '',
    },
    location: {
      lat: 44.8519,
      lng: 0.4815,
      city: 'Bergerac',
      zipCode: '24100'
    },
    gallery: [],
    price: '€€',
    highlights: ['', '', ''],
    openingHours: {
      monday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      tuesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      wednesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      thursday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      friday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      saturday: { isOpen: false },
      sunday: { isOpen: false }
    }
  });

  const [imageFiles, setImageFiles] = React.useState<File[]>([]);
  const [logoFile, setLogoFile] = React.useState<File | null>(null);
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const [menuFile, setMenuFile] = React.useState<File | null>(null);

  const isEditing = !!listingId;

  // Chargement des données si édition
  React.useEffect(() => {
    if (isEditing) {
      // Simuler le chargement des données
      setLoading(true);
      setTimeout(() => {
        // Ici on chargerait les vraies données
        setLoading(false);
      }, 1000);
    }
  }, [isEditing]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...(formData.highlights || ['', '', ''])];
    newHighlights[index] = value;
    setFormData(prev => ({ ...prev, highlights: newHighlights }));
  };

  const handleOpeningHoursChange = (day: keyof OpeningHours, field: keyof DaySchedule, value: any) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours?.[day],
          [field]: value
        }
      }
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'gallery' | 'logo' | 'cover' | 'menu') => {
    const files = event.target.files;
    if (!files) return;

    if (type === 'gallery') {
      setImageFiles(prev => [...prev, ...Array.from(files)]);
    } else if (type === 'logo') {
      setLogoFile(files[0]);
    } else if (type === 'cover') {
      setCoverFile(files[0]);
    } else if (type === 'menu') {
      setMenuFile(files[0]);
    }
  };

  const removeImage = (index: number, type: 'gallery' | 'existing') => {
    if (type === 'gallery') {
      setImageFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      const newGallery = [...(formData.gallery || [])];
      newGallery.splice(index, 1);
      setFormData(prev => ({ ...prev, gallery: newGallery }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!formData.title || !formData.description || !formData.category) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Simulation de l'upload des images
      const uploadedImages = imageFiles.map(file => URL.createObjectURL(file));
      
      const listingData: Partial<ProfessionalListing> = {
        ...formData,
        authorId: user?.id,
        authorName: user?.name,
        logo: logoFile ? URL.createObjectURL(logoFile) : undefined,
        coverImage: coverFile ? URL.createObjectURL(coverFile) : undefined,
        menuFile: menuFile ? URL.createObjectURL(menuFile) : undefined,
        gallery: [...(formData.gallery || []), ...uploadedImages],
        isApproved: false, // En attente de validation
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0
      };

      console.log('Listing data:', listingData);

      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Rediriger vers le dashboard
      onNavigate('dashboard');
    } catch (error) {
      console.error('Error saving listing:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.name === formData.category);

  if (loading && isEditing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate('dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au dashboard
        </Button>
        
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Modifier ma fiche' : 'Créer ma fiche professionnelle'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isEditing 
            ? 'Modifiez les informations de votre fiche professionnelle'
            : 'Créez votre fiche professionnelle pour être visible sur l\'annuaire'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Informations de base</TabsTrigger>
            <TabsTrigger value="contact">Contact & Localisation</TabsTrigger>
            <TabsTrigger value="media">Photos & Médias</TabsTrigger>
            <TabsTrigger value="details">Détails & Horaires</TabsTrigger>
          </TabsList>

          {/* Informations de base */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Nom de l'entreprise *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Ex: Restaurant Le Périgord"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedCategory && (
                  <div>
                    <Label htmlFor="subCategory">Sous-catégorie</Label>
                    <Select value={formData.subCategory} onValueChange={(value) => handleInputChange('subCategory', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une sous-catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCategory.subCategories.map((subCat) => (
                          <SelectItem key={subCat.id} value={subCat.name}>
                            {subCat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Décrivez votre entreprise, vos services, ce qui vous rend unique..."
                    rows={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Une description détaillée améliore votre visibilité dans les résultats de recherche.
                  </p>
                </div>

                <div>
                  <Label htmlFor="price">Gamme de prix</Label>
                  <Select value={formData.price} onValueChange={(value) => handleInputChange('price', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="€">€ - Économique</SelectItem>
                      <SelectItem value="€€">€€ - Modéré</SelectItem>
                      <SelectItem value="€€€">€€€ - Cher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact & Localisation */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={formData.contact?.phone}
                        onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                        placeholder="05 53 XX XX XX"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.contact?.email}
                        onChange={(e) => handleInputChange('contact.email', e.target.value)}
                        placeholder="contact@monentreprise.fr"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Site web</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      value={formData.contact?.website}
                      onChange={(e) => handleInputChange('contact.website', e.target.value)}
                      placeholder="https://monentreprise.fr"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Adresse complète *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={formData.contact?.address}
                      onChange={(e) => handleInputChange('contact.address', e.target.value)}
                      placeholder="15 Place Pélissière, 24100 Bergerac"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={formData.location?.city}
                      onChange={(e) => handleInputChange('location.city', e.target.value)}
                      placeholder="Bergerac"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="zipCode">Code postal</Label>
                    <Input
                      id="zipCode"
                      value={formData.location?.zipCode}
                      onChange={(e) => handleInputChange('location.zipCode', e.target.value)}
                      placeholder="24100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Photos & Médias */}
          <TabsContent value="media">
            <div className="space-y-6">
              {/* Logo */}
              <Card>
                <CardHeader>
                  <CardTitle>Logo de l'entreprise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {logoFile ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(logoFile)}
                          alt="Logo"
                          className="w-32 h-32 object-cover mx-auto rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2"
                          onClick={() => setLogoFile(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-4">Ajoutez le logo de votre entreprise</p>
                        <Button type="button" variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>
                          <Upload className="w-4 h-4 mr-2" />
                          Choisir un fichier
                        </Button>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'logo')}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Photo de couverture */}
              <Card>
                <CardHeader>
                  <CardTitle>Photo de couverture</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {coverFile ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(coverFile)}
                          alt="Couverture"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setCoverFile(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-4">Photo principale de votre entreprise</p>
                        <Button type="button" variant="outline" onClick={() => document.getElementById('cover-upload')?.click()}>
                          <Upload className="w-4 h-4 mr-2" />
                          Choisir un fichier
                        </Button>
                        <input
                          id="cover-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'cover')}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Galerie photos */}
              <Card>
                <CardHeader>
                  <CardTitle>Galerie photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Gallery ${index}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2"
                          onClick={() => removeImage(index, 'gallery')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-4">Ajoutez des photos de votre établissement, vos produits, etc.</p>
                    <Button type="button" variant="outline" onClick={() => document.getElementById('gallery-upload')?.click()}>
                      <Upload className="w-4 h-4 mr-2" />
                      Ajouter des photos
                    </Button>
                    <input
                      id="gallery-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'gallery')}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Menu (pour restaurants) */}
              {formData.category === 'Restaurants & Cafés' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Menu (PDF ou Image)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {menuFile ? (
                        <div className="relative">
                          <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
                            <FileText className="w-8 h-8 mr-2" />
                            <span>{menuFile.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2"
                            onClick={() => setMenuFile(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-sm text-gray-600 mb-4">Ajoutez votre menu (PDF ou image)</p>
                          <Button type="button" variant="outline" onClick={() => document.getElementById('menu-upload')?.click()}>
                            <Upload className="w-4 h-4 mr-2" />
                            Choisir un fichier
                          </Button>
                          <input
                            id="menu-upload"
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'menu')}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Détails & Horaires */}
          <TabsContent value="details">
            <div className="space-y-6">
              {/* Points forts */}
              <Card>
                <CardHeader>
                  <CardTitle>Points forts (3 maximum)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[0, 1, 2].map((index) => (
                    <div key={index}>
                      <Label htmlFor={`highlight-${index}`}>Point fort {index + 1}</Label>
                      <Input
                        id={`highlight-${index}`}
                        value={formData.highlights?.[index] || ''}
                        onChange={(e) => handleHighlightChange(index, e.target.value)}
                        placeholder={`Ex: ${index === 0 ? 'Spécialité foie gras' : index === 1 ? 'Terrasse avec vue' : 'Produits locaux'}`}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Horaires d'ouverture */}
              <Card>
                <CardHeader>
                  <CardTitle>Horaires d'ouverture</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(formData.openingHours || {}).map(([day, schedule]) => {
                      const dayNames: Record<string, string> = {
                        monday: 'Lundi',
                        tuesday: 'Mardi',
                        wednesday: 'Mercredi',
                        thursday: 'Jeudi',
                        friday: 'Vendredi',
                        saturday: 'Samedi',
                        sunday: 'Dimanche'
                      };

                      return (
                        <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="w-20">
                            <Label>{dayNames[day]}</Label>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={schedule.isOpen}
                              onCheckedChange={(checked) => handleOpeningHoursChange(day as keyof OpeningHours, 'isOpen', checked)}
                            />
                            <Label className="text-sm">Ouvert</Label>
                          </div>
                          
                          {schedule.isOpen && (
                            <div className="flex items-center gap-2 flex-1">
                              <Input
                                type="time"
                                value={schedule.openTime || ''}
                                onChange={(e) => handleOpeningHoursChange(day as keyof OpeningHours, 'openTime', e.target.value)}
                                className="w-32"
                              />
                              <span>à</span>
                              <Input
                                type="time"
                                value={schedule.closeTime || ''}
                                onChange={(e) => handleOpeningHoursChange(day as keyof OpeningHours, 'closeTime', e.target.value)}
                                className="w-32"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onNavigate('dashboard')}
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
                {isEditing ? 'Mettre à jour' : 'Créer la fiche'}
              </>
            )}
          </Button>
        </div>
      </form>

      {!isEditing && (
        <Alert className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Votre fiche sera soumise à validation avant d'être publiée sur l'annuaire. 
            Vous recevrez une notification une fois qu'elle aura été approuvée.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
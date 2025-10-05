import React from 'react';
import { ChevronDown, Search, HelpCircle, Building, CreditCard, Mail, Shield, Map } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Page } from '../types';

interface FAQProps {
  onNavigate: (page: Page) => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful?: number;
}

const faqCategories = [
  { id: 'getting-started', name: 'Commencer', icon: HelpCircle, color: 'bg-blue-100 text-blue-800' },
  { id: 'business-listing', name: 'Fiches pro', icon: Building, color: 'bg-green-100 text-green-800' },
  { id: 'pricing', name: 'Tarifs', icon: CreditCard, color: 'bg-purple-100 text-purple-800' },
  { id: 'account', name: 'Compte', icon: Shield, color: 'bg-orange-100 text-orange-800' },
  { id: 'technical', name: 'Technique', icon: Map, color: 'bg-red-100 text-red-800' },
  { id: 'contact', name: 'Contact', icon: Mail, color: 'bg-gray-100 text-gray-800' },
];

const faqItems: FAQItem[] = [
  // Commencer
  {
    id: 'what-is-annuaire-bergerac',
    question: 'Qu\'est-ce qu\'Annuaire Bergerac ?',
    answer: 'Annuaire Bergerac est la plateforme de référence pour trouver les meilleurs professionnels de Bergerac et ses environs (dans un rayon de 60km). Nous connectons les habitants avec les entreprises locales : restaurants, artisans, commerces, services, etc.',
    category: 'getting-started',
    tags: ['annuaire', 'bergerac', 'présentation'],
    helpful: 45
  },
  {
    id: 'how-to-search',
    question: 'Comment rechercher un professionnel ?',
    answer: 'Utilisez la barre de recherche en tapant le nom de l\'entreprise, le type de service ou la catégorie. Vous pouvez aussi filtrer par catégorie, prix, localisation ou voir uniquement les professionnels vérifiés. La recherche géographique est limitée à 60km autour de Bergerac.',
    category: 'getting-started',
    tags: ['recherche', 'filtres', 'géolocalisation'],
    helpful: 38
  },
  {
    id: 'verified-businesses',
    question: 'Que signifie "Professionnel vérifié" ?',
    answer: 'Les professionnels vérifiés ont fourni des documents officiels (Kbis, certification, etc.) confirmant leur statut d\'entreprise légale. Ils ont aussi un abonnement actif et respectent notre charte qualité.',
    category: 'getting-started',
    tags: ['vérification', 'qualité', 'certification'],
    helpful: 42
  },

  // Fiches professionnelles
  {
    id: 'create-business-listing',
    question: 'Comment créer ma fiche professionnelle ?',
    answer: 'Inscrivez-vous, puis accédez à votre dashboard et cliquez sur "Créer ma fiche". Remplissez toutes les informations : nom, description, catégorie, coordonnées, horaires, photos. Votre fiche sera validée par notre équipe avant publication.',
    category: 'business-listing',
    tags: ['création', 'fiche', 'validation'],
    helpful: 67
  },
  {
    id: 'claim-existing-listing',
    question: 'Comment revendiquer une fiche existante ?',
    answer: 'Si votre entreprise existe déjà dans l\'annuaire, cliquez sur "Revendiquer cette fiche" sur la page de l\'établissement. Vous devrez prouver votre lien avec l\'entreprise (Kbis, contrat de travail, etc.). La validation prend 48h maximum.',
    category: 'business-listing',
    tags: ['revendication', 'propriété', 'validation'],
    helpful: 29
  },
  {
    id: 'update-business-info',
    question: 'Comment modifier mes informations ?',
    answer: 'Connectez-vous à votre dashboard, allez dans "Mes fiches" et cliquez sur "Modifier". Vous pouvez changer les horaires, photos, description, coordonnées. Les modifications importantes nécessitent une nouvelle validation.',
    category: 'business-listing',
    tags: ['modification', 'mise à jour', 'dashboard'],
    helpful: 33
  },
  {
    id: 'why-pending-validation',
    question: 'Pourquoi ma fiche est-elle en attente de validation ?',
    answer: 'Toutes les nouvelles fiches et modifications importantes sont vérifiées manuellement pour garantir la qualité de l\'annuaire. Cela prend généralement 24-48h. Vous recevrez un email dès que votre fiche sera validée.',
    category: 'business-listing',
    tags: ['validation', 'attente', 'processus'],
    helpful: 25
  },

  // Tarifs et abonnements
  {
    id: 'pricing-plans',
    question: 'Quels sont les tarifs ?',
    answer: 'Nous proposons 3 formules : Hebdomadaire (15€), Mensuelle (45€) et Annuelle (450€). La formule annuelle est la plus avantageuse avec 2 mois offerts. Toutes incluent : fiche complète, photos, horaires, contact direct.',
    category: 'pricing',
    tags: ['tarifs', 'abonnement', 'formules'],
    helpful: 51
  },
  {
    id: 'free-trial',
    question: 'Y a-t-il une période d\'essai gratuite ?',
    answer: 'La création de fiche est gratuite, mais pour qu\'elle soit visible publiquement, un abonnement est nécessaire. Vous pouvez tester l\'interface complètement avant de vous abonner.',
    category: 'pricing',
    tags: ['gratuit', 'essai', 'test'],
    helpful: 18
  },
  {
    id: 'payment-methods',
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer: 'Nous acceptons toutes les cartes bancaires (Visa, Mastercard, CB) via notre système de paiement sécurisé Stripe. Les paiements sont cryptés et conformes aux normes PCI-DSS.',
    category: 'pricing',
    tags: ['paiement', 'sécurité', 'stripe'],
    helpful: 22
  },

  // Compte utilisateur
  {
    id: 'create-account',
    question: 'Ai-je besoin d\'un compte pour consulter l\'annuaire ?',
    answer: 'Non, la consultation de l\'annuaire est libre et gratuite. Un compte n\'est nécessaire que pour créer une fiche professionnelle, laisser des avis ou contacter directement les entreprises.',
    category: 'account',
    tags: ['compte', 'inscription', 'gratuit'],
    helpful: 34
  },
  {
    id: 'forgot-password',
    question: 'J\'ai oublié mon mot de passe, que faire ?',
    answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion. Vous recevrez un email avec un lien pour réinitialiser votre mot de passe. Le lien est valide 24h.',
    category: 'account',
    tags: ['mot de passe', 'réinitialisation', 'email'],
    helpful: 16
  },
  {
    id: 'delete-account',
    question: 'Comment supprimer mon compte ?',
    answer: 'Rendez-vous dans votre dashboard, section "Paramètres", puis "Zone de danger". La suppression est définitive et supprime toutes vos données. Vos fiches professionnelles actives seront désactivées.',
    category: 'account',
    tags: ['suppression', 'données', 'définitif'],
    helpful: 8
  },

  // Technique
  {
    id: 'browser-compatibility',
    question: 'Sur quels navigateurs fonctionne le site ?',
    answer: 'Annuaire Bergerac fonctionne sur tous les navigateurs modernes : Chrome, Firefox, Safari, Edge (versions récentes). Pour une expérience optimale, nous recommandons Chrome ou Firefox.',
    category: 'technical',
    tags: ['navigateur', 'compatibilité', 'technique'],
    helpful: 12
  },
  {
    id: 'mobile-app',
    question: 'Y a-t-il une application mobile ?',
    answer: 'Pour l\'instant, nous n\'avons pas d\'application mobile. Cependant, notre site est parfaitement optimisé pour les mobiles et tablettes. Vous pouvez l\'ajouter à votre écran d\'accueil comme une app.',
    category: 'technical',
    tags: ['mobile', 'application', 'responsive'],
    helpful: 27
  },

  // Contact
  {
    id: 'contact-support',
    question: 'Comment contacter le support ?',
    answer: 'Vous pouvez nous contacter via le formulaire de contact, par email à contact@annuaire-bergerac.fr, ou depuis votre dashboard dans la section "Aide". Nous répondons sous 24h en semaine.',
    category: 'contact',
    tags: ['support', 'contact', 'aide'],
    helpful: 31
  },
  {
    id: 'report-error',
    question: 'Comment signaler une erreur sur une fiche ?',
    answer: 'Sur chaque fiche, vous trouverez un bouton "Signaler un problème". Vous pouvez aussi nous contacter directement en précisant l\'URL de la fiche concernée et le problème constaté.',
    category: 'contact',
    tags: ['erreur', 'signalement', 'problème'],
    helpful: 19
  }
];

export function FAQ({ onNavigate }: FAQProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [openItems, setOpenItems] = React.useState<string[]>([]);

  const filteredFAQ = faqItems.filter(item => {
    const matchesSearch = !searchTerm || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? '' : categoryId);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // Si on recherche, on ouvre automatiquement les items pertinents
    if (value.length > 2) {
      const relevantItems = filteredFAQ.slice(0, 3).map(item => item.id);
      setOpenItems(relevantItems);
    } else {
      setOpenItems([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Foire Aux Questions</h1>
        <p className="text-xl text-muted-foreground">
          Trouvez rapidement les réponses à vos questions
        </p>
      </div>

      {/* Search */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher dans la FAQ..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Catégories</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {faqCategories.map((category) => {
            const Icon = category.icon;
            const count = faqItems.filter(item => item.category === category.id).length;
            
            return (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCategory === category.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium text-sm">{category.name}</h3>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {count}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      {(searchTerm || selectedCategory) && (
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            {filteredFAQ.length} résultat{filteredFAQ.length > 1 ? 's' : ''} trouvé{filteredFAQ.length > 1 ? 's' : ''}
          </p>
          {(searchTerm || selectedCategory) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setOpenItems([]);
              }}
            >
              Réinitialiser
            </Button>
          )}
        </div>
      )}

      {/* FAQ Items */}
      {filteredFAQ.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <HelpCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
            <p className="text-muted-foreground mb-4">
              Essayez d'autres mots-clés ou parcourez les catégories
            </p>
            <Button onClick={() => onNavigate('contact')}>
              Poser une question
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems}>
              {filteredFAQ.map((item, index) => {
                const category = faqCategories.find(cat => cat.id === item.category);
                
                return (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground text-lg leading-tight pr-4">
                            {item.question}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            {category && (
                              <Badge variant="outline" className="text-xs">
                                {category.name}
                              </Badge>
                            )}
                            {item.helpful && (
                              <span className="text-xs text-muted-foreground">
                                {item.helpful} personnes aidées
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2 pb-4">
                        <div className="faq-content">
                          <p className="text-muted-foreground leading-relaxed text-base">
                            {item.answer}
                          </p>
                        </div>
                        
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-4">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                          <span className="text-sm text-muted-foreground">
                            Cette réponse vous a-t-elle aidé ?
                          </span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              👍 Oui
                            </Button>
                            <Button variant="outline" size="sm">
                              👎 Non
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Contact CTA */}
      <Card className="mt-8">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Vous ne trouvez pas votre réponse ?</h3>
          <p className="text-muted-foreground mb-4">
            Notre équipe est là pour vous aider. Contactez-nous directement.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => onNavigate('contact')}>
              <Mail className="w-4 h-4 mr-2" />
              Nous contacter
            </Button>
            <Button variant="outline" onClick={() => onNavigate('pricing')}>
              Voir les tarifs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
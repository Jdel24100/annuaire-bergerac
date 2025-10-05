import React from 'react';
import { ArrowLeft, Send, Bug, Lightbulb, MessageSquare, Upload, X, CheckCircle, AlertCircle, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

import { Badge } from './ui/badge';
import { useAuth } from './AuthContextSimple';
import { useSafeCaptchaWrapper } from './SafeCaptchaWrapper';
import { Page, Feedback, FeedbackCategory } from '../types';

interface ContactPageProps {
  onNavigate: (page: Page) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('contact');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  
  // Captcha pour chaque formulaire
  const contactCaptcha = useSafeCaptchaWrapper();
  const bugCaptcha = useSafeCaptchaWrapper();
  const suggestionCaptcha = useSafeCaptchaWrapper();

  // États des formulaires
  const [contactForm, setContactForm] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: ''
  });

  const [bugForm, setBugForm] = React.useState({
    title: '',
    description: '',
    userEmail: user?.email || '',
    userName: user?.name || '',
    file: null as File | null
  });

  const [suggestionForm, setSuggestionForm] = React.useState({
    title: '',
    description: '',
    category: '',
    userEmail: user?.email || '',
    userName: user?.name || ''
  });

  // Catégories de suggestions
  const suggestionCategories: FeedbackCategory[] = [
    { id: 'ux', name: 'Interface & Navigation', description: 'Améliorations de l\'interface utilisateur', type: 'suggestion' },
    { id: 'feature', name: 'Nouvelles fonctionnalités', description: 'Nouvelles features à ajouter', type: 'suggestion' },
    { id: 'search', name: 'Recherche & Filtres', description: 'Améliorer la recherche', type: 'suggestion' },
    { id: 'mobile', name: 'Version mobile', description: 'Optimisations mobiles', type: 'suggestion' },
    { id: 'other', name: 'Autre', description: 'Autres suggestions', type: 'suggestion' }
  ];

  const submitContactForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.subject.trim() || !contactForm.message.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (!contactCaptcha.isCaptchaVerified) {
      alert('Veuillez compléter la vérification anti-spam');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Contact form submitted:', contactForm);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus('success');
      setContactForm({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: ''
      });
      contactCaptcha.resetCaptcha();
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const submitBugReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugForm.title.trim() || !bugForm.description.trim() || !bugForm.userEmail.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (!bugCaptcha.isCaptchaVerified) {
      alert('Veuillez compléter la vérification anti-spam');
      return;
    }

    setIsSubmitting(true);
    try {
      const feedbackData: Partial<Feedback> = {
        type: 'bug',
        title: bugForm.title,
        description: bugForm.description,
        userEmail: bugForm.userEmail,
        userName: bugForm.userName,
        userId: user?.id,
        status: 'nouveau',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Bug report submitted:', feedbackData);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus('success');
      setBugForm({
        title: '',
        description: '',
        userEmail: user?.email || '',
        userName: user?.name || '',
        file: null
      });
      bugCaptcha.resetCaptcha();
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const submitSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionForm.title.trim() || !suggestionForm.description.trim() || !suggestionForm.category || !suggestionForm.userEmail.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (!suggestionCaptcha.isCaptchaVerified) {
      alert('Veuillez compléter la vérification anti-spam');
      return;
    }

    setIsSubmitting(true);
    try {
      const feedbackData: Partial<Feedback> = {
        type: 'suggestion',
        title: suggestionForm.title,
        description: suggestionForm.description,
        category: suggestionForm.category,
        userEmail: suggestionForm.userEmail,
        userName: suggestionForm.userName,
        userId: user?.id,
        status: 'nouveau',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Suggestion submitted:', feedbackData);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus('success');
      setSuggestionForm({
        title: '',
        description: '',
        category: '',
        userEmail: user?.email || '',
        userName: user?.name || ''
      });
      suggestionCaptcha.resetCaptcha();
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate('home')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Button>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Nous contacter</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Une question ? Un bug à signaler ? Une suggestion ? Nous sommes là pour vous aider !
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Informations de contact */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">contact@annuaire-bergerac.fr</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Adresse</p>
                  <p className="text-sm text-muted-foreground">Bergerac, Dordogne</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Horaires</p>
                  <p className="text-sm text-muted-foreground">Lun-Ven : 9h-18h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Temps de réponse</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Questions générales</span>
                  <Badge variant="secondary">24-48h</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bugs critiques</span>
                  <Badge variant="destructive">2-6h</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Suggestions</span>
                  <Badge variant="outline">3-7 jours</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulaires */}
        <div className="lg:col-span-2">
          {/* Status Messages */}
          {submitStatus === 'success' && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
              </AlertDescription>
            </Alert>
          )}
          
          {submitStatus === 'error' && (
            <Alert className="mb-6 border-red-200 bg-red-50" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Une erreur s'est produite lors de l'envoi. Veuillez réessayer ou nous contacter directement.
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Contact
              </TabsTrigger>
              <TabsTrigger value="bug" className="flex items-center gap-2">
                <Bug className="w-4 h-4" />
                Signaler un bug
              </TabsTrigger>
              <TabsTrigger value="suggestion" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Suggestion
              </TabsTrigger>
            </TabsList>

            {/* Formulaire de contact général */}
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Nous contacter</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitContactForm} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-name">Nom *</Label>
                        <Input
                          id="contact-name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Votre nom"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-email">Email *</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="votre@email.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="contact-subject">Sujet *</Label>
                      <Input
                        id="contact-subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Sujet de votre message"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="contact-message">Message *</Label>
                      <Textarea
                        id="contact-message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Décrivez votre demande..."
                        rows={6}
                        required
                      />
                    </div>
                    
                    <contactCaptcha.CaptchaComponent />
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !contactCaptcha.isCaptchaVerified} 
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Signalement de bug */}
            <TabsContent value="bug">
              <Card>
                <CardHeader>
                  <CardTitle>Signaler un bug</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitBugReport} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bug-name">Nom</Label>
                        <Input
                          id="bug-name"
                          value={bugForm.userName}
                          onChange={(e) => setBugForm(prev => ({ ...prev, userName: e.target.value }))}
                          placeholder="Votre nom (optionnel)"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bug-email">Email *</Label>
                        <Input
                          id="bug-email"
                          type="email"
                          value={bugForm.userEmail}
                          onChange={(e) => setBugForm(prev => ({ ...prev, userEmail: e.target.value }))}
                          placeholder="votre@email.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="bug-title">Titre du bug *</Label>
                      <Input
                        id="bug-title"
                        value={bugForm.title}
                        onChange={(e) => setBugForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Résumé du problème"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bug-description">Description détaillée *</Label>
                      <Textarea
                        id="bug-description"
                        value={bugForm.description}
                        onChange={(e) => setBugForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Décrivez le bug : que s'est-il passé ? Dans quell contexte ? Comment reproduire le problème ?"
                        rows={6}
                        required
                      />
                    </div>
                    
                    <bugCaptcha.CaptchaComponent />
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !bugCaptcha.isCaptchaVerified} 
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Bug className="w-4 h-4 mr-2" />
                          Signaler le bug
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Suggestions */}
            <TabsContent value="suggestion">
              <Card>
                <CardHeader>
                  <CardTitle>Proposer une amélioration</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitSuggestion} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="suggestion-name">Nom</Label>
                        <Input
                          id="suggestion-name"
                          value={suggestionForm.userName}
                          onChange={(e) => setSuggestionForm(prev => ({ ...prev, userName: e.target.value }))}
                          placeholder="Votre nom (optionnel)"
                        />
                      </div>
                      <div>
                        <Label htmlFor="suggestion-email">Email *</Label>
                        <Input
                          id="suggestion-email"
                          type="email"
                          value={suggestionForm.userEmail}
                          onChange={(e) => setSuggestionForm(prev => ({ ...prev, userEmail: e.target.value }))}
                          placeholder="votre@email.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="suggestion-category">Catégorie *</Label>
                      <Select value={suggestionForm.category} onValueChange={(value) => setSuggestionForm(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {suggestionCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="suggestion-title">Titre de la suggestion *</Label>
                      <Input
                        id="suggestion-title"
                        value={suggestionForm.title}
                        onChange={(e) => setSuggestionForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Résumé de votre idée"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="suggestion-description">Description détaillée *</Label>
                      <Textarea
                        id="suggestion-description"
                        value={suggestionForm.description}
                        onChange={(e) => setSuggestionForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Décrivez votre suggestion : quelle amélioration proposez-vous ? Pourquoi serait-elle utile ? Comment l'imaginez-vous ?"
                        rows={6}
                        required
                      />
                    </div>
                    
                    <suggestionCaptcha.CaptchaComponent />
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !suggestionCaptcha.isCaptchaVerified} 
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Envoyer la suggestion
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
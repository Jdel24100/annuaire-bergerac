import React from 'react';
import { Home, Search, AlertTriangle, RefreshCw, Mail, Send, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { useGoogleCaptcha } from './GoogleCaptcha';
import { Logo } from './Logo';
import { Page } from '../types';

interface NotFoundPageProps {
  onNavigate: (page: Page, params?: any) => void;
  requestedPath?: string;
}

export function NotFoundPage({ onNavigate, requestedPath }: NotFoundPageProps) {
  const [showBugReport, setShowBugReport] = React.useState(false);
  const [bugReportSent, setBugReportSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const captcha = useGoogleCaptcha();

  const [bugForm, setBugForm] = React.useState({
    email: '',
    subject: '',
    description: '',
    expectedBehavior: '',
    currentUrl: typeof window !== 'undefined' ? window.location.href : requestedPath || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setBugForm(prev => ({ ...prev, [field]: value }));
  };

  const handleBugReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captcha.isCaptchaVerified) {
      alert('Veuillez valider le captcha');
      return;
    }

    setLoading(true);

    try {
      // Simulation d'envoi du rapport de bug
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Bug report:', {
        ...bugForm,
        type: '404-error',
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : ''
      });

      setBugReportSent(true);
      
      // Reset après 3 secondes
      setTimeout(() => {
        setShowBugReport(false);
        setBugReportSent(false);
        setBugForm({
          email: '',
          subject: '',
          description: '',
          expectedBehavior: '',
          currentUrl: typeof window !== 'undefined' ? window.location.href : ''
        });
        captcha.resetCaptcha();
      }, 3000);

    } catch (error) {
      console.error('Error sending bug report:', error);
      alert('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      onNavigate('home');
    }
  };

  const suggestions = [
    { label: 'Accueil', page: 'home' as Page, icon: Home },
    { label: 'Rechercher des professionnels', page: 'search' as Page, icon: Search },
    { label: 'Parcourir l\'annuaire', page: 'directory' as Page, icon: Search },
    { label: 'Aide & Conseils', page: 'blog' as Page, icon: Search }
  ];

  if (bugReportSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Rapport envoyé !</h2>
          <p className="text-muted-foreground">
            Merci de nous aider à améliorer Annuaire Bergerac. Nous examinerons votre rapport.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec logo */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo variant="full" size="lg" />
            <Button variant="ghost" onClick={goBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          {/* Animation 404 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="relative">
              <h1 className="text-9xl font-bold text-primary/20 dark:text-primary/10">404</h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <AlertTriangle className="w-24 h-24 text-primary animate-pulse" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-4">Page introuvable</h2>
            <p className="text-xl text-muted-foreground mb-2">
              Oups ! La page que vous cherchez n'existe pas ou a été déplacée.
            </p>
            
            {requestedPath && (
              <div className="text-sm text-muted-foreground mb-6">
                <span>URL demandée : </span>
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  {requestedPath}
                </code>
              </div>
            )}

            <Badge variant="outline" className="mb-8">
              Site en cours de développement
            </Badge>
          </motion.div>
        </div>

        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          {/* Suggestions de navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Où souhaitez-vous aller ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestions.map((suggestion) => {
                const Icon = suggestion.icon;
                return (
                  <Button
                    key={suggestion.page}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => onNavigate(suggestion.page)}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {suggestion.label}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Actions utiles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Actions utiles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4 mr-3" />
                Recharger la page
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={goBack}
              >
                <ArrowLeft className="w-4 h-4 mr-3" />
                Page précédente
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setShowBugReport(true)}
              >
                <AlertTriangle className="w-4 h-4 mr-3" />
                Signaler un problème
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onNavigate('contact')}
              >
                <Mail className="w-4 h-4 mr-3" />
                Nous contacter
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Formulaire de rapport de bug */}
        {showBugReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Signaler un problème
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBugReport(false)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Aidez-nous à améliorer Annuaire Bergerac en signalant ce problème. 
                    Votre retour est précieux pendant cette phase de développement.
                  </AlertDescription>
                </Alert>

                <form onSubmit={handleBugReport} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bug-email">Votre email</Label>
                      <Input
                        id="bug-email"
                        type="email"
                        value={bugForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bug-subject">Sujet</Label>
                      <Input
                        id="bug-subject"
                        value={bugForm.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Page 404 inattendue"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bug-description">Description du problème</Label>
                    <Textarea
                      id="bug-description"
                      value={bugForm.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Décrivez ce qui s'est passé..."
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="bug-expected">Que devrait-il se passer ?</Label>
                    <Textarea
                      id="bug-expected"
                      value={bugForm.expectedBehavior}
                      onChange={(e) => handleInputChange('expectedBehavior', e.target.value)}
                      placeholder="Décrivez le comportement attendu..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bug-url">URL concernée</Label>
                    <Input
                      id="bug-url"
                      value={bugForm.currentUrl}
                      onChange={(e) => handleInputChange('currentUrl', e.target.value)}
                      placeholder="https://..."
                      readOnly
                      className="bg-muted"
                    />
                  </div>

                  {/* Captcha */}
                  <captcha.CaptchaComponent />

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowBugReport(false)}
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
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Envoi...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Envoyer le rapport
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Info développement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Site en développement</h3>
              <p className="text-muted-foreground text-sm">
                Annuaire Bergerac est actuellement en cours de développement. 
                Certaines pages peuvent être temporairement indisponibles. 
                Merci de votre compréhension !
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
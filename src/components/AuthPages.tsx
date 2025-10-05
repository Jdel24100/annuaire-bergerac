import React from 'react';
import { Mail, Lock, User, Chrome, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { useAuth } from './AuthContextSimple';
import { useSafeCaptchaWrapper } from './SafeCaptchaWrapper';
import { Page } from '../types';

interface AuthPagesProps {
  type: 'login' | 'register';
  onNavigate: (page: Page) => void;
}

export function AuthPages({ type, onNavigate }: AuthPagesProps) {
  const { login, loginWithGoogle, register } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [requires2FA, setRequires2FA] = React.useState(false);
  const [twoFactorCode, setTwoFactorCode] = React.useState('');
  // Utilisation du captcha sécurisé avec fallback automatique
  const captcha = useSafeCaptchaWrapper();
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    name: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Vérifier le captcha pour l'inscription
    if (type === 'register' && !captcha.isCaptchaVerified) {
      setError('Veuillez compléter la vérification anti-spam');
      setLoading(false);
      return;
    }

    try {
      let success = false;

      if (type === 'login') {
        const result = await login(formData.email, formData.password, twoFactorCode);
        if (result.success) {
          success = true;
        } else if (result.requires2FA) {
          setRequires2FA(true);
          setLoading(false);
          return;
        } else {
          setError(result.error || 'Email ou mot de passe incorrect');
        }
      } else {
        if (!formData.name) {
          setError('Le nom est requis');
          setLoading(false);
          return;
        }
        success = await register(formData.email, formData.password, formData.name);
        if (!success) {
          setError('Cet email est déjà utilisé');
        }
      }

      if (success) {
        onNavigate('home');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const success = await loginWithGoogle();
      if (success) {
        onNavigate('home');
      } else {
        setError('Erreur lors de la connexion avec Google');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {type === 'login' ? 'Connexion' : 'Inscription'}
          </CardTitle>
          <CardDescription className="text-center">
            {type === 'login' 
              ? 'Connectez-vous à votre compte' 
              : 'Créez votre compte professionnel'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {requires2FA && (
              <div className="space-y-2">
                <Label htmlFor="twoFactorCode">Code d'authentification (6 chiffres)</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="twoFactorCode"
                    type="text"
                    placeholder="123456"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="pl-10"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Saisissez le code généré par votre application d'authentification
                </p>
              </div>
            )}

            <captcha.CaptchaComponent />

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !captcha.isCaptchaVerified}
            >
              {loading ? 'Chargement...' : type === 'login' ? 'Se connecter' : 'S\'inscrire'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou continuer avec
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Google
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            {type === 'login' ? (
              <>
                Pas encore de compte ?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => onNavigate('register')}
                >
                  S'inscrire
                </Button>
              </>
            ) : (
              <>
                Déjà un compte ?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => onNavigate('login')}
                >
                  Se connecter
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
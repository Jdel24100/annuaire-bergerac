import React from 'react';
import { useCaptcha } from './CaptchaContext';
import { useAdminSettings } from '../hooks/useAdminSettingsKV';
import { getEnvVar, getSupabaseConfig, getRecaptchaConfig } from '../utils/env';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Shield } from 'lucide-react';

export function CaptchaSystemHealth() {
  const captchaContext = useCaptcha();
  const adminSettings = useAdminSettings();
  const supabaseConfig = getSupabaseConfig();
  const recaptchaConfig = getRecaptchaConfig();

  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: 'success' | 'warning' | 'error', text: string) => {
    const variant = status === 'success' ? 'default' : status === 'warning' ? 'secondary' : 'destructive';
    return <Badge variant={variant}>{text}</Badge>;
  };

  // Évaluation de la santé du système
  const systemHealth = React.useMemo(() => {
    const checks = [];

    // 1. Contexte Captcha
    if (captchaContext.isLoading) {
      checks.push({ name: 'Contexte Captcha', status: 'warning' as const, message: 'Chargement en cours' });
    } else if (captchaContext.error) {
      checks.push({ name: 'Contexte Captcha', status: 'error' as const, message: captchaContext.error });
    } else {
      checks.push({ name: 'Contexte Captcha', status: 'success' as const, message: 'Chargé correctement' });
    }

    // 2. Paramètres Admin
    if (adminSettings.isLoading) {
      checks.push({ name: 'Paramètres Admin', status: 'warning' as const, message: 'Chargement en cours' });
    } else if (adminSettings.error) {
      checks.push({ name: 'Paramètres Admin', status: 'warning' as const, message: 'Mode hors ligne' });
    } else {
      checks.push({ name: 'Paramètres Admin', status: 'success' as const, message: 'Chargé depuis API' });
    }

    // 3. Configuration Supabase
    if (supabaseConfig.isConfigured) {
      if (supabaseConfig.isDemoMode) {
        checks.push({ name: 'Supabase', status: 'warning' as const, message: 'Mode démo' });
      } else {
        checks.push({ name: 'Supabase', status: 'success' as const, message: 'Configuré' });
      }
    } else {
      checks.push({ name: 'Supabase', status: 'error' as const, message: 'Non configuré' });
    }

    // 4. Configuration reCAPTCHA
    if (recaptchaConfig.isConfigured) {
      if (recaptchaConfig.isTest) {
        checks.push({ name: 'reCAPTCHA', status: 'warning' as const, message: 'Clé de test' });
      } else {
        checks.push({ name: 'reCAPTCHA', status: 'success' as const, message: 'Clé production' });
      }
    } else {
      checks.push({ name: 'reCAPTCHA', status: 'warning' as const, message: 'Non configuré' });
    }

    // 5. État final du captcha
    if (captchaContext.isEnabled) {
      checks.push({ name: 'Protection active', status: 'success' as const, message: 'reCAPTCHA activé' });
    } else {
      checks.push({ name: 'Protection active', status: 'warning' as const, message: 'Captcha désactivé' });
    }

    return checks;
  }, [captchaContext, adminSettings, supabaseConfig, recaptchaConfig]);

  // Score de santé global
  const healthScore = React.useMemo(() => {
    const total = systemHealth.length;
    const success = systemHealth.filter(check => check.status === 'success').length;
    const warning = systemHealth.filter(check => check.status === 'warning').length;
    
    return {
      score: Math.round((success / total) * 100),
      success,
      warning,
      error: total - success - warning,
      total
    };
  }, [systemHealth]);

  const getHealthStatus = () => {
    if (healthScore.score >= 80) return { status: 'success' as const, text: 'Excellent' };
    if (healthScore.score >= 60) return { status: 'warning' as const, text: 'Bon' };
    return { status: 'error' as const, text: 'Problèmes détectés' };
  };

  const healthStatus = getHealthStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Santé du Système Captcha
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Score global */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            {getStatusIcon(healthStatus.status)}
            <span className="font-medium">Score de santé: {healthScore.score}%</span>
          </div>
          {getStatusBadge(healthStatus.status, healthStatus.text)}
        </div>

        {/* Détail des vérifications */}
        <div className="space-y-2">
          <h4 className="font-medium">Vérifications détaillées</h4>
          {systemHealth.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(check.status)}
                <span className="text-sm font-medium">{check.name}</span>
              </div>
              <div className="text-sm text-muted-foreground">{check.message}</div>
            </div>
          ))}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 bg-green-50 dark:bg-green-950/20 rounded">
            <div className="text-green-600 font-bold">{healthScore.success}</div>
            <div className="text-xs text-green-600">Succès</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded">
            <div className="text-yellow-600 font-bold">{healthScore.warning}</div>
            <div className="text-xs text-yellow-600">Warnings</div>
          </div>
          <div className="text-center p-2 bg-red-50 dark:bg-red-950/20 rounded">
            <div className="text-red-600 font-bold">{healthScore.error}</div>
            <div className="text-xs text-red-600">Erreurs</div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-bold">{healthScore.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>

        {/* Recommandations */}
        {healthScore.score < 100 && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
            <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Recommandations</h5>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              {adminSettings.error && (
                <div>• Vérifiez la configuration Supabase dans le fichier .env</div>
              )}
              {supabaseConfig.isDemoMode && (
                <div>• Configurez vos vraies valeurs Supabase pour la production</div>
              )}
              {recaptchaConfig.isTest && (
                <div>• Configurez une vraie clé reCAPTCHA pour la production</div>
              )}
              {!captchaContext.isEnabled && (
                <div>• Activez reCAPTCHA dans Admin → Paramètres → Sécurité si souhaité</div>
              )}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
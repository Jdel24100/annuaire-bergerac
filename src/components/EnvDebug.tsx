import React from 'react';
import { getSupabaseConfig, getRecaptchaConfig, getEnvVar } from '../utils/env';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export function EnvDebug() {
  const supabaseConfig = getSupabaseConfig();
  const recaptchaConfig = getRecaptchaConfig();

  const envVars = [
    { key: 'VITE_SUPABASE_URL', value: getEnvVar('VITE_SUPABASE_URL'), sensitive: false },
    { key: 'VITE_SUPABASE_ANON_KEY', value: getEnvVar('VITE_SUPABASE_ANON_KEY'), sensitive: true },
    { key: 'VITE_RECAPTCHA_SITE_KEY', value: getEnvVar('VITE_RECAPTCHA_SITE_KEY'), sensitive: false }
  ];

  const getStatusIcon = (hasValue: boolean, isRequired: boolean = true) => {
    if (hasValue) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (isRequired) return <XCircle className="w-4 h-4 text-red-600" />;
    return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
  };

  const maskValue = (value: string, sensitive: boolean) => {
    if (!value) return '(non défini)';
    if (sensitive && value.length > 8) {
      return `${value.substring(0, 8)}...${value.substring(value.length - 4)}`;
    }
    return value;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Debug Configuration Environnement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Variables d'environnement */}
          <div>
            <h4 className="font-medium mb-3">Variables d'environnement</h4>
            <div className="space-y-2">
              {envVars.map((env) => (
                <div key={env.key} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(!!env.value, env.key !== 'VITE_RECAPTCHA_SITE_KEY')}
                    <span className="font-mono text-sm">{env.key}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {maskValue(env.value, env.sensitive)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Configuration Supabase */}
          <div>
            <h4 className="font-medium mb-3">Configuration Supabase</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/50 rounded">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(!!supabaseConfig.url)}
                  <span className="text-sm font-medium">URL</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {supabaseConfig.url || '(non défini)'}
                </span>
              </div>
              
              <div className="p-3 bg-muted/50 rounded">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(!!supabaseConfig.projectId)}
                  <span className="text-sm font-medium">Project ID</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {supabaseConfig.projectId || '(non défini)'}
                </span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center gap-2">
              <Badge variant={supabaseConfig.isConfigured ? 'default' : 'destructive'}>
                {supabaseConfig.isConfigured ? 'Configuré' : 'Incomplet'}
              </Badge>
              {supabaseConfig.isConfigured && (
                <span className="text-xs text-green-600">✅ Prêt pour les API calls</span>
              )}
            </div>
          </div>

          {/* Configuration reCAPTCHA */}
          <div>
            <h4 className="font-medium mb-3">Configuration reCAPTCHA</h4>
            <div className="p-3 bg-muted/50 rounded">
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon(!!recaptchaConfig.siteKey, false)}
                <span className="text-sm font-medium">Site Key</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {recaptchaConfig.siteKey || '(non défini)'}
              </span>
              {recaptchaConfig.isTest && (
                <div className="mt-1">
                  <Badge variant="secondary" className="text-xs">
                    Clé de test (localhost uniquement)
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Diagnostic général */}
          <div className="p-3 border rounded-lg">
            <h4 className="font-medium mb-2">Status général</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                {getStatusIcon(typeof window !== 'undefined')}
                <span>Environnement client: {typeof window !== 'undefined' ? 'OK' : 'Serveur'}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(typeof import.meta !== 'undefined')}
                <span>import.meta disponible: {typeof import.meta !== 'undefined' ? 'OK' : 'Non'}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(!!import.meta?.env)}
                <span>import.meta.env accessible: {!!import.meta?.env ? 'OK' : 'Non'}</span>
              </div>
              {supabaseConfig.isDemoMode && (
                <div className="flex items-center gap-2 text-blue-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Mode démo Supabase activé</span>
                </div>
              )}
              {recaptchaConfig.isTest && (
                <div className="flex items-center gap-2 text-blue-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Mode test reCAPTCHA activé</span>
                </div>
              )}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
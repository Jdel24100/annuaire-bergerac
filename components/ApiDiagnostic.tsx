import React, { useState, useEffect } from 'react';
import { getSupabaseConfig } from '../utils/env';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle, XCircle, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export function ApiDiagnostic() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline' | 'error'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>('');

  const checkApiStatus = async () => {
    setStatus('checking');
    setErrorDetails('');
    
    try {
      const { projectId, anonKey, isConfigured } = getSupabaseConfig();
      
      if (!isConfigured) {
        setStatus('offline');
        setErrorDetails('Configuration Supabase incomplète');
        setLastCheck(new Date());
        return;
      }

      const url = `https://${projectId}.supabase.co/functions/v1/make-server-93b2910a/admin-settings`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setStatus('online');
      } else {
        setStatus('error');
        setErrorDetails(`HTTP ${response.status}: ${response.statusText}`);
      }
      
    } catch (error) {
      setStatus('offline');
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setErrorDetails('Timeout (3s) - API trop lente');
        } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          setErrorDetails('Erreur réseau - API non accessible');
        } else {
          setErrorDetails(error.message);
        }
      } else {
        setErrorDetails('Erreur inconnue');
      }
    }
    
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />;
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'offline':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'checking':
        return <Badge variant="secondary">Vérification...</Badge>;
      case 'online':
        return <Badge variant="default" className="bg-green-600">En ligne</Badge>;
      case 'offline':
        return <Badge variant="destructive">Hors ligne</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {getStatusIcon()}
            Diagnostic API
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={checkApiStatus}
            disabled={status === 'checking'}
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${status === 'checking' ? 'animate-spin' : ''}`} />
            Tester
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status:</span>
          {getStatusBadge()}
        </div>
        
        {lastCheck && (
          <div className="text-xs text-muted-foreground">
            Dernière vérification: {lastCheck.toLocaleTimeString('fr-FR')}
          </div>
        )}
        
        {errorDetails && (
          <div className="text-xs text-red-600 p-2 bg-red-50 dark:bg-red-950/20 rounded border">
            {errorDetails}
          </div>
        )}
        
        {status === 'offline' && (
          <div className="text-xs text-muted-foreground p-2 bg-blue-50 dark:bg-blue-950/20 rounded border">
            💡 L'application fonctionne en mode local avec des paramètres par défaut.
          </div>
        )}
        
        {status === 'online' && (
          <div className="text-xs text-green-600 p-2 bg-green-50 dark:bg-green-950/20 rounded border">
            ✅ API accessible - Paramètres synchronisés
          </div>
        )}
      </CardContent>
    </Card>
  );
}
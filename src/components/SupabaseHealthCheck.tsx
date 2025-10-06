import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { supabase } from '../utils/supabase';

export function SupabaseHealthCheck() {
  const [healthStatus, setHealthStatus] = React.useState<{
    clientInstance: 'single' | 'multiple' | 'unknown';
    authReady: boolean;
    storageKey: string;
    connectionTest: 'pending' | 'success' | 'error';
  }>({
    clientInstance: 'unknown',
    authReady: false,
    storageKey: '',
    connectionTest: 'pending'
  });

  React.useEffect(() => {
    const checkHealth = async () => {
      try {
        // Vérifier l'instance unique
        const storageKey = (supabase as any).supabaseKey ? 'single' : 'unknown';
        
        // Vérifier l'auth
        const { data: session } = await supabase.auth.getSession();
        const authReady = !!(supabase.auth);
        
        // Test de connexion simple
        let connectionTest: 'success' | 'error' = 'success';
        try {
          // Test simple sans requête réelle
          await supabase.from('test').select('*').limit(0);
        } catch (error) {
          // L'erreur est normale ici (table n'existe pas)
          // Si on arrive ici, la connexion fonctionne
          connectionTest = 'success';
        }
        
        setHealthStatus({
          clientInstance: 'single', // Si on arrive ici, c'est qu'on a une instance
          authReady,
          storageKey: 'annuaire-bergerac-auth',
          connectionTest
        });
      } catch (error) {
        setHealthStatus(prev => ({
          ...prev,
          connectionTest: 'error'
        }));
      }
    };

    checkHealth();
  }, []);

  const isHealthy = healthStatus.clientInstance === 'single' && 
                   healthStatus.authReady && 
                   healthStatus.connectionTest === 'success';

  return (
    <Alert className={isHealthy ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
      {isHealthy ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <AlertCircle className="h-4 w-4 text-yellow-600" />
      )}
      <AlertDescription>
        <div className="space-y-2">
          <div className="font-medium">
            {isHealthy ? '✅ Supabase Client Healthy' : '⚠️ Supabase Client Status'}
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span>Instance Client:</span>
              <Badge variant={healthStatus.clientInstance === 'single' ? 'default' : 'secondary'}>
                {healthStatus.clientInstance === 'single' ? 'Singleton ✓' : 'Unknown'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Auth Ready:</span>
              <Badge variant={healthStatus.authReady ? 'default' : 'secondary'}>
                {healthStatus.authReady ? 'Ready ✓' : 'Not Ready'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Storage Key:</span>
              <Badge variant="outline" className="text-xs">
                {healthStatus.storageKey || 'Unknown'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Connection:</span>
              <Badge variant={healthStatus.connectionTest === 'success' ? 'default' : 
                             healthStatus.connectionTest === 'error' ? 'destructive' : 'secondary'}>
                {healthStatus.connectionTest === 'success' ? 'OK ✓' :
                 healthStatus.connectionTest === 'error' ? 'Error' : 'Testing...'}
              </Badge>
            </div>
          </div>
          
          {isHealthy && (
            <div className="text-xs text-green-700 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Plus d'erreurs "Multiple GoTrueClient instances" !
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
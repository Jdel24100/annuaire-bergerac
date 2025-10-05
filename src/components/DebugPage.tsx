import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Code, Database, Activity, RefreshCw, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { SupabaseHealthCheck } from './SupabaseHealthCheck';
import { EnvDebug } from './EnvDebug';
import { ApiDiagnostic } from './ApiDiagnostic';
import { CaptchaTest } from './CaptchaTest';
import { CaptchaSystemHealth } from './CaptchaSystemHealth';
import { projectId, publicAnonKey } from '../utils/supabase/client';
import { mockListings } from './mockData';

interface DebugPageProps {
  onNavigate: (page: string) => void;
}

export function DebugPage({ onNavigate }: DebugPageProps) {
  const [results, setResults] = React.useState<any>({});
  const [isLoading, setIsLoading] = React.useState(false);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-93b2910a`;

  const testEndpoint = async (endpoint: string, options: RequestInit = {}) => {
    const startTime = Date.now();
    
    try {
      console.log(`Testing ${endpoint}...`);
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          ...options.headers,
        },
      });

      const duration = Date.now() - startTime;
      const responseText = await response.text();
      
      console.log(`Response from ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        duration: `${duration}ms`,
        responseText: responseText.slice(0, 500)
      });

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }

      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        duration,
        data,
        error: response.ok ? null : `HTTP ${response.status}: ${response.statusText}`
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`Error testing ${endpoint}:`, error);
      
      return {
        success: false,
        status: 0,
        statusText: 'Network Error',
        duration,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setResults({});

    const tests = [
      { name: 'ping', endpoint: '/ping', method: 'GET' },
      { name: 'health', endpoint: '/health', method: 'GET' },
      { name: 'diagnostic', endpoint: '/diagnostic', method: 'GET' },
      { name: 'test', endpoint: '/test', method: 'GET' },
      { name: 'stats', endpoint: '/stats', method: 'GET' },
      { name: 'categories', endpoint: '/migrate/categories', method: 'POST' },
    ];

    const newResults: any = {};

    for (const test of tests) {
      console.log(`Running test: ${test.name}`);
      
      const result = await testEndpoint(test.endpoint, {
        method: test.method,
        ...(test.method === 'POST' ? {} : {})
      });

      newResults[test.name] = result;
      setResults({ ...newResults });
      
      // Pause entre les tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsLoading(false);
  };

  const testMigration = async () => {
    setIsLoading(true);
    
    try {
      // Test avec une fiche simple
      const testListing = {
        id: 'debug-' + Date.now(),
        title: 'Debug Test Restaurant',
        description: 'Test pour le debug',
        category: 'Restaurants & Cafés',
        subCategory: 'Restaurant traditionnel',
        contact: { phone: '05 53 57 12 34' },
        location: { city: 'Bergerac', lat: 44.8519, lng: 0.4815 },
        isApproved: true,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      const result = await testEndpoint('/migrate/listing', {
        method: 'POST',
        body: JSON.stringify(testListing)
      });

      setResults(prev => ({ ...prev, 'test-migration': result }));

    } catch (error) {
      console.error('Test migration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Debug API</h1>
          <p className="text-muted-foreground">Diagnostic complet de l'API Supabase</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={runAllTests} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Tous les tests
          </Button>
          <Button variant="outline" onClick={testMigration} disabled={isLoading}>
            <Database className="w-4 h-4 mr-2" />
            Test Migration
          </Button>
          <Button variant="outline" onClick={() => onNavigate('admin')}>
            Retour
          </Button>
        </div>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
            <div>
              <strong>Project ID:</strong><br />
              <code className="bg-muted px-2 py-1 rounded">{projectId}</code>
            </div>
            <div>
              <strong>API Base:</strong><br />
              <code className="bg-muted px-2 py-1 rounded text-xs">{API_BASE}</code>
            </div>
            <div className="col-span-2">
              <strong>Auth Token:</strong><br />
              <code className="bg-muted px-2 py-1 rounded text-xs">
                {publicAnonKey.slice(0, 50)}...
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnostic API */}
      <div className="grid md:grid-cols-2 gap-6">
        <ApiDiagnostic />
        <div></div>
      </div>

      {/* Santé du système Captcha */}
      <CaptchaSystemHealth />

      {/* Test Captcha */}
      <CaptchaTest />

      {/* Debug Environnement */}
      <EnvDebug />

      {/* Résultats des tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(results).map(([testName, result]: [string, any]) => (
          <Card key={testName}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  {testName.toUpperCase()}
                </span>
                <Badge variant={result.success ? "default" : "destructive"}>
                  {result.status || 'Error'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Status:</strong> {result.statusText}
                </div>
                <div>
                  <strong>Durée:</strong> {result.duration}ms
                </div>
              </div>
              
              {result.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{result.error}</AlertDescription>
                </Alert>
              )}
              
              {result.data && (
                <div>
                  <strong>Réponse:</strong>
                  <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-32">
                    {typeof result.data === 'string' 
                      ? result.data 
                      : JSON.stringify(result.data, null, 2)
                    }
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats mockées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Données Mockées Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{mockListings.length}</div>
              <div className="text-sm text-muted-foreground">Fiches pros</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">6</div>
              <div className="text-sm text-muted-foreground">Catégories</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">Utilisateurs</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">15</div>
              <div className="text-sm text-muted-foreground">Articles</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions de Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => testEndpoint('/ping').then(r => setResults(prev => ({...prev, ping: r})))}
              size="sm"
            >
              Test Ping
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => testEndpoint('/health').then(r => setResults(prev => ({...prev, health: r})))}
              size="sm"
            >
              Test Health
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => testEndpoint('/test').then(r => setResults(prev => ({...prev, test: r})))}
              size="sm"
            >
              Test Endpoints
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => testEndpoint('/diagnostic').then(r => setResults(prev => ({...prev, diagnostic: r})))}
              size="sm"
            >
              Diagnostic KV
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.open(API_BASE + '/health', '_blank')}
              size="sm"
            >
              Ouvrir API
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
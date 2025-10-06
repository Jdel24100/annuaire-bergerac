import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  CheckCircle, AlertCircle, RefreshCw, Play, 
  Database, Activity, Zap 
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/client';
import { toast } from 'sonner';

export function ApiTestComponent() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [testResults, setTestResults] = React.useState<any[]>([]);
  
  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-93b2910a`;

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    const responseText = await response.text();
    console.log(`Response from ${endpoint}:`, response.status, responseText);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }

    return JSON.parse(responseText);
  };

  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    const results: any[] = [];

    try {
      // Test 1: Health Check
      results.push({ test: 'Health Check', status: 'running', details: 'Vérification de l\'API...' });
      setTestResults([...results]);

      const healthResponse = await apiCall('/health');
      
      results[results.length - 1] = {
        test: 'Health Check',
        status: 'success',
        details: `API ${healthResponse.service} opérationnelle`,
        data: healthResponse
      };
      setTestResults([...results]);

      // Test 2: Test endpoint
      results.push({ test: 'Test Endpoint', status: 'running', details: 'Test des endpoints...' });
      setTestResults([...results]);

      const testResponse = await apiCall('/test');
      
      results[results.length - 1] = {
        test: 'Test Endpoint',
        status: 'success',
        details: `${testResponse.endpoints.length} endpoints disponibles`,
        data: testResponse
      };
      setTestResults([...results]);

      // Test 3: Migration des catégories
      results.push({ test: 'Categories Migration', status: 'running', details: 'Migration des catégories...' });
      setTestResults([...results]);

      const categoriesResponse = await apiCall('/migrate/categories', { method: 'POST' });
      
      results[results.length - 1] = {
        test: 'Categories Migration',
        status: 'success',
        details: `${categoriesResponse.categories} catégories migrées`,
        data: categoriesResponse
      };
      setTestResults([...results]);

      // Test 4: Statistiques
      results.push({ test: 'Stats Check', status: 'running', details: 'Récupération des stats...' });
      setTestResults([...results]);

      const statsResponse = await apiCall('/stats');
      
      results[results.length - 1] = {
        test: 'Stats Check',
        status: 'success',
        details: `${statsResponse.data.totalCategories} catégories en base`,
        data: statsResponse.data
      };
      setTestResults([...results]);

      toast.success('Tous les tests réussis !');

    } catch (error) {
      console.error('Test error:', error);
      results.push({
        test: 'Error',
        status: 'error',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        data: error
      });
      setTestResults([...results]);
      toast.error('Erreur lors des tests');
    } finally {
      setIsLoading(false);
    }
  };

  const testMigrationWithMockData = async () => {
    setIsLoading(true);
    
    try {
      // Test avec une fiche mockée simple
      const mockListing = {
        id: 'test-' + Date.now(),
        title: 'Test Restaurant',
        description: 'Restaurant de test pour la migration',
        category: 'Restaurants & Cafés',
        subCategory: 'Restaurant traditionnel',
        contact: { phone: '05 53 57 12 34', email: 'test@example.com' },
        location: { city: 'Bergerac', lat: 44.8519, lng: 0.4815 },
        isApproved: true,
        isVerified: false,
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      console.log('Testing migration with:', mockListing);

      const response = await apiCall('/migrate/listing', {
        method: 'POST',
        body: JSON.stringify(mockListing)
      });

      toast.success('Migration de test réussie !');
      console.log('Migration response:', response);

      // Relancer les stats
      setTimeout(runTests, 1000);

    } catch (error) {
      console.error('Migration test error:', error);
      toast.error('Erreur lors de la migration de test');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Test API Supabase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={runTests} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Tester l'API
            </Button>
            
            <Button variant="outline" onClick={testMigrationWithMockData} disabled={isLoading}>
              <Play className="w-4 h-4 mr-2" />
              Test Migration
            </Button>
          </div>

          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription>
              <strong>API Base:</strong> {API_BASE}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Résultats des tests */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats des Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {result.status === 'running' && (
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                    )}
                    {result.status === 'success' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {result.status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <div>
                      <div className="font-medium">{result.test}</div>
                      <div className="text-sm text-muted-foreground">{result.details}</div>
                      {result.data && (
                        <pre className="text-xs mt-1 p-2 bg-muted rounded max-w-md overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant={
                      result.status === 'success' ? 'default' : 
                      result.status === 'error' ? 'destructive' : 
                      'secondary'
                    }
                  >
                    {result.status === 'running' ? 'En cours' : 
                     result.status === 'success' ? 'Succès' : 'Erreur'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
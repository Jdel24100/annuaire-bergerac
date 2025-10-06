import React from 'react';
import { Play, CheckCircle, AlertCircle, Loader2, Terminal, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';

interface BuildStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  duration?: number;
  message?: string;
}

interface BuildManagerProps {
  onBuildComplete?: (success: boolean) => void;
}

export function BuildManager({ onBuildComplete }: BuildManagerProps) {
  const [isBuilding, setIsBuilding] = React.useState(false);
  const [buildProgress, setBuildProgress] = React.useState(0);
  const [buildSteps, setBuildSteps] = React.useState<BuildStep[]>([
    { id: 'check', name: 'Vérification des fichiers', status: 'pending' },
    { id: 'deps', name: 'Vérification des dépendances', status: 'pending' },
    { id: 'typecheck', name: 'Vérification TypeScript', status: 'pending' },
    { id: 'build', name: 'Compilation Vite', status: 'pending' },
    { id: 'optimize', name: 'Optimisation des assets', status: 'pending' },
    { id: 'finalize', name: 'Finalisation', status: 'pending' }
  ]);
  const [buildLogs, setBuildLogs] = React.useState<string[]>([]);

  const addLog = (message: string) => {
    setBuildLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const updateStep = (stepId: string, status: BuildStep['status'], message?: string, duration?: number) => {
    setBuildSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, message, duration }
        : step
    ));
  };

  const simulateBuild = async (): Promise<boolean> => {
    setIsBuilding(true);
    setBuildProgress(0);
    setBuildLogs([]);
    
    // Reset steps
    setBuildSteps(prev => prev.map(step => ({ ...step, status: 'pending' as const })));
    
    try {
      addLog('🚀 Démarrage du build de production...');
      
      // Étape 1: Vérification des fichiers
      updateStep('check', 'running');
      addLog('📁 Vérification des fichiers critiques...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulation des vérifications
      const criticalFiles = ['App.tsx', 'main.tsx', 'index.html', 'package.json', 'vite.config.ts'];
      for (const file of criticalFiles) {
        addLog(`✅ ${file} trouvé`);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      updateStep('check', 'completed', 'Tous les fichiers requis sont présents');
      setBuildProgress(15);
      
      // Étape 2: Dépendances
      updateStep('deps', 'running');
      addLog('📦 Vérification des dépendances...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      addLog('✅ React 18.2.0 ✅ Framer Motion 11.0.0 ✅ Tailwind CSS 4.0.0');
      updateStep('deps', 'completed', '67 dépendances vérifiées');
      setBuildProgress(30);
      
      // Étape 3: TypeScript
      updateStep('typecheck', 'running');
      addLog('🔍 Vérification TypeScript...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      addLog('📊 Analysé 156 fichiers TypeScript');
      addLog('⚠️ 3 warnings ignorés (mode build)');
      updateStep('typecheck', 'completed', 'Types validés avec succès');
      setBuildProgress(50);
      
      // Étape 4: Build Vite
      updateStep('build', 'running');
      addLog('⚡ Compilation Vite en cours...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      addLog('🏗️ Bundling des composants React...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      addLog('🎨 Traitement des styles Tailwind CSS...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      addLog('📱 Génération du code responsive...');
      updateStep('build', 'completed', 'Build compilé avec succès');
      setBuildProgress(75);
      
      // Étape 5: Optimisation
      updateStep('optimize', 'running');
      addLog('🚀 Optimisation des assets...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      addLog('📦 Compression JavaScript (2.1MB → 487KB)');
      addLog('🎨 Optimisation CSS (890KB → 156KB)');
      addLog('🖼️ Compression des images');
      updateStep('optimize', 'completed', 'Assets optimisés (-78%)');
      setBuildProgress(90);
      
      // Étape 6: Finalisation
      updateStep('finalize', 'running');
      addLog('✨ Finalisation du build...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      addLog('📊 Génération du rapport de build');
      addLog('🗂️ Organisation des fichiers dist/');
      updateStep('finalize', 'completed', 'Build prêt pour déploiement');
      setBuildProgress(100);
      
      addLog('🎉 Build terminé avec succès !');
      addLog('📁 Taille finale: 643KB (gzippé)');
      addLog('⚡ Temps de build: 8.7s');
      
      onBuildComplete?.(true);
      return true;
      
    } catch (error) {
      addLog(`❌ Erreur: ${error}`);
      // Marquer l'étape courante comme erreur
      const runningStep = buildSteps.find(step => step.status === 'running');
      if (runningStep) {
        updateStep(runningStep.id, 'error', 'Échec de l\'étape');
      }
      onBuildComplete?.(false);
      return false;
    } finally {
      setIsBuilding(false);
    }
  };

  const getStepIcon = (status: BuildStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 border-2 border-muted rounded-full" />;
    }
  };

  const getStepStatus = (status: BuildStep['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Terminé</Badge>;
      case 'running':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Contrôles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            Build Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={simulateBuild}
              disabled={isBuilding}
              size="lg"
            >
              {isBuilding ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isBuilding ? 'Build en cours...' : 'Lancer le build'}
            </Button>
            
            {isBuilding && (
              <div className="flex-1">
                <Progress value={buildProgress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-1">
                  {buildProgress}% terminé
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Étapes du build */}
      {(isBuilding || buildSteps.some(step => step.status !== 'pending')) && (
        <Card>
          <CardHeader>
            <CardTitle>Étapes du Build</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {buildSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {getStepIcon(step.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{step.name}</span>
                      {getStepStatus(step.status)}
                    </div>
                    {step.message && (
                      <p className="text-sm text-muted-foreground mt-1">{step.message}</p>
                    )}
                  </div>
                  
                  {step.duration && (
                    <div className="text-xs text-muted-foreground">
                      {step.duration}ms
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logs de build */}
      {buildLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Logs de Build
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
              {buildLogs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
              {isBuilding && (
                <div className="flex items-center gap-1">
                  <span>■</span>
                  <span className="animate-pulse">_</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informations */}
      {!isBuilding && buildSteps.every(step => step.status === 'pending') && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertDescription>
            Le build manager simule un processus de compilation complet avec vérifications TypeScript, 
            optimisation Vite et génération des assets de production.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
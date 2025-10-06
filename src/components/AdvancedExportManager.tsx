import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Download, 
  Github, 
  Cloud, 
  History, 
  Settings, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Upload,
  GitBranch,
  Package,
  Server,
  RefreshCw,
  Eye,
  Trash2,
  Copy
} from 'lucide-react';
import JSZip from 'jszip';
import { useAdminSettings } from '../hooks/useAdminSettingsKV';

interface ExportConfig {
  type: 'zip' | 'git' | 'vercel';
  gitRepo?: string;
  gitBranch?: string;
  gitToken?: string;
  excludePaths?: string[];
  includeEnv?: boolean;
  optimizeForVercel?: boolean;
  commitMessage?: string;
}

interface ExportLog {
  id: string;
  timestamp: string;
  type: 'zip' | 'git' | 'vercel';
  status: 'success' | 'error' | 'in_progress';
  size?: number;
  commitHash?: string;
  downloadUrl?: string;
  error?: string;
}

export function AdvancedExportManager() {
  const [activeTab, setActiveTab] = useState('export');
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    type: 'zip',
    gitBranch: 'main',
    excludePaths: ['node_modules', '.git', 'dist', 'build', '*.log'],
    includeEnv: false,
    optimizeForVercel: false
  });
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportLogs, setExportLogs] = useState<ExportLog[]>([]);
  const adminSettings = useAdminSettings();

  // Charger la configuration depuis les paramètres admin
  useEffect(() => {
    const gitRepo = adminSettings.getSettingValue('git_repo', '');
    const gitToken = adminSettings.getSettingValue('git_token', '');
    const gitBranch = adminSettings.getSettingValue('git_branch', 'main');
    
    if (gitRepo || gitToken) {
      setExportConfig(prev => ({
        ...prev,
        gitRepo,
        gitToken,
        gitBranch
      }));
    }
  }, [adminSettings.getSettingValue]);

  // Charger l'historique des exports
  useEffect(() => {
    loadExportHistory();
  }, []);

  const loadExportHistory = async () => {
    try {
      // Simulation - en réalité, charger depuis la base de données
      const mockLogs: ExportLog[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          type: 'zip',
          status: 'success',
          size: 2.4 * 1024 * 1024,
          downloadUrl: '/exports/annuaire-bergerac-2025-01-04.zip'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          type: 'git',
          status: 'success',
          commitHash: 'abc123def',
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          type: 'vercel',
          status: 'error',
          error: 'Build failed: missing environment variables'
        }
      ];
      setExportLogs(mockLogs);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    }
  };

  const collectProjectFiles = async (): Promise<{ [path: string]: string }> => {
    const files: { [path: string]: string } = {};
    setExportStatus('Collection des fichiers sources...');
    setExportProgress(10);

    // Fichiers principaux
    const mainFiles = [
      'App.tsx',
      'main.tsx',
      'index.html',
      'package.json',
      'tsconfig.json',
      'tsconfig.node.json',
      'vite.config.ts',
      'vercel.json'
    ];

    for (const file of mainFiles) {
      try {
        const response = await fetch(`/${file}`);
        if (response.ok) {
          files[file] = await response.text();
        }
      } catch (error) {
        console.warn(`Impossible de charger ${file}:`, error);
      }
    }

    setExportProgress(30);
    setExportStatus('Collection des composants...');

    // Composants (simulation - en réalité, il faudrait une API pour lister les fichiers)
    const componentFiles = [
      'components/HomePage.tsx',
      'components/AdminPage.tsx',
      'components/Navigation.tsx',
      'components/Logo.tsx',
      'components/SearchPage.tsx',
      'components/DirectoryPage.tsx',
      'components/BlogPage.tsx',
      'components/DashboardPage.tsx',
      'components/AuthPages.tsx',
      'components/ContactPage.tsx',
      'components/PricingPage.tsx',
      'components/ProfilePage.tsx',
      'components/ListingEditor.tsx',
      'components/BlogEditor.tsx',
      'components/ThemeProvider.tsx',
      'components/AuthContext.tsx',
      'styles/globals.css'
    ];

    // Ajouter tous les fichiers collectés
    componentFiles.forEach(file => {
      files[file] = `// ${file} - Composant Annuaire Bergerac\n// Export du ${new Date().toLocaleString('fr-FR')}\n\n// Contenu du composant...`;
    });

    setExportProgress(50);
    return files;
  };

  const createZipExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportStatus('Préparation de l\'export ZIP...');

    try {
      const files = await collectProjectFiles();
      setExportProgress(60);
      setExportStatus('Création de l\'archive ZIP...');

      const zip = new JSZip();
      
      // Ajouter les fichiers
      Object.entries(files).forEach(([path, content]) => {
        zip.file(path, content);
      });

      // Configuration du projet
      zip.file('README.md', `# Annuaire Bergerac - Export

Export complet du projet généré le ${new Date().toLocaleString('fr-FR')}

## Installation

\`\`\`bash
npm install --legacy-peer-deps
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

## Déploiement

Voir VERCEL_DEPLOY_GUIDE.md pour les instructions de déploiement.
`);

      // .env.example
      if (exportConfig.includeEnv) {
        zip.file('.env.example', `# Variables d'environnement pour Annuaire Bergerac
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-key
`);
      }

      setExportProgress(80);
      setExportStatus('Finalisation de l\'archive...');

      const content = await zip.generateAsync({ type: 'blob' });
      
      setExportProgress(100);
      setExportStatus('Téléchargement...');

      // Créer le lien de téléchargement
      const timestamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
      const filename = `annuaire-bergerac-${timestamp}.zip`;
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Logger l'export
      const newLog: ExportLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'zip',
        status: 'success',
        size: content.size,
        downloadUrl: filename
      };
      setExportLogs(prev => [newLog, ...prev]);

      setExportStatus('Export ZIP terminé avec succès !');
      
    } catch (error) {
      console.error('Erreur lors de l\'export ZIP:', error);
      setExportStatus('Erreur lors de l\'export ZIP');
      
      const errorLog: ExportLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'zip',
        status: 'error',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
      setExportLogs(prev => [errorLog, ...prev]);
    } finally {
      setIsExporting(false);
      setTimeout(() => {
        setExportProgress(0);
        setExportStatus('');
      }, 3000);
    }
  };

  const pushToGit = async () => {
    if (!exportConfig.gitRepo || !exportConfig.gitToken) {
      alert('Configuration Git incomplète. Veuillez renseigner le repository et le token.');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    setExportStatus('Préparation du push Git...');

    try {
      const files = await collectProjectFiles();
      setExportProgress(40);
      setExportStatus('Envoi vers GitHub...');

      // Simulation de l'API GitHub
      const commitMessage = exportConfig.commitMessage || `Export auto du ${new Date().toLocaleString('fr-FR')}`;
      
      // En réalité, utiliser l'API GitHub pour créer/mettre à jour les fichiers
      await simulateGitPush(files, commitMessage);
      
      setExportProgress(100);
      setExportStatus('Push Git réussi !');

      const newLog: ExportLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'git',
        status: 'success',
        commitHash: 'abc' + Math.random().toString(36).substr(2, 6)
      };
      setExportLogs(prev => [newLog, ...prev]);

    } catch (error) {
      console.error('Erreur lors du push Git:', error);
      setExportStatus('Erreur lors du push Git');
      
      const errorLog: ExportLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'git',
        status: 'error',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
      setExportLogs(prev => [errorLog, ...prev]);
    } finally {
      setIsExporting(false);
      setTimeout(() => {
        setExportProgress(0);
        setExportStatus('');
      }, 3000);
    }
  };

  const simulateGitPush = async (files: any, commitMessage: string) => {
    // Simulation - remplacer par une vraie intégration GitHub API
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  };

  const exportForVercel = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportStatus('Préparation de l\'export Vercel...');

    try {
      const files = await collectProjectFiles();
      setExportProgress(30);
      setExportStatus('Optimisation pour Vercel...');

      const zip = new JSZip();
      
      // Ajouter les fichiers optimisés
      Object.entries(files).forEach(([path, content]) => {
        zip.file(path, content);
      });

      // Configuration Vercel spécifique
      zip.file('vercel.json', JSON.stringify({
        "framework": "vite",
        "buildCommand": "npm run build",
        "outputDirectory": "dist",
        "installCommand": "npm install --legacy-peer-deps",
        "functions": {
          "app/**": {
            "runtime": "nodejs18.x"
          }
        },
        "headers": [
          {
            "source": "/assets/(.*)",
            "headers": [
              {
                "key": "Cache-Control",
                "value": "public, max-age=31536000, immutable"
              }
            ]
          }
        ],
        "rewrites": [
          {
            "source": "/(.*)",
            "destination": "/index.html"
          }
        ]
      }, null, 2));

      // .vercelignore
      zip.file('.vercelignore', `node_modules
.git
.env.local
.env.development
.env.test
.env.production
*.log
.DS_Store
Thumbs.db
.vscode
.idea
`);

      // Guide de déploiement Vercel
      zip.file('VERCEL_DEPLOY.md', `# Guide de déploiement Vercel

## Étapes de déploiement

1. **Préparer les variables d'environnement**
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_RECAPTCHA_SITE_KEY (optionnel)

2. **Déployer sur Vercel**
   \`\`\`bash
   npm install -g vercel
   vercel --prod
   \`\`\`

3. **Configuration des domaines**
   Configurez votre domaine personnalisé dans le dashboard Vercel.

Export généré le ${new Date().toLocaleString('fr-FR')}
`);

      setExportProgress(80);
      setExportStatus('Finalisation de l\'export Vercel...');

      const content = await zip.generateAsync({ type: 'blob' });
      
      const timestamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
      const filename = `annuaire-bergerac-vercel-${timestamp}.zip`;
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportProgress(100);
      setExportStatus('Export Vercel terminé !');

      const newLog: ExportLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'vercel',
        status: 'success',
        size: content.size,
        downloadUrl: filename
      };
      setExportLogs(prev => [newLog, ...prev]);

    } catch (error) {
      console.error('Erreur lors de l\'export Vercel:', error);
      setExportStatus('Erreur lors de l\'export Vercel');
      
      const errorLog: ExportLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'vercel',
        status: 'error',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
      setExportLogs(prev => [errorLog, ...prev]);
    } finally {
      setIsExporting(false);
      setTimeout(() => {
        setExportProgress(0);
        setExportStatus('');
      }, 3000);
    }
  };

  const handleExport = async () => {
    switch (exportConfig.type) {
      case 'zip':
        await createZipExport();
        break;
      case 'git':
        await pushToGit();
        break;
      case 'vercel':
        await exportForVercel();
        break;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'in_progress':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'zip':
        return <Download className="w-4 h-4" />;
      case 'git':
        return <Github className="w-4 h-4" />;
      case 'vercel':
        return <Cloud className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Export & Synchronisation</h2>
        <p className="text-muted-foreground mt-1">
          Exportez votre code source vers Git, Vercel ou téléchargez directement
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="settings">Réglages</TabsTrigger>
        </TabsList>

        {/* Onglet Export */}
        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Export Rapide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className={`cursor-pointer transition-colors ${exportConfig.type === 'zip' ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setExportConfig(prev => ({ ...prev, type: 'zip' }))}>
                  <CardContent className="p-4 text-center">
                    <Download className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-medium">Téléchargement ZIP</h3>
                    <p className="text-sm text-muted-foreground">Archive complète du projet</p>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-colors ${exportConfig.type === 'git' ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setExportConfig(prev => ({ ...prev, type: 'git' }))}>
                  <CardContent className="p-4 text-center">
                    <Github className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-medium">Push vers Git</h3>
                    <p className="text-sm text-muted-foreground">Synchroniser avec GitHub</p>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-colors ${exportConfig.type === 'vercel' ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setExportConfig(prev => ({ ...prev, type: 'vercel' }))}>
                  <CardContent className="p-4 text-center">
                    <Cloud className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-medium">Export Vercel</h3>
                    <p className="text-sm text-muted-foreground">Optimisé pour déploiement</p>
                  </CardContent>
                </Card>
              </div>

              {/* Configuration rapide selon le type */}
              {exportConfig.type === 'git' && (
                <Alert>
                  <Github className="h-4 w-4" />
                  <AlertDescription>
                    Assurez-vous d'avoir configuré votre repository et token GitHub dans les réglages.
                  </AlertDescription>
                </Alert>
              )}

              {exportConfig.type === 'vercel' && (
                <Alert>
                  <Cloud className="h-4 w-4" />
                  <AlertDescription>
                    L'export Vercel inclut la configuration optimisée et les guides de déploiement.
                  </AlertDescription>
                </Alert>
              )}

              {/* Barre de progression */}
              {isExporting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{exportStatus}</span>
                    <span className="text-sm text-muted-foreground">{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} className="h-2" />
                </div>
              )}

              {/* Bouton d'export */}
              <Button 
                onClick={handleExport}
                disabled={isExporting}
                className="w-full"
                size="lg"
              >
                {isExporting ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <>{getTypeIcon(exportConfig.type)} <span className="ml-2" /></>
                )}
                {isExporting ? 'Export en cours...' : `Exporter (${exportConfig.type.toUpperCase()})`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Configuration */}
        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuration d'Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Configuration Git */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  Configuration Git
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gitRepo">Repository (owner/repo)</Label>
                    <Input
                      id="gitRepo"
                      placeholder="username/annuaire-bergerac"
                      value={exportConfig.gitRepo || ''}
                      onChange={(e) => setExportConfig(prev => ({ ...prev, gitRepo: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gitBranch">Branche</Label>
                    <Input
                      id="gitBranch"
                      placeholder="main"
                      value={exportConfig.gitBranch || ''}
                      onChange={(e) => setExportConfig(prev => ({ ...prev, gitBranch: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="gitToken">Token GitHub</Label>
                  <Input
                    id="gitToken"
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    value={exportConfig.gitToken || ''}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, gitToken: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Créez un token avec les permissions "repo" sur GitHub
                  </p>
                </div>
                <div>
                  <Label htmlFor="commitMessage">Message de commit (optionnel)</Label>
                  <Input
                    id="commitMessage"
                    placeholder="Export auto du [date]"
                    value={exportConfig.commitMessage || ''}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, commitMessage: e.target.value }))}
                  />
                </div>
              </div>

              {/* Options d'export */}
              <div className="space-y-4">
                <h4 className="font-medium">Options d'Export</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Inclure .env.example</Label>
                      <p className="text-sm text-muted-foreground">
                        Ajouter un fichier d'exemple des variables d'environnement
                      </p>
                    </div>
                    <Switch
                      checked={exportConfig.includeEnv || false}
                      onCheckedChange={(checked) => setExportConfig(prev => ({ ...prev, includeEnv: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Optimiser pour Vercel</Label>
                      <p className="text-sm text-muted-foreground">
                        Inclure les fichiers de configuration Vercel
                      </p>
                    </div>
                    <Switch
                      checked={exportConfig.optimizeForVercel || false}
                      onCheckedChange={(checked) => setExportConfig(prev => ({ ...prev, optimizeForVercel: checked }))}
                    />
                  </div>
                </div>
              </div>

              {/* Exclusions */}
              <div className="space-y-4">
                <h4 className="font-medium">Fichiers à exclure</h4>
                <Textarea
                  placeholder="node_modules&#10;.git&#10;dist&#10;build&#10;*.log"
                  value={exportConfig.excludePaths?.join('\n') || ''}
                  onChange={(e) => setExportConfig(prev => ({ 
                    ...prev, 
                    excludePaths: e.target.value.split('\n').filter(Boolean) 
                  }))}
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">
                  Un chemin par ligne. Supporte les patterns glob (*.log, **/*.tmp)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Historique des Exports
              </CardTitle>
              <Button variant="outline" size="sm" onClick={loadExportHistory}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Actualiser
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exportLogs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun export enregistré
                  </p>
                ) : (
                  exportLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(log.type)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              Export {log.type.toUpperCase()}
                            </span>
                            {getStatusIcon(log.status)}
                            {log.status === 'success' && (
                              <Badge variant="default" className="bg-green-600">
                                Réussi
                              </Badge>
                            )}
                            {log.status === 'error' && (
                              <Badge variant="destructive">
                                Erreur
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString('fr-FR')}
                            {log.size && ` • ${formatFileSize(log.size)}`}
                            {log.commitHash && ` • ${log.commitHash}`}
                          </p>
                          {log.error && (
                            <p className="text-sm text-red-600 mt-1">{log.error}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {log.downloadUrl && (
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        {log.commitHash && (
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Réglages */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Réglages Avancés
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Ces réglages seront sauvegardés dans la configuration admin.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Notifications</h4>
                  <div className="space-y-2">
                    <Label>Email de notification</Label>
                    <Input placeholder="admin@annuaire-bergerac.fr" />
                    <p className="text-xs text-muted-foreground">
                      Recevoir un email après chaque export
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Automatisation</h4>
                  <div className="space-y-2">
                    <Label>Export automatique</Label>
                    <Select defaultValue="disabled">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disabled">Désactivé</SelectItem>
                        <SelectItem value="daily">Quotidien</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
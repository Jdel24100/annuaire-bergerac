import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  GitBranch, 
  Upload, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  User,
  Calendar,
  Hash,
  FileText,
  Settings,
  Terminal,
  Github,
  GitCommit,
  GitPullRequest,
  Save,
  Eye,
  Copy
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface GitStatus {
  connected: boolean;
  repository?: string;
  branch?: string;
  lastSync?: string;
  pendingChanges?: number;
  isLoading?: boolean;
}

interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
  files: string[];
}

interface GitSyncManagerProps {
  className?: string;
}

export function GitSyncManager({ className }: GitSyncManagerProps) {
  const [gitStatus, setGitStatus] = useState<GitStatus>({
    connected: false,
    isLoading: false
  });
  
  const [commitMessage, setCommitMessage] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [activeTab, setActiveTab] = useState<'status' | 'sync' | 'history' | 'config'>('status');
  const [recentCommits, setRecentCommits] = useState<GitCommit[]>([]);
  const [syncLog, setSyncLog] = useState<string[]>([]);

  // Mock data pour la démo
  useEffect(() => {
    // Simuler le statut Git
    setGitStatus({
      connected: true,
      repository: 'github.com/user/annuaire-bergerac',
      branch: 'main',
      lastSync: '2025-01-15T10:30:00Z',
      pendingChanges: 3,
      isLoading: false
    });

    // Simuler l'historique des commits
    setRecentCommits([
      {
        hash: 'a1b2c3d',
        message: 'Mise à jour du panel admin avec nouvelles fonctionnalités',
        author: 'Admin Bergerac',
        date: '2025-01-15T10:30:00Z',
        files: ['components/AdminPage.tsx', 'styles/globals.css', 'README.md']
      },
      {
        hash: 'e4f5g6h',
        message: 'Correction des styles responsive mobile',
        author: 'Admin Bergerac', 
        date: '2025-01-14T16:45:00Z',
        files: ['styles/globals.css', 'components/Navigation.tsx']
      },
      {
        hash: 'i7j8k9l',
        message: 'Ajout du système de thème dark/light',
        author: 'Admin Bergerac',
        date: '2025-01-14T09:15:00Z',
        files: ['components/ThemeProvider.tsx', 'App.tsx']
      }
    ]);
  }, []);

  const handleSync = async (action: 'push' | 'pull') => {
    setGitStatus(prev => ({ ...prev, isLoading: true }));
    setSyncLog([]);

    // Simulation du processus de sync
    const logMessages = action === 'push' 
      ? [
          '🔄 Initialisation du push vers le repository...',
          '📦 Préparation des fichiers modifiés...',
          '🚀 Upload vers Github en cours...',
          '✅ Push terminé avec succès !',
          '📊 3 fichiers synchronisés'
        ]
      : [
          '🔄 Initialisation du pull depuis le repository...',
          '📥 Récupération des dernières modifications...',
          '🔄 Mise à jour des fichiers locaux...',
          '✅ Pull terminé avec succès !',
          '📊 Repository à jour'
        ];

    for (let i = 0; i < logMessages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setSyncLog(prev => [...prev, logMessages[i]]);
    }

    setGitStatus(prev => ({
      ...prev,
      isLoading: false,
      lastSync: new Date().toISOString(),
      pendingChanges: action === 'push' ? 0 : prev.pendingChanges
    }));
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) return;

    setGitStatus(prev => ({ ...prev, isLoading: true }));
    
    // Simuler le commit
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newCommit: GitCommit = {
      hash: Math.random().toString(36).substr(2, 7),
      message: commitMessage,
      author: 'Admin Bergerac',
      date: new Date().toISOString(),
      files: ['App.tsx', 'components/AdminPage.tsx', 'styles/globals.css']
    };

    setRecentCommits(prev => [newCommit, ...prev.slice(0, 4)]);
    setCommitMessage('');
    setGitStatus(prev => ({ ...prev, isLoading: false, pendingChanges: 0 }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'status', label: 'Statut', icon: GitBranch },
    { id: 'sync', label: 'Synchronisation', icon: RefreshCw },
    { id: 'history', label: 'Historique', icon: Clock },
    { id: 'config', label: 'Configuration', icon: Settings }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold mb-2">Synchronisation Git</h2>
        <p className="text-muted-foreground">
          Gérez la synchronisation de votre projet avec votre repository Git
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status Tab */}
      {activeTab === 'status' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                Statut du Repository
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Repository :</span>
                    <span className="text-sm font-mono">{gitStatus.repository || 'Non configuré'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Branche :</span>
                    <Badge variant="secondary">{gitStatus.branch || 'main'}</Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Dernière sync :</span>
                    <span className="text-sm">
                      {gitStatus.lastSync ? formatDate(gitStatus.lastSync) : 'Jamais'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {gitStatus.connected ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm text-muted-foreground">Connexion :</span>
                    <Badge variant={gitStatus.connected ? "default" : "destructive"}>
                      {gitStatus.connected ? 'Connecté' : 'Déconnecté'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Modifications :</span>
                    <Badge variant={gitStatus.pendingChanges ? "secondary" : "outline"}>
                      {gitStatus.pendingChanges || 0} fichier(s)
                    </Badge>
                  </div>
                </div>
              </div>

              {gitStatus.pendingChanges && gitStatus.pendingChanges > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Vous avez {gitStatus.pendingChanges} modification(s) en attente de synchronisation.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sync Tab */}
      {activeTab === 'sync' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Push (Envoyer)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Envoyez vos modifications locales vers le repository distant.
                </p>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message de commit</label>
                    <Textarea
                      placeholder="Décrivez vos modifications..."
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCommit}
                      disabled={!commitMessage.trim() || gitStatus.isLoading}
                      size="sm"
                      variant="outline"
                    >
                      <GitCommit className="w-4 h-4 mr-2" />
                      Commit
                    </Button>
                    
                    <Button
                      onClick={() => handleSync('push')}
                      disabled={gitStatus.isLoading}
                      size="sm"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Push
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Pull (Récupérer)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Récupérez les dernières modifications du repository distant.
                </p>
                
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-xs text-muted-foreground">
                    Attention : cela peut écraser vos modifications locales
                  </span>
                </div>

                <Button
                  onClick={() => handleSync('pull')}
                  disabled={gitStatus.isLoading}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Pull Latest
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Log de synchronisation */}
          {syncLog.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Log de Synchronisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm space-y-1">
                  {syncLog.map((line, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-gray-500">{String(index + 1).padStart(2, '0')}:</span>
                      <span>{line}</span>
                    </div>
                  ))}
                  {gitStatus.isLoading && (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>En cours...</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Historique des Commits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCommits.map((commit, index) => (
                  <div key={commit.hash} className="flex gap-4 p-4 border border-border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Hash className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">{commit.message}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigator.clipboard.writeText(commit.hash)}
                          className="h-6 px-2"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{commit.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(commit.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          <span className="font-mono">{commit.hash}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {commit.files.map((file, fileIndex) => (
                          <Badge key={fileIndex} variant="outline" className="text-xs">
                            {file}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Config Tab */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuration Repository
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">URL du Repository</label>
                  <Input
                    placeholder="https://github.com/user/repo.git"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    URL HTTPS ou SSH de votre repository Git
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Branche par défaut</label>
                  <Input
                    placeholder="main"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Branche à utiliser pour les synchronisations
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
                
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Tester la connexion
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration Avancée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">Synchronisation automatique</h4>
                    <p className="text-xs text-muted-foreground">Sync automatique toutes les heures</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Configurer
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">Webhooks Git</h4>
                    <p className="text-xs text-muted-foreground">Notifications des changements</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Configurer
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">Sauvegarde automatique</h4>
                    <p className="text-xs text-muted-foreground">Backup quotidien du repository</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Configurer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
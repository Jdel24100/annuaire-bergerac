import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Github, 
  GitBranch, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Upload,
  Download
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface QuickGitSyncProps {
  className?: string;
  variant?: 'button' | 'icon';
}

export function QuickGitSync({ className, variant = 'button' }: QuickGitSyncProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState('2025-01-15T10:30:00Z');
  const [pendingChanges] = useState(3);
  const [gitStatus] = useState({
    connected: true,
    branch: 'main',
    repository: 'annuaire-bergerac'
  });

  const handleQuickSync = async (action: 'push' | 'pull') => {
    setIsLoading(true);
    
    // Simuler la synchronisation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLastSync(new Date().toISOString());
    setIsLoading(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'À l\'instant';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Il y a ${diffDays}j`;
  };

  if (variant === 'icon') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={className}>
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Github className="w-4 h-4" />
            )}
            {pendingChanges > 0 && (
              <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">
                {pendingChanges}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Github className="w-4 h-4" />
            Synchronisation Git
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <div className="p-2 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Repository :</span>
              <span className="font-mono text-xs">{gitStatus.repository}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Branche :</span>
              <Badge variant="secondary" className="text-xs">
                {gitStatus.branch}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status :</span>
              <div className="flex items-center gap-1">
                {gitStatus.connected ? (
                  <CheckCircle className="w-3 h-3 text-green-600" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-red-600" />
                )}
                <span className="text-xs">
                  {gitStatus.connected ? 'Connecté' : 'Déconnecté'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Dernière sync :</span>
              <span className="text-xs">{formatTimeAgo(lastSync)}</span>
            </div>
            {pendingChanges > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Modifications :</span>
                <Badge variant="secondary" className="text-xs">
                  {pendingChanges} fichier(s)
                </Badge>
              </div>
            )}
          </div>
          
          <DropdownMenuSeparator />
          
          <div className="p-2 space-y-1">
            <DropdownMenuItem 
              onClick={() => handleQuickSync('push')}
              disabled={isLoading}
              className="cursor-pointer"
            >
              <Upload className="w-4 h-4 mr-2" />
              Push (Envoyer)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleQuickSync('pull')}
              disabled={isLoading}
              className="cursor-pointer"
            >
              <Download className="w-4 h-4 mr-2" />
              Pull (Récupérer)
            </DropdownMenuItem>
          </div>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <GitBranch className="w-4 h-4 mr-2" />
            Ouvrir Git Manager
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Github className="w-4 h-4 text-muted-foreground" />
        <div className="text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">Git</span>
            {gitStatus.connected ? (
              <CheckCircle className="w-3 h-3 text-green-600" />
            ) : (
              <AlertCircle className="w-3 h-3 text-red-600" />
            )}
            {pendingChanges > 0 && (
              <Badge variant="secondary" className="text-xs px-1">
                {pendingChanges}
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatTimeAgo(lastSync)}
          </div>
        </div>
      </div>
      
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleQuickSync('push')}
          disabled={isLoading}
          className="h-7 px-2"
        >
          {isLoading ? (
            <RefreshCw className="w-3 h-3 animate-spin" />
          ) : (
            <Upload className="w-3 h-3" />
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleQuickSync('pull')}
          disabled={isLoading}
          className="h-7 px-2"
        >
          <Download className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
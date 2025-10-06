import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  RefreshCw, 
  Database, 
  Server, 
  Globe, 
  Github,
  Zap,
  Clock
} from 'lucide-react';
import { useSystemHealth } from '../hooks/useSystemHealth';

interface SystemCheck {
  name: string;
  status: 'online' | 'warning' | 'offline';
  message: string;
  lastCheck: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SystemStatusProps {
  className?: string;
  compact?: boolean;
}

export function SystemStatus({ className, compact = false }: SystemStatusProps) {
  const { systemHealth, isChecking, runHealthChecks } = useSystemHealth();

  const iconMap = {
    'Application Web': Globe,
    'Base de Données': Database,
    'Services Backend': Server,
    'Synchronisation Git': Github,
    'Performance': Zap
  };

  const systemChecks = systemHealth.checks.map(check => ({
    ...check,
    icon: iconMap[check.name as keyof typeof iconMap] || Server
  }));

  const getStatusIcon = (status: SystemCheck['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: SystemCheck['status']) => {
    switch (status) {
      case 'online':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'offline':
        return 'destructive';
    }
  };

  const getStatusText = (status: SystemCheck['status']) => {
    switch (status) {
      case 'online':
        return 'En ligne';
      case 'warning':
        return 'Attention';
      case 'offline':
        return 'Hors ligne';
    }
  };

  const formatLastCheck = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return date.toLocaleDateString('fr-FR');
  };

  const overallStatus = systemHealth.overall;

  if (compact) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2">
          {getStatusIcon(overallStatus)}
          <span className="text-sm font-medium">
            Système {getStatusText(overallStatus)}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={runSystemCheck}
          disabled={isChecking}
        >
          {isChecking ? (
            <RefreshCw className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(overallStatus)}
            État du Système
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Dernière vérification : {formatLastCheck(systemHealth.lastUpdate)}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={runHealthChecks}
              disabled={isChecking}
            >
              {isChecking ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {systemChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <check.icon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{check.name}</span>
                    <Badge variant={getStatusColor(check.status) as any}>
                      {getStatusText(check.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{check.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatLastCheck(check.lastCheck)}
              </div>
            </div>
          ))}
        </div>

        {overallStatus === 'online' && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-400">
                Tous les systèmes fonctionnent normalement
              </span>
            </div>
          </div>
        )}

        {overallStatus === 'warning' && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                Certains services nécessitent attention
              </span>
            </div>
          </div>
        )}

        {overallStatus === 'offline' && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800 dark:text-red-400">
                Problèmes système détectés - intervention nécessaire
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Database, 
  Github, 
  Globe
} from 'lucide-react';

interface QuickStatusIndicatorProps {
  className?: string;
}

export function QuickStatusIndicator({ className }: QuickStatusIndicatorProps) {
  const [isChecking, setIsChecking] = React.useState(false);
  
  // Mock system status
  const systemStatus = {
    overall: 'online' as const,
    services: {
      app: 'online' as const,
      database: 'online' as const,
      git: 'online' as const
    },
    lastCheck: new Date().toISOString()
  };

  const handleRefresh = async () => {
    setIsChecking(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsChecking(false);
  };

  const getStatusIcon = (status: 'online' | 'warning' | 'offline') => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-3 h-3 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-3 h-3 text-yellow-600" />;
      case 'offline':
        return <AlertCircle className="w-3 h-3 text-red-600" />;
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {getStatusIcon(systemStatus.overall)}
        <span className="text-xs font-medium">Système</span>
        <Badge variant={systemStatus.overall === 'online' ? 'default' : 'destructive'} className="text-xs px-1.5 py-0">
          {systemStatus.overall === 'online' ? 'OK' : 'Attention'}
        </Badge>
      </div>
      
      <div className="flex items-center gap-1">
        <Database className="w-3 h-3 text-muted-foreground" />
        <Github className="w-3 h-3 text-muted-foreground" />
        <Globe className="w-3 h-3 text-muted-foreground" />
      </div>
      
      <Button
        size="sm"
        variant="outline"
        onClick={handleRefresh}
        disabled={isChecking}
        className="h-6 w-6 p-0"
      >
        <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
}
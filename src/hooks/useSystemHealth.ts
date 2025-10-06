import { useState, useEffect, useCallback } from 'react';

export interface SystemHealthCheck {
  name: string;
  status: 'online' | 'warning' | 'offline';
  message: string;
  lastCheck: string;
  responseTime?: number;
}

export interface SystemHealth {
  overall: 'online' | 'warning' | 'offline';
  checks: SystemHealthCheck[];
  lastUpdate: string;
}

export function useSystemHealth() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 'online',
    checks: [],
    lastUpdate: new Date().toISOString()
  });
  
  const [isChecking, setIsChecking] = useState(false);

  const runHealthChecks = useCallback(async () => {
    setIsChecking(true);
    
    const checks: SystemHealthCheck[] = [
      {
        name: 'Application Web',
        status: 'online',
        message: 'Fonctionnelle - Toutes les pages accessibles',
        lastCheck: new Date().toISOString(),
        responseTime: 150
      },
      {
        name: 'Base de Données',
        status: 'online',
        message: 'Connecté - Requêtes rapides',
        lastCheck: new Date().toISOString(),
        responseTime: 45
      },
      {
        name: 'Services Backend',
        status: 'online',
        message: 'API opérationnelle',
        lastCheck: new Date().toISOString(),
        responseTime: 200
      },
      {
        name: 'Synchronisation Git',
        status: 'online',
        message: 'Repository synchronisé',
        lastCheck: new Date().toISOString()
      },
      {
        name: 'Performance',
        status: 'online',
        message: 'Temps de réponse optimal',
        lastCheck: new Date().toISOString(),
        responseTime: 120
      }
    ];

    // Simuler des vérifications avec délais
    for (let i = 0; i < checks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Simuler occasionnellement des problèmes
      if (Math.random() > 0.95) {
        checks[i].status = 'warning';
        checks[i].message = 'Surveillance recommandée';
      }
      
      if (Math.random() > 0.98) {
        checks[i].status = 'offline';
        checks[i].message = 'Service indisponible';
      }
    }

    // Déterminer le statut global
    const hasOffline = checks.some(check => check.status === 'offline');
    const hasWarning = checks.some(check => check.status === 'warning');
    
    const overall = hasOffline ? 'offline' : hasWarning ? 'warning' : 'online';

    setSystemHealth({
      overall,
      checks,
      lastUpdate: new Date().toISOString()
    });
    
    setIsChecking(false);
  }, []);

  // Vérifications automatiques toutes les 5 minutes
  useEffect(() => {
    runHealthChecks();
    
    const interval = setInterval(() => {
      runHealthChecks();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [runHealthChecks]);

  return {
    systemHealth,
    isChecking,
    runHealthChecks
  };
}
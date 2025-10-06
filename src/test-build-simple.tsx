// Test simple pour vérifier les imports
import React from 'react';
import { MapPin, RefreshCw, Github, Bell } from 'lucide-react';

// Test des composants UI de base
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';

// Test des composants principaux
import { AdminNotificationCenter } from './components/AdminNotificationCenter';
import { SystemStatus } from './components/SystemStatus';

export default function TestBuildSimple() {
  return (
    <div className="p-4">
      <h1>Test Build Simple</h1>
      
      {/* Test des icônes */}
      <div className="flex gap-2 mb-4">
        <MapPin className="w-4 h-4" />
        <RefreshCw className="w-4 h-4" />
        <Github className="w-4 h-4" />
        <Bell className="w-4 h-4" />
      </div>
      
      {/* Test des composants UI */}
      <div className="space-y-4">
        <Button>Test Button</Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Test content</p>
            <Badge>Test Badge</Badge>
          </CardContent>
        </Card>
        
        {/* Test des composants custom */}
        <AdminNotificationCenter />
        <SystemStatus compact />
      </div>
    </div>
  );
}
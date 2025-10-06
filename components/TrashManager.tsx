import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Trash2 } from 'lucide-react';

export function TrashManager() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Corbeille
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Gestion des éléments supprimés en cours de développement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
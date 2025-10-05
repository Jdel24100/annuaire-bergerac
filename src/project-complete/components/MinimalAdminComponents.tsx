// Composants admin supplémentaires pour extension future
import React from 'react';

// Ces composants peuvent être utilisés pour étendre l'application
// Ils sont inclus dans l'archive pour référence et développement futur

export function UserManager() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-muted-foreground mb-4">Interface de gestion des utilisateurs</p>
        <div className="space-y-3">
          <div className="p-4 border border-border rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium">admin@test.com</p>
              <p className="text-sm text-muted-foreground">Administrateur</p>
            </div>
            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">Actif</span>
          </div>
          <div className="p-4 border border-border rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium">user@example.com</p>
              <p className="text-sm text-muted-foreground">Utilisateur</p>
            </div>
            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">Actif</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContentManager() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestion du contenu</h2>
      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-muted-foreground mb-4">Validation des fiches professionnelles</p>
        
        <div className="space-y-4">
          <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Restaurant Le Bergerac</h3>
              <div className="flex gap-2">
                <button className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                  Approuver
                </button>
                <button className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                  Rejeter
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Restaurant traditionnel au centre-ville de Bergerac
            </p>
            <p className="text-xs text-orange-600 mt-2">En attente de validation</p>
          </div>
          
          <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Coiffure Moderne</h3>
              <span className="text-sm text-green-600">Approuvé</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Salon de coiffure moderne pour hommes et femmes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BusinessManager() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Business & Finance</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Abonnements</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Gratuit</span>
              <span className="text-sm bg-gray-100 px-2 py-1 rounded">145 utilisateurs</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Premium</span>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">23 utilisateurs</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Pro</span>
              <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">8 utilisateurs</span>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Abonnés actifs</span>
              <span className="font-bold text-green-600">1,856</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Taux d'ouverture</span>
              <span className="font-bold">24.3%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Dernière campagne</span>
              <span className="text-sm text-muted-foreground">Il y a 5 jours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ToolsManager() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Outils & Maintenance</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Base de données</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Tables</span>
              <span className="font-mono text-sm">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Taille</span>
              <span className="font-mono text-sm">245 MB</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Dernière sauvegarde</span>
              <span className="text-sm text-green-600">Il y a 1h</span>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Optimisation</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Images optimisées</span>
              <span className="text-sm text-green-600">1,234</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Économie espace</span>
              <span className="text-sm text-green-600">67%</span>
            </div>
            <button className="w-full bg-primary text-primary-foreground py-2 rounded hover:opacity-90">
              Optimiser maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
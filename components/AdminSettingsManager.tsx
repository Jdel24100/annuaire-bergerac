import React from 'react';
import { Settings, Plus, Edit, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { useAdminSettings } from '../hooks/useAdminSettings';
import { toast } from 'sonner';

export function AdminSettingsManager() {
  const { 
    settings, 
    loading, 
    error, 
    updateSetting, 
    createSetting, 
    deleteSetting 
  } = useAdminSettings();

  const [editingKey, setEditingKey] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState('');
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [newSetting, setNewSetting] = React.useState({
    key: '',
    value: '',
    description: '',
    type: 'string' as const,
    is_public: false
  });

  // Sauvegarder une modification
  const handleSave = async (key: string) => {
    const success = await updateSetting(key, editValue);
    if (success) {
      toast.success('Paramètre mis à jour');
      setEditingKey(null);
    } else {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  // Annuler une modification
  const handleCancel = () => {
    setEditingKey(null);
    setEditValue('');
  };

  // Commencer l'édition
  const startEdit = (key: string, currentValue: string) => {
    setEditingKey(key);
    setEditValue(currentValue);
  };

  // Créer un nouveau paramètre
  const handleCreate = async () => {
    if (!newSetting.key || !newSetting.value) {
      toast.error('Clé et valeur sont obligatoires');
      return;
    }

    const success = await createSetting(
      newSetting.key,
      newSetting.value,
      newSetting.description,
      newSetting.type,
      newSetting.is_public
    );

    if (success) {
      toast.success('Paramètre créé');
      setShowCreateDialog(false);
      setNewSetting({
        key: '',
        value: '',
        description: '',
        type: 'string',
        is_public: false
      });
    } else {
      toast.error('Erreur lors de la création');
    }
  };

  // Supprimer un paramètre
  const handleDelete = async (key: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le paramètre "${key}" ?`)) {
      return;
    }

    const success = await deleteSetting(key);
    if (success) {
      toast.success('Paramètre supprimé');
    } else {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Paramètres Admin</h2>
          <p className="text-muted-foreground">
            Gérer les paramètres de configuration de l'application
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau paramètre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau paramètre</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-key">Clé</Label>
                <Input
                  id="new-key"
                  value={newSetting.key}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, key: e.target.value }))}
                  placeholder="nom_du_parametre"
                />
              </div>
              
              <div>
                <Label htmlFor="new-type">Type</Label>
                <Select 
                  value={newSetting.type} 
                  onValueChange={(value: any) => setNewSetting(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="new-value">Valeur</Label>
                {newSetting.type === 'text' ? (
                  <Textarea
                    id="new-value"
                    value={newSetting.value}
                    onChange={(e) => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Valeur du paramètre"
                  />
                ) : (
                  <Input
                    id="new-value"
                    value={newSetting.value}
                    onChange={(e) => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Valeur du paramètre"
                  />
                )}
              </div>

              <div>
                <Label htmlFor="new-description">Description (optionnel)</Label>
                <Input
                  id="new-description"
                  value={newSetting.description}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description du paramètre"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="new-public"
                  checked={newSetting.is_public}
                  onCheckedChange={(checked) => setNewSetting(prev => ({ ...prev, is_public: checked }))}
                />
                <Label htmlFor="new-public">Paramètre public</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreate}>
                  Créer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Erreur */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Liste des paramètres */}
      <div className="grid gap-4">
        {settings.map((setting) => (
          <Card key={setting.key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{setting.key}</CardTitle>
                  {setting.description && (
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={setting.is_public ? "default" : "secondary"}>
                    {setting.is_public ? (
                      <><Eye className="w-3 h-3 mr-1" />Public</>
                    ) : (
                      <><EyeOff className="w-3 h-3 mr-1" />Privé</>
                    )}
                  </Badge>
                  <Badge variant="outline">{setting.type}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {editingKey === setting.key ? (
                  // Mode édition
                  <div className="space-y-3">
                    {setting.type === 'text' ? (
                      <Textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        type={setting.type === 'number' ? 'number' : 'text'}
                        className="w-full"
                      />
                    )}
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                      <Button size="sm" onClick={() => handleSave(setting.key)}>
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Mode affichage
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm bg-muted p-2 rounded break-all">
                          {setting.value || <span className="text-muted-foreground italic">Vide</span>}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(setting.key, setting.value)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(setting.key)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Modifié le {new Date(setting.updated_at).toLocaleString('fr-FR')}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {settings.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun paramètre configuré</h3>
            <p className="text-muted-foreground mb-4">
              Commencez par créer votre premier paramètre de configuration.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer un paramètre
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
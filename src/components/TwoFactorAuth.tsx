import React from 'react';
import { Shield, Key, Copy, RefreshCw, Check, X, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';

interface TwoFactorAuthProps {
  user: any;
  onUpdate: (updates: any) => void;
}

export function TwoFactorAuth({ user, onUpdate }: TwoFactorAuthProps) {
  const [isSetupMode, setIsSetupMode] = React.useState(false);
  const [qrCodeUrl, setQrCodeUrl] = React.useState('');
  const [secret, setSecret] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState('');
  const [backupCodes, setBackupCodes] = React.useState<string[]>([]);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [verificationStatus, setVerificationStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  // Générer un secret TOTP simulé
  const generateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Générer des codes de sauvegarde
  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      codes.push(code);
    }
    return codes;
  };

  const startSetup = () => {
    const newSecret = generateSecret();
    const newBackupCodes = generateBackupCodes();
    
    setSecret(newSecret);
    setBackupCodes(newBackupCodes);
    
    // URL QR Code simulée (dans un vrai projet, utiliseriez une lib comme qrcode)
    const appName = 'Annuaire Bergerac';
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/${encodeURIComponent(appName)}:${encodeURIComponent(user.email)}?secret=${newSecret}&issuer=${encodeURIComponent(appName)}`;
    setQrCodeUrl(qrUrl);
    setIsSetupMode(true);
  };

  const verifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setVerificationStatus('error');
      return;
    }

    setIsVerifying(true);
    
    // Simulation de la vérification (dans un vrai projet, vérifieriez avec TOTP)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simuler une vérification réussie si le code commence par "123"
    if (verificationCode.startsWith('123')) {
      setVerificationStatus('success');
      onUpdate({
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        backupCodes: backupCodes
      });
      setTimeout(() => {
        setIsSetupMode(false);
        setVerificationCode('');
        setVerificationStatus('idle');
      }, 1500);
    } else {
      setVerificationStatus('error');
    }
    
    setIsVerifying(false);
  };

  const disable2FA = () => {
    onUpdate({
      twoFactorEnabled: false,
      twoFactorSecret: undefined,
      backupCodes: undefined
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadBackupCodes = () => {
    const content = `Codes de sauvegarde pour ${user.email}\nGénérés le ${new Date().toLocaleDateString('fr-FR')}\n\n${backupCodes.join('\n')}\n\nIMPORTANT: Conservez ces codes dans un endroit sûr. Ils ne seront plus affichés.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-codes-${user.email}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isSetupMode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Configuration de l'authentification à deux facteurs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">1. Scannez le QR Code</h3>
              <div className="bg-white p-4 rounded-lg border text-center">
                <img src={qrCodeUrl} alt="QR Code 2FA" className="mx-auto" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Utilisez une app comme Google Authenticator, Authy ou Microsoft Authenticator
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">2. Ou saisissez le code manuellement</h3>
              <div className="bg-muted p-3 rounded border">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono">{secret}</code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(secret)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <h3 className="font-semibold mb-3 mt-6">3. Vérifiez avec un code</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="verification-code">Code de vérification (6 chiffres)</Label>
                  <Input
                    id="verification-code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                  />
                </div>
                
                {verificationStatus === 'error' && (
                  <Alert variant="destructive">
                    <X className="h-4 w-4" />
                    <AlertDescription>
                      Code incorrect. Réessayez ou utilisez "123456" pour tester.
                    </AlertDescription>
                  </Alert>
                )}
                
                {verificationStatus === 'success' && (
                  <Alert className="border-green-200 bg-green-50">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      2FA activé avec succès !
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex gap-2">
                  <Button
                    onClick={verifyAndEnable}
                    disabled={verificationCode.length !== 6 || isVerifying}
                    className="flex-1"
                  >
                    {isVerifying ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Shield className="w-4 h-4 mr-2" />
                    )}
                    Activer la 2FA
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsSetupMode(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {backupCodes.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Codes de sauvegarde</h3>
                  <Button variant="outline" size="sm" onClick={downloadBackupCodes}>
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertDescription>
                    Conservez ces codes dans un endroit sûr. Ils vous permettront de vous connecter si vous perdez votre téléphone.
                  </AlertDescription>
                </Alert>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="bg-muted p-2 rounded text-center font-mono text-sm">
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Authentification à deux facteurs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              État : {user.twoFactorEnabled ? (
                <Badge className="bg-green-100 text-green-800">Activée</Badge>
              ) : (
                <Badge variant="secondary">Désactivée</Badge>
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {user.twoFactorEnabled 
                ? 'Votre compte est protégé par l\'authentification à deux facteurs'
                : 'Renforcez la sécurité de votre compte en activant la 2FA'
              }
            </p>
          </div>
          
          {user.twoFactorEnabled ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  Désactiver
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Désactiver la 2FA</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p>Êtes-vous sûr de vouloir désactiver l'authentification à deux facteurs ?</p>
                  <p className="text-sm text-muted-foreground">
                    Cette action réduira la sécurité de votre compte.
                  </p>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline">Annuler</Button>
                    <Button variant="destructive" onClick={disable2FA}>
                      Désactiver la 2FA
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button onClick={startSetup}>
              <Shield className="w-4 h-4 mr-2" />
              Activer la 2FA
            </Button>
          )}
        </div>
        
        {user.twoFactorEnabled && user.backupCodes && (
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              Vous avez {user.backupCodes.length} codes de sauvegarde disponibles.
              Assurez-vous de les conserver dans un endroit sûr.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
import React from 'react';
import { SafeCaptchaWrapper, useSafeCaptchaWrapper } from './SafeCaptchaWrapper';
import { CaptchaStatus } from './CaptchaStatus';
import { useCaptcha } from './CaptchaContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export function CaptchaTest() {
  const [isVerified, setIsVerified] = React.useState(false);
  const [testType, setTestType] = React.useState<'wrapper' | 'hook'>('wrapper');
  const captchaContext = useCaptcha();
  const captchaHook = useSafeCaptchaWrapper();

  const handleVerify = (verified: boolean) => {
    setIsVerified(verified);
    console.log('Captcha verified:', verified);
  };

  const resetTest = () => {
    setIsVerified(false);
    if (testType === 'hook') {
      captchaHook.resetCaptcha();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔐 Test Système Captcha
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Status du contexte */}
          <div>
            <h4 className="font-medium mb-2">Status du contexte</h4>
            <CaptchaStatus />
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="text-center p-2 bg-muted rounded">
                <div className="text-xs text-muted-foreground">Activé</div>
                <Badge variant={captchaContext.isEnabled ? 'default' : 'secondary'}>
                  {captchaContext.isEnabled ? 'OUI' : 'NON'}
                </Badge>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <div className="text-xs text-muted-foreground">Chargement</div>
                <Badge variant={captchaContext.isLoading ? 'destructive' : 'default'}>
                  {captchaContext.isLoading ? 'OUI' : 'NON'}
                </Badge>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <div className="text-xs text-muted-foreground">Erreur</div>
                <Badge variant={captchaContext.error ? 'destructive' : 'default'}>
                  {captchaContext.error ? 'OUI' : 'NON'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Sélecteur de type de test */}
          <div>
            <h4 className="font-medium mb-2">Type de test</h4>
            <div className="flex gap-2">
              <Button
                variant={testType === 'wrapper' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTestType('wrapper')}
              >
                Wrapper Component
              </Button>
              <Button
                variant={testType === 'hook' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTestType('hook')}
              >
                Hook Component
              </Button>
            </div>
          </div>

          {/* Status de vérification */}
          <div className="flex items-center justify-between p-3 border rounded">
            <span className="font-medium">Status de vérification:</span>
            <div className="flex items-center gap-2">
              {isVerified ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <Badge variant="default" className="bg-green-600">Vérifié</Badge>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-600" />
                  <Badge variant="destructive">Non vérifié</Badge>
                </>
              )}
            </div>
          </div>

          {/* Test avec wrapper */}
          {testType === 'wrapper' && (
            <div>
              <h4 className="font-medium mb-2">Test SafeCaptchaWrapper</h4>
              <SafeCaptchaWrapper 
                onVerify={handleVerify}
                className="mb-4"
              />
            </div>
          )}

          {/* Test avec hook */}
          {testType === 'hook' && (
            <div>
              <h4 className="font-medium mb-2">Test useSafeCaptchaWrapper Hook</h4>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Hook verified: {captchaHook.isCaptchaVerified ? '✅' : '❌'}
                </div>
                <captchaHook.CaptchaComponent className="mb-4" />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={resetTest} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-1" />
              Reset Test
            </Button>
            <Button
              onClick={() => handleVerify(!isVerified)}
              variant="outline"
              size="sm"
            >
              Toggle Verification
            </Button>
          </div>

          {/* Debug info */}
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            <strong>Debug:</strong>
            <br />Context: enabled={String(captchaContext.isEnabled)}, loading={String(captchaContext.isLoading)}, error={captchaContext.error || 'null'}
            <br />Hook: verified={String(captchaHook.isCaptchaVerified)}
            <br />Test: verified={String(isVerified)}, type={testType}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
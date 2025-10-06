import React from 'react';
import { RefreshCw, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';

interface CaptchaProps {
  onVerify: (isValid: boolean) => void;
  className?: string;
}

type CaptchaType = 'math' | 'text' | 'pattern';

interface MathCaptcha {
  question: string;
  answer: number;
}

interface TextCaptcha {
  question: string;
  answer: string;
}

interface PatternCaptcha {
  pattern: string[];
  question: string;
  answer: string;
}

export function Captcha({ onVerify, className = '' }: CaptchaProps) {
  const [captchaType, setCaptchaType] = React.useState<CaptchaType>('math');
  const [mathCaptcha, setMathCaptcha] = React.useState<MathCaptcha | null>(null);
  const [textCaptcha, setTextCaptcha] = React.useState<TextCaptcha | null>(null);
  const [patternCaptcha, setPatternCaptcha] = React.useState<PatternCaptcha | null>(null);
  const [userAnswer, setUserAnswer] = React.useState('');
  const [isVerified, setIsVerified] = React.useState(false);
  const [attempts, setAttempts] = React.useState(0);
  const [showError, setShowError] = React.useState(false);

  const mathQuestions = [
    () => {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      return { question: `${a} + ${b} = ?`, answer: a + b };
    },
    () => {
      const a = Math.floor(Math.random() * 10) + 10;
      const b = Math.floor(Math.random() * 10) + 1;
      return { question: `${a} - ${b} = ?`, answer: a - b };
    },
    () => {
      const a = Math.floor(Math.random() * 5) + 2;
      const b = Math.floor(Math.random() * 5) + 2;
      return { question: `${a} × ${b} = ?`, answer: a * b };
    }
  ];

  const textQuestions: TextCaptcha[] = [
    { question: "Quelle est la couleur du ciel par beau temps ?", answer: "bleu" },
    { question: "Combien de pattes a un chat ?", answer: "4" },
    { question: "Dans quelle région se trouve Bergerac ?", answer: "dordogne" },
    { question: "Quel est l'opposé de 'grand' ?", answer: "petit" },
    { question: "Combien font 2 + 2 ?", answer: "4" },
    { question: "Quelle est la première lettre de l'alphabet ?", answer: "a" },
    { question: "En quelle saison tombent les feuilles ?", answer: "automne" }
  ];

  const patternQuestions: (() => PatternCaptcha)[] = [
    () => {
      const patterns = ['🌟', '🔹', '🌸', '🍎', '🌙'];
      const selected = patterns.slice(0, 3);
      return {
        pattern: selected,
        question: `Cliquez sur le symbole : ${selected[1]}`,
        answer: selected[1]
      };
    },
    () => {
      const colors = ['Rouge', 'Bleu', 'Vert', 'Jaune', 'Violet'];
      const selected = colors.slice(0, 4);
      return {
        pattern: selected,
        question: `Quelle couleur commence par 'V' ?`,
        answer: selected.find(c => c.startsWith('V')) || 'Violet'
      };
    }
  ];

  const generateCaptcha = () => {
    setUserAnswer('');
    setIsVerified(false);
    setShowError(false);
    
    // Alterner entre les types de captcha ou choisir selon les tentatives
    let type: CaptchaType = 'math';
    if (attempts > 2) {
      type = 'text';
    } else if (attempts > 4) {
      type = 'pattern';
    }
    
    setCaptchaType(type);

    switch (type) {
      case 'math':
        const mathGen = mathQuestions[Math.floor(Math.random() * mathQuestions.length)];
        setMathCaptcha(mathGen());
        setTextCaptcha(null);
        setPatternCaptcha(null);
        break;
      
      case 'text':
        const textQ = textQuestions[Math.floor(Math.random() * textQuestions.length)];
        setTextCaptcha(textQ);
        setMathCaptcha(null);
        setPatternCaptcha(null);
        break;
      
      case 'pattern':
        const patternGen = patternQuestions[Math.floor(Math.random() * patternQuestions.length)];
        setPatternCaptcha(patternGen());
        setMathCaptcha(null);
        setTextCaptcha(null);
        break;
    }
  };

  React.useEffect(() => {
    generateCaptcha();
  }, []);

  React.useEffect(() => {
    onVerify(isVerified);
  }, [isVerified, onVerify]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let isCorrect = false;
    const normalizedAnswer = userAnswer.toLowerCase().trim();

    switch (captchaType) {
      case 'math':
        if (mathCaptcha) {
          isCorrect = parseInt(normalizedAnswer) === mathCaptcha.answer;
        }
        break;
      
      case 'text':
        if (textCaptcha) {
          isCorrect = normalizedAnswer === textCaptcha.answer.toLowerCase();
        }
        break;
      
      case 'pattern':
        if (patternCaptcha) {
          isCorrect = normalizedAnswer === patternCaptcha.answer.toLowerCase();
        }
        break;
    }

    if (isCorrect) {
      setIsVerified(true);
      setShowError(false);
    } else {
      setShowError(true);
      setAttempts(prev => prev + 1);
      setTimeout(() => {
        generateCaptcha();
      }, 2000);
    }
  };

  const handlePatternClick = (item: string) => {
    setUserAnswer(item);
  };

  const handleRefresh = () => {
    generateCaptcha();
  };

  if (isVerified) {
    return (
      <div className={`flex items-center gap-2 text-green-600 ${className}`}>
        <Shield className="w-4 h-4" />
        <span className="text-sm font-medium">Captcha vérifié ✓</span>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Vérification anti-spam
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {/* Math Captcha */}
          {captchaType === 'math' && mathCaptcha && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="bg-muted p-3 rounded text-center">
                <p className="font-mono text-lg">{mathCaptcha.question}</p>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Votre réponse"
                  className="flex-1"
                  required
                />
                <Button type="submit" size="sm">
                  Vérifier
                </Button>
              </div>
            </form>
          )}

          {/* Text Captcha */}
          {captchaType === 'text' && textCaptcha && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="bg-muted p-3 rounded">
                <p className="text-sm">{textCaptcha.question}</p>
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Votre réponse"
                  className="flex-1"
                  required
                />
                <Button type="submit" size="sm">
                  Vérifier
                </Button>
              </div>
            </form>
          )}

          {/* Pattern Captcha */}
          {captchaType === 'pattern' && patternCaptcha && (
            <div className="space-y-3">
              <div className="bg-muted p-3 rounded">
                <p className="text-sm mb-3">{patternCaptcha.question}</p>
                <div className="grid grid-cols-4 gap-2">
                  {patternCaptcha.pattern.map((item, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant={userAnswer === item ? "default" : "outline"}
                      className="h-12 text-lg"
                      onClick={() => handlePatternClick(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
              {userAnswer && (
                <Button onClick={handleSubmit} className="w-full">
                  Vérifier la sélection
                </Button>
              )}
            </div>
          )}

          {showError && (
            <div className="text-red-600 text-sm">
              ❌ Réponse incorrecte. Veuillez réessayer.
              {attempts > 3 && (
                <div className="mt-1 text-xs text-muted-foreground">
                  Conseil : Les réponses ne sont pas sensibles à la casse
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Cette vérification protège contre les soumissions automatisées.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook pour utiliser le captcha dans les formulaires
export function useCaptcha() {
  const [isCaptchaVerified, setIsCaptchaVerified] = React.useState(false);
  const [captchaKey, setCaptchaKey] = React.useState(0);

  const resetCaptcha = () => {
    setIsCaptchaVerified(false);
    setCaptchaKey(prev => prev + 1);
  };

  const CaptchaComponent = React.useCallback(
    ({ className }: { className?: string }) => (
      <Captcha
        key={captchaKey}
        onVerify={setIsCaptchaVerified}
        className={className}
      />
    ),
    [captchaKey]
  );

  return {
    isCaptchaVerified,
    resetCaptcha,
    CaptchaComponent
  };
}
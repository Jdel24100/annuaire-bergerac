import React from 'react';
import { CreditCard, Check, X, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SubscriptionPlan } from '../types';

interface PaymentModalProps {
  plan: SubscriptionPlan;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({ plan, isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    businessName: '',
    businessAddress: '',
    businessPhone: ''
  });

  const getPriceDisplay = () => {
    switch (plan.type) {
      case 'weekly':
        return { price: plan.price, period: '/semaine', savings: null };
      case 'monthly':
        return { price: plan.price, period: '/mois', savings: null };
      case 'yearly':
        return { 
          price: plan.price, 
          period: '/an', 
          savings: `Économie de ${(plan.price * 0.2).toFixed(2)}€ sur l'année` 
        };
      default:
        return { price: plan.price, period: '/mois', savings: null };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulation du processus de paiement
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  if (!isOpen) return null;

  const priceDisplay = getPriceDisplay();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Finaliser votre abonnement</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Résumé de commande */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Résumé de votre commande</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Plan {plan.type === 'weekly' ? 'hebdomadaire' : plan.type === 'monthly' ? 'mensuel' : 'annuel'}
                        </p>
                      </div>
                      <Badge variant={plan.isFeatured ? 'default' : 'secondary'}>
                        {plan.isFeatured ? 'Populaire' : 'Standard'}
                      </Badge>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span>Prix</span>
                        <span className="font-semibold">{priceDisplay.price}€{priceDisplay.period}</span>
                      </div>
                      {priceDisplay.savings && (
                        <div className="text-sm text-green-600 mt-1">
                          {priceDisplay.savings}
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Inclus dans votre plan :</h4>
                      <ul className="space-y-1">
                        {plan.features.slice(0, 5).map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <Check className="w-3 h-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulaire de paiement */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-4">Informations de facturation</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Informations de l'entreprise</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="businessName">Nom de l'entreprise</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessAddress">Adresse</Label>
                      <Input
                        id="businessAddress"
                        value={formData.businessAddress}
                        onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                        required
                        placeholder="Adresse complète (vérifiée dans un rayon de 60km autour de Bergerac)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessPhone">Téléphone</Label>
                      <Input
                        id="businessPhone"
                        type="tel"
                        value={formData.businessPhone}
                        onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Informations de paiement
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Numéro de carte</Label>
                      <Input
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="expiryMonth">Mois</Label>
                        <Select value={formData.expiryMonth} onValueChange={(value) => handleInputChange('expiryMonth', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                {String(i + 1).padStart(2, '0')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="expiryYear">Année</Label>
                        <Select value={formData.expiryYear} onValueChange={(value) => handleInputChange('expiryYear', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="AA" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => (
                              <SelectItem key={i} value={String(new Date().getFullYear() + i).slice(-2)}>
                                {String(new Date().getFullYear() + i).slice(-2)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                          placeholder="123"
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Validation géographique</h4>
                  <p className="text-sm text-blue-700">
                    Votre adresse d'entreprise sera vérifiée pour s'assurer qu'elle se trouve bien 
                    dans un rayon de 60 kilomètres autour de Bergerac, conformément à notre politique 
                    d'annuaire local.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isProcessing} 
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      `Payer ${priceDisplay.price}€`
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
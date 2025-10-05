import React from 'react';
import { 
  FileText, Download, Eye, Calendar, DollarSign, Filter,
  Search, Plus, CheckCircle, XCircle, Clock, AlertCircle,
  User, CreditCard, Building, Mail, MapPin, Hash
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';
import { useAuth } from './AuthContextSimple';
import { GeneratedInvoice } from '../types';

interface InvoiceManagerProps {
  viewMode: 'user' | 'admin';
  onNavigate?: (page: any) => void;
}

// Mock data pour les factures
const mockInvoices: GeneratedInvoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    subscriptionId: 'sub_1',
    userId: '1',
    userEmail: 'jean.dupont@email.com',
    userName: 'Jean Dupont',
    userAddress: '15 Rue de la République, 24100 Bergerac',
    planName: 'Pro Mensuel',
    planType: 'monthly',
    amount: 29.99,
    vatAmount: 6.00,
    totalAmount: 35.99,
    currency: 'EUR',
    invoiceDate: '2024-01-01T00:00:00Z',
    dueDate: '2024-01-15T00:00:00Z',
    paidDate: '2024-01-02T10:30:00Z',
    status: 'paid',
    pdfUrl: '/invoices/INV-2024-001.pdf',
    stripeInvoiceId: 'in_1OhBxkLfqJT2Y8N4hPzWF5Jy',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T10:30:00Z'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    subscriptionId: 'sub_1',
    userId: '1',
    userEmail: 'jean.dupont@email.com',
    userName: 'Jean Dupont',
    userAddress: '15 Rue de la République, 24100 Bergerac',
    planName: 'Pro Mensuel',
    planType: 'monthly',
    amount: 29.99,
    vatAmount: 6.00,
    totalAmount: 35.99,
    currency: 'EUR',
    invoiceDate: '2024-02-01T00:00:00Z',
    dueDate: '2024-02-15T00:00:00Z',
    paidDate: '2024-02-01T14:15:00Z',
    status: 'paid',
    pdfUrl: '/invoices/INV-2024-002.pdf',
    stripeInvoiceId: 'in_1OhBxkLfqJT2Y8N4hPzWF5Jz',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T14:15:00Z'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    subscriptionId: 'sub_2',
    userId: '2',
    userEmail: 'marie.martin@entreprise.com',
    userName: 'Marie Martin',
    userAddress: '42 Avenue Victor Hugo, 24100 Bergerac',
    planName: 'Premium Annuel',
    planType: 'yearly',
    amount: 799.99,
    vatAmount: 160.00,
    totalAmount: 959.99,
    currency: 'EUR',
    invoiceDate: '2024-01-15T00:00:00Z',
    dueDate: '2024-01-30T00:00:00Z',
    paidDate: '2024-01-16T09:45:00Z',
    status: 'paid',
    pdfUrl: '/invoices/INV-2024-003.pdf',
    stripeInvoiceId: 'in_1OhBxkLfqJT2Y8N4hPzWF5Ka',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-16T09:45:00Z'
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    subscriptionId: 'sub_1',
    userId: '1',
    userEmail: 'jean.dupont@email.com',
    userName: 'Jean Dupont',
    userAddress: '15 Rue de la République, 24100 Bergerac',
    planName: 'Pro Mensuel',
    planType: 'monthly',
    amount: 29.99,
    vatAmount: 6.00,
    totalAmount: 35.99,
    currency: 'EUR',
    invoiceDate: '2024-03-01T00:00:00Z',
    dueDate: '2024-03-15T00:00:00Z',
    status: 'sent',
    pdfUrl: '/invoices/INV-2024-004.pdf',
    stripeInvoiceId: 'in_1OhBxkLfqJT2Y8N4hPzWF5Kb',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  }
];

export function InvoiceManager({ viewMode, onNavigate }: InvoiceManagerProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selectedInvoice, setSelectedInvoice] = React.useState<GeneratedInvoice | null>(null);
  const [showInvoiceDialog, setShowInvoiceDialog] = React.useState(false);

  // Filtrer les factures selon le mode de vue
  const filteredInvoices = mockInvoices.filter(invoice => {
    if (viewMode === 'user' && invoice.userId !== user?.id) return false;
    
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Payée</Badge>;
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Envoyée</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />En retard</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800"><XCircle className="w-3 h-3 mr-1" />Annulée</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800"><FileText className="w-3 h-3 mr-1" />Brouillon</Badge>;
    }
  };

  const handleDownloadInvoice = (invoice: GeneratedInvoice) => {
    // Simulation du téléchargement PDF
    console.log(`Téléchargement de la facture ${invoice.invoiceNumber}`);
    
    // Générer un PDF simple (simulation)
    generateInvoicePDF(invoice);
  };

  const generateInvoicePDF = (invoice: GeneratedInvoice) => {
    // Simulation de la génération PDF
    // En production, vous utiliseriez une bibliothèque comme jsPDF ou PDFKit
    
    const invoiceContent = `
FACTURE ${invoice.invoiceNumber}

ANNUAIRE BERGERAC
Bergerac, Dordogne (24)
contact@annuaire-bergerac.fr
SIRET: 123 456 789 00010

FACTURÉ À:
${invoice.userName}
${invoice.userAddress}
${invoice.userEmail}

Date de facture: ${new Date(invoice.invoiceDate).toLocaleDateString('fr-FR')}
Date d'échéance: ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
${invoice.paidDate ? `Date de paiement: ${new Date(invoice.paidDate).toLocaleDateString('fr-FR')}` : ''}

DÉTAIL:
${invoice.planName} (${invoice.planType === 'monthly' ? 'Mensuel' : 'Annuel'})
Montant HT: ${invoice.amount.toFixed(2)}€
TVA (20%): ${invoice.vatAmount.toFixed(2)}€
TOTAL TTC: ${invoice.totalAmount.toFixed(2)}€

Statut: ${invoice.status === 'paid' ? 'PAYÉE' : 'EN ATTENTE'}
${invoice.stripeInvoiceId ? `ID Stripe: ${invoice.stripeInvoiceId}` : ''}
    `.trim();

    // Créer un blob et le télécharger
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.invoiceNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert(`Facture ${invoice.invoiceNumber} téléchargée ! (Simulation - format TXT)`);
  };

  const calculateTotalStats = () => {
    const userInvoices = viewMode === 'user' 
      ? filteredInvoices 
      : mockInvoices;
      
    return {
      total: userInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      paid: userInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0),
      pending: userInvoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.totalAmount, 0),
      count: userInvoices.length
    };
  };

  const stats = calculateTotalStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {viewMode === 'user' ? 'Mes factures' : 'Toutes les factures'}
          </h2>
          <p className="text-muted-foreground">
            {viewMode === 'user' 
              ? 'Consultez et téléchargez vos factures d\'abonnement'
              : 'Gérez toutes les factures générées par le système'
            }
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total des factures</p>
                <p className="text-2xl font-bold">{stats.count}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Montant total</p>
                <p className="text-2xl font-bold">{stats.total.toFixed(2)}€</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Montant payé</p>
                <p className="text-2xl font-bold text-green-600">{stats.paid.toFixed(2)}€</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending.toFixed(2)}€</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des factures</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une facture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="paid">Payées</SelectItem>
                  <SelectItem value="sent">Envoyées</SelectItem>
                  <SelectItem value="overdue">En retard</SelectItem>
                  <SelectItem value="cancelled">Annulées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune facture trouvée</h3>
              <p className="text-muted-foreground">
                {viewMode === 'user' 
                  ? 'Vous n\'avez pas encore de factures.'
                  : 'Aucune facture ne correspond à vos critères de recherche.'
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Facture</TableHead>
                  {viewMode === 'admin' && <TableHead>Client</TableHead>}
                  <TableHead>Plan</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono">
                      {invoice.invoiceNumber}
                    </TableCell>
                    {viewMode === 'admin' && (
                      <TableCell>
                        <div>
                          <div className="font-medium">{invoice.userName}</div>
                          <div className="text-sm text-muted-foreground">{invoice.userEmail}</div>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge variant="outline">{invoice.planName}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.invoiceDate).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="font-mono">
                      {invoice.totalAmount.toFixed(2)}€
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invoice.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedInvoice(invoice)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Aperçu facture {invoice.invoiceNumber}</DialogTitle>
                            </DialogHeader>
                            {selectedInvoice && (
                              <InvoicePreview 
                                invoice={selectedInvoice} 
                                onDownload={() => handleDownloadInvoice(selectedInvoice)}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Composant d'aperçu de facture
function InvoicePreview({ invoice, onDownload }: { invoice: GeneratedInvoice; onDownload: () => void }) {
  return (
    <div className="space-y-6">
      {/* En-tête de facture */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold">ANNUAIRE BERGERAC</h3>
          <p className="text-sm text-muted-foreground">
            Bergerac, Dordogne (24)<br />
            contact@annuaire-bergerac.fr<br />
            SIRET: 123 456 789 00010
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold">FACTURE</h2>
          <p className="text-lg font-mono">{invoice.invoiceNumber}</p>
          <div className="mt-2">
            {getStatusBadge(invoice.status)}
          </div>
        </div>
      </div>

      <Separator />

      {/* Informations client et dates */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2">FACTURÉ À :</h4>
          <div className="text-sm">
            <p className="font-medium">{invoice.userName}</p>
            <p>{invoice.userAddress}</p>
            <p>{invoice.userEmail}</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">DÉTAILS :</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Date de facture :</span>
              <span>{new Date(invoice.invoiceDate).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex justify-between">
              <span>Date d'échéance :</span>
              <span>{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</span>
            </div>
            {invoice.paidDate && (
              <div className="flex justify-between">
                <span>Date de paiement :</span>
                <span className="text-green-600">{new Date(invoice.paidDate).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Détail de la facture */}
      <div>
        <h4 className="font-semibold mb-4">DÉTAIL DE LA FACTURE :</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Période</TableHead>
              <TableHead className="text-right">Montant HT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{invoice.planName}</TableCell>
              <TableCell>
                {invoice.planType === 'monthly' ? 'Mensuel' : 'Annuel'}
              </TableCell>
              <TableCell className="text-right font-mono">
                {invoice.amount.toFixed(2)}€
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Totaux */}
      <div className="bg-muted p-4 rounded-lg">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Sous-total HT :</span>
            <span className="font-mono">{invoice.amount.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between">
            <span>TVA (20%) :</span>
            <span className="font-mono">{invoice.vatAmount.toFixed(2)}€</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>TOTAL TTC :</span>
            <span className="font-mono">{invoice.totalAmount.toFixed(2)}€</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onDownload}>
          <Download className="w-4 h-4 mr-2" />
          Télécharger PDF
        </Button>
      </div>
    </div>
  );
}

// Fonction utilitaire pour les badges de statut
function getStatusBadge(status: string) {
  switch (status) {
    case 'paid':
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Payée</Badge>;
    case 'sent':
      return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Envoyée</Badge>;
    case 'overdue':
      return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />En retard</Badge>;
    case 'cancelled':
      return <Badge className="bg-gray-100 text-gray-800"><XCircle className="w-3 h-3 mr-1" />Annulée</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800"><FileText className="w-3 h-3 mr-1" />Brouillon</Badge>;
  }
}
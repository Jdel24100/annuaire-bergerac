import React from 'react';
import { ArrowLeft, Mail, MapPin, Phone, Shield, FileText, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Page } from '../types';

interface LegalPagesProps {
  onNavigate: (page: Page, params?: any) => void;
  pageType: 'legal' | 'privacy' | 'terms';
}

export function LegalPages({ onNavigate, pageType }: LegalPagesProps) {
  const getPageContent = () => {
    switch (pageType) {
      case 'legal':
        return {
          title: 'Mentions Légales',
          content: (
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Éditeur du site</h2>
                <div className="bg-muted p-6 rounded-lg space-y-2">
                  <p><strong>Nom :</strong> Annuaire Bergerac</p>
                  <p><strong>Adresse :</strong> Bergerac, Dordogne (24100)</p>
                  <p><strong>Email :</strong> contact@annuaire-bergerac.fr</p>
                  <p><strong>Téléphone :</strong> 05 53 XX XX XX</p>
                  <p><strong>SIRET :</strong> [À compléter]</p>
                  <p><strong>Directeur de publication :</strong> [À compléter]</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Hébergement</h2>
                <div className="bg-muted p-6 rounded-lg space-y-2">
                  <p><strong>Hébergeur :</strong> [À compléter selon votre hébergeur]</p>
                  <p><strong>Adresse :</strong> [Adresse de l'hébergeur]</p>
                  <p><strong>Téléphone :</strong> [Téléphone de l'hébergeur]</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Propriété intellectuelle</h2>
                <p className="text-muted-foreground leading-7">
                  Le site www.annuaire-bergerac.fr est la propriété exclusive d'Annuaire Bergerac. 
                  Toute reproduction, représentation, modification, publication, adaptation de tout ou partie 
                  des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, 
                  sauf autorisation écrite préalable.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Responsabilité</h2>
                <p className="text-muted-foreground leading-7">
                  Annuaire Bergerac met tout en œuvre pour offrir aux utilisateurs des informations 
                  et/ou des outils disponibles et vérifiés, mais ne saurait être tenu pour responsable 
                  des erreurs, d'une absence de disponibilité des informations et/ou de la présence 
                  de virus sur son site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Protection des données</h2>
                <p className="text-muted-foreground leading-7">
                  Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et 
                  au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un 
                  droit d'accès, de rectification, de suppression et d'opposition aux données 
                  personnelles vous concernant. Pour exercer ce droit, contactez-nous à : 
                  contact@annuaire-bergerac.fr
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
                <p className="text-muted-foreground leading-7">
                  Le site utilise des cookies pour améliorer l'expérience utilisateur, réaliser 
                  des statistiques de visite et proposer des contenus adaptés. En poursuivant 
                  votre navigation, vous acceptez l'utilisation de ces cookies.
                </p>
              </section>
            </div>
          )
        };

      case 'privacy':
        return {
          title: 'Politique de Confidentialité',
          content: (
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Collecte des données</h2>
                <p className="text-muted-foreground leading-7 mb-4">
                  Nous collectons les données suivantes :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Données d'inscription : nom, prénom, email, téléphone</li>
                  <li>Données de navigation : pages visitées, durée, adresse IP</li>
                  <li>Données de fiches professionnelles : informations entreprise</li>
                  <li>Données de facturation : pour les abonnements payants</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Utilisation des données</h2>
                <p className="text-muted-foreground leading-7 mb-4">
                  Vos données sont utilisées pour :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Gérer votre compte et vos fiches professionnelles</li>
                  <li>Traiter vos commandes et abonnements</li>
                  <li>Vous envoyer nos newsletters (avec votre consentement)</li>
                  <li>Améliorer nos services</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Conservation des données</h2>
                <p className="text-muted-foreground leading-7">
                  Nous conservons vos données personnelles pendant la durée nécessaire aux 
                  finalités pour lesquelles elles ont été collectées, et au maximum 3 ans 
                  après la fin de notre relation commerciale.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Vos droits</h2>
                <p className="text-muted-foreground leading-7 mb-4">
                  Vous disposez des droits suivants :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Droit d'accès à vos données</li>
                  <li>Droit de rectification</li>
                  <li>Droit à l'effacement</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit à la portabilité des données</li>
                  <li>Droit d'opposition</li>
                </ul>
                <p className="text-muted-foreground leading-7 mt-4">
                  Pour exercer ces droits, contactez-nous à : contact@annuaire-bergerac.fr
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Sécurité</h2>
                <p className="text-muted-foreground leading-7">
                  Nous mettons en place des mesures techniques et organisationnelles appropriées 
                  pour protéger vos données contre la perte, l'usage abusif, l'altération ou 
                  la divulgation non autorisée.
                </p>
              </section>
            </div>
          )
        };

      case 'terms':
        return {
          title: 'Conditions Générales d\'Utilisation',
          content: (
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Objet</h2>
                <p className="text-muted-foreground leading-7">
                  Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation 
                  du site www.annuaire-bergerac.fr et de ses services. L'utilisation du site 
                  implique l'acceptation pleine et entière des présentes CGU.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Services proposés</h2>
                <p className="text-muted-foreground leading-7 mb-4">
                  Annuaire Bergerac propose :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Un annuaire des professionnels de Bergerac et ses environs</li>
                  <li>Un système de recherche et de filtrage</li>
                  <li>La possibilité de créer des fiches professionnelles</li>
                  <li>Des abonnements payants pour des services premium</li>
                  <li>Un blog d'information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Inscription et compte utilisateur</h2>
                <p className="text-muted-foreground leading-7">
                  L'inscription est gratuite et ouverte à toute personne physique ou morale 
                  exerçant une activité professionnelle dans un rayon de 60 km autour de Bergerac. 
                  L'utilisateur s'engage à fournir des informations exactes et à jour.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Obligations de l'utilisateur</h2>
                <p className="text-muted-foreground leading-7 mb-4">
                  L'utilisateur s'engage à :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Respecter les lois en vigueur</li>
                  <li>Fournir des informations exactes</li>
                  <li>Ne pas porter atteinte aux droits de tiers</li>
                  <li>Ne pas diffuser de contenu illicite ou offensant</li>
                  <li>Respecter la propriété intellectuelle</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Abonnements et paiements</h2>
                <p className="text-muted-foreground leading-7">
                  Les abonnements payants sont décrits sur la page tarifs. Les paiements 
                  s'effectuent par carte bancaire via Stripe. Les abonnements sont renouvelés 
                  automatiquement sauf résiliation. Un délai de rétractation de 14 jours 
                  s'applique conformément à la législation.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Résiliation</h2>
                <p className="text-muted-foreground leading-7">
                  L'utilisateur peut résilier son compte à tout moment depuis son tableau de bord. 
                  Annuaire Bergerac se réserve le droit de suspendre ou supprimer un compte 
                  en cas de non-respect des présentes CGU.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Limitation de responsabilité</h2>
                <p className="text-muted-foreground leading-7">
                  Annuaire Bergerac ne saurait être tenu responsable des dommages directs ou 
                  indirects résultant de l'utilisation du site ou de l'impossibilité de l'utiliser.
                </p>
              </section>
            </div>
          )
        };

      default:
        return { title: '', content: null };
    }
  };

  const { title, content } = getPageContent();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => onNavigate('home')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à l'accueil
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground text-lg">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          {content}
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              Besoin d'aide ?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Pour toute question concernant ces conditions, contactez-nous :
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={() => onNavigate('contact')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Nous contacter
              </Button>
              <a 
                href="mailto:contact@annuaire-bergerac.fr"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                <Mail className="w-4 h-4 mr-2" />
                contact@annuaire-bergerac.fr
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
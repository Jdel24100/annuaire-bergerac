import React from 'react';
import { Logo } from './Logo';
import { BrandLogo, BrandVariants } from './BrandLogo';
import { SocialLogo, SocialFormats } from './SocialLogo';
import { Favicon, FaviconSizes } from './Favicon';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// Guide d'utilisation du logo - ADMIN SEULEMENT
export function LogoGuide() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Guide d'utilisation du logo Annuaire Bergerac</h1>
        <p className="text-muted-foreground text-lg">
          Toutes les variantes et formats disponibles pour votre identité visuelle
        </p>
      </div>

      {/* Logo principal - Variantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎨 Logo principal - Variantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg">
              <Logo variant="full" size="md" className="mb-4" />
              <h3 className="font-semibold mb-2">Logo complet</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">variant="full"</code>
            </div>
            
            <div className="text-center p-6 border rounded-lg">
              <Logo variant="icon" size="md" className="mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">Icône seule</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">variant="icon"</code>
            </div>
            
            <div className="text-center p-6 border rounded-lg">
              <Logo variant="text" className="mb-4" />
              <h3 className="font-semibold mb-2">Texte seul</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">variant="text"</code>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 border rounded">
              <Logo variant="full" size="sm" className="mb-2" />
              <p className="text-sm">Petite (sm)</p>
            </div>
            <div className="p-4 border rounded">
              <Logo variant="full" size="md" className="mb-2" />
              <p className="text-sm">Moyenne (md)</p>
            </div>
            <div className="p-4 border rounded">
              <Logo variant="full" size="lg" className="mb-2" />
              <p className="text-sm">Grande (lg)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Favicons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📱 Favicons et icônes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6 text-center">
            <div className="p-4 border rounded">
              <FaviconSizes.small />
              <p className="text-sm mt-2">16x16px</p>
            </div>
            <div className="p-4 border rounded">
              <FaviconSizes.medium />
              <p className="text-sm mt-2">32x32px</p>
            </div>
            <div className="p-4 border rounded">
              <FaviconSizes.large />
              <p className="text-sm mt-2">64x64px</p>
            </div>
            <div className="p-4 border rounded">
              <FaviconSizes.apple />
              <p className="text-sm mt-2">180x180px</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logos de marque */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏢 Logos de marque - Contextes spéciaux
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 border rounded-lg">
              <BrandVariants.header />
              <h3 className="font-semibold mt-4 mb-2">Header</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">BrandVariants.header()</code>
            </div>
            
            <div className="text-center p-6 border rounded-lg">
              <BrandVariants.footer />
              <h3 className="font-semibold mt-4 mb-2">Footer</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">BrandVariants.footer()</code>
            </div>
          </div>

          <div className="text-center p-6 border rounded-lg">
            <BrandVariants.hero />
            <h3 className="font-semibold mt-4 mb-2">Hero Section</h3>
            <code className="text-sm bg-muted px-2 py-1 rounded">BrandVariants.hero()</code>
          </div>
        </CardContent>
      </Card>

      {/* Réseaux sociaux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📱 Formats réseaux sociaux
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="overflow-hidden rounded border mb-4" style={{ maxWidth: '300px', margin: '0 auto' }}>
                <SocialLogo platform="facebook" size={300} />
              </div>
              <h3 className="font-semibold mb-2">Facebook Cover (1200x630px)</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">SocialFormats.facebookCover()</code>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="overflow-hidden rounded border mb-4" style={{ maxWidth: '300px', margin: '0 auto' }}>
                <SocialLogo platform="instagram" size={200} />
              </div>
              <h3 className="font-semibold mb-2">Instagram Post (1080x1080px)</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">SocialFormats.instagramPost()</code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions d'usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 Instructions d'utilisation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Import dans vos composants :</h3>
            <code className="block bg-white dark:bg-gray-900 p-2 rounded text-sm">
              import &#123; Logo &#125; from './components/Logo';<br/>
              import &#123; BrandLogo &#125; from './components/BrandLogo';<br/>
              import &#123; SocialLogo &#125; from './components/SocialLogo';
            </code>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Bonnes pratiques :</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Utilisez <code>variant="full"</code> dans les headers et footers</li>
              <li>Utilisez <code>variant="icon"</code> pour les boutons et espaces réduits</li>
              <li>Respectez les tailles : sm, md, lg selon le contexte</li>
              <li>Le logo s'adapte automatiquement au mode sombre</li>
            </ul>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">À éviter :</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Ne pas déformer les proportions du logo</li>
              <li>Ne pas utiliser de filtres CSS agressifs</li>
              <li>Ne pas placer sur des arrière-plans peu contrastés</li>
              <li>Ne pas utiliser des tailles trop petites pour la version complète</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
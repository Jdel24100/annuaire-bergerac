# Annuaire Bergerac

Annuaire professionnel de Bergerac et ses environs.

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

## Production

```bash
npm run build
```

## Structure

```
project/
├── src/                    # Code source
│   ├── App.tsx            # Application principale
│   ├── components/        # Composants React
│   ├── styles/           # Styles CSS
│   ├── types/            # Types TypeScript
│   ├── utils/            # Utilitaires
│   └── supabase/         # Configuration Supabase
├── main.tsx              # Point d'entrée (wrapper vers src/)
├── package.json          # Dépendances + Node.js 22.x
├── vite.config.ts        # Configuration Vite
└── tsconfig.json         # Configuration TypeScript
```

## Déploiement Vercel

Le projet est configuré pour Node.js 22.x et déploiement automatique sur Vercel.
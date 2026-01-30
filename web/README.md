# CRM La Cigale

CRM minimaliste pour la gestion des réservations du restaurant La Cigale.

## Stack Technique

- **Framework**: Next.js 15 (App Router + Turbopack)
- **Langage**: TypeScript 5+
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State**: TanStack Query (React Query) v5
- **Backend**: Airtable
- **Auth**: JWT + PIN code

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env.local` :

```env
AIRTABLE_API_KEY=your_api_key
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_NAME=Reservations
APP_ACCESS_CODE=1234
JWT_SECRET=your_secret_key
```

## Structure Airtable

Créer une table `Reservations` avec les champs suivants :

- `name` (Single line text) - Nom du client
- `nb_chairs` (Number) - Nombre de personnes
- `date` (Date with time) - Date et heure de la réservation
- `phone_number` (Phone number) - Numéro de téléphone
- `status` (Single select) - Statut : `en-attente`, `arrivé`, `libéré`
- `options` (Long text) - Notes et demandes spéciales

## Développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Build Production

```bash
npm run build
npm start
```

## Déploiement

Déployer sur [Vercel](https://vercel.com) :

1. Push le code sur GitHub
2. Importer le projet sur Vercel
3. Configurer les variables d'environnement
4. Déployer


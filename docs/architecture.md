# Architecture Technique - CRM La Cigale

## 1. Choix de la Stack & Justification

Pour répondre aux contraintes de **vitesse**, de **sobriété** et de **fiabilité** (offline-first feel), nous privilégions une stack "Lean" basée sur l'écosystème React/Next.js.

### Frontend
*   **Framework** : **Next.js 15+ (App Router & Turbopack)**.
    *   *Pourquoi ?* Standard actuel. Rendu serveur optimal (RSC) et vitesse de build accrue avec Turbopack.
*   **Langage** : **TypeScript 5+** (Strict mode). Indispensable.
*   **Styling** : **Tailwind CSS v4** + **shadcn/ui**.
    *   *Pourquoi ?* Performance (nouveau moteur Rust de Tailwind v4) et développement rapide.
*   **Runtime** : **React 19** (Server Actions, Compiler).
    *   *Pourquoi ?* Gestion native des formulaires via Server Actions, réduisant le code client.
*   **State & Data Fetching** : **TanStack Query (React Query) v5+**.
    *   *Pourquoi ?* C'est la clé de la performance perçue. Permet :
        *   **Optimistic UI** : Mise à jour instantanée de l'interface avant la réponse serveur.
        *   **Auto-refetching** : Garder les données à jour sans action utilisateur.
        *   **Deduping** : Évite les appels API inutiles.
*   **Formulaires** : **React Hook Form** + **Zod**. Légèreté et validation robuste.

### Backend (BFF - Backend for Frontend)
*   **Server Actions** : Méthode privilégiée pour les mutations (Création, MàJ, Suppression).
    *   *Pourquoi ?* Simplifie la codebase (pas d'API intermédiaire interne), typage de bout en bout, et fonctionne sans JS (Progressive Enhancement).
*   **Route Handlers (API)** : Uniquement pour des besoins spécifiques (ex: Webhooks entrants, ou proxy GET complexe avec cache spécifique hors React tree).
    *   Masquent la clé API Airtable (Sécurité).

### Infrastructure
*   **Hosting** : **Vercel** (Recommandé) ou tout hébergeur Node.js compatible.

---

## 2. Modélisation des Données

Airtable reste la **Single Source of Truth (SSOT)**. Le CRM ne stocke pas de données persistantes, il agit comme une vue ou un cache éphémère.

### Mapping Entités (TypeScript Interfaces)

L'application manipulera une interface `Reservation` propre, découplée de la structure technique d'Airtable (pas de `fields['Nom']`).

```typescript
// Type optimisé pour l'UI
interface Reservation {
  id: string;          // Airtable Record ID
  name: string;        // Client Name
  guests: number;      // Nb couverts
  date: string;        // ISOString UTC
  phone: string;
  status: 'confirmed' | 'arrived' | 'cancelled';
  notes?: string;
  table?: string;      // Optionnel
}
```

### Stratégie de Cache
1.  **Cache Client (React Query)** : `staleTime: 30s` pour la lecture. La liste ne se rafraîchit pas à chaque clic, sauf action explicite ou invalidation après mutation.
2.  **Pas de BDD intermédiaire (Redis/SQL)** : Pour rester "Sobra", on tape directement sur l'API Airtable. Le volume de réservations *par jour* est faible (< 500 records), ce qui tient largement dans les quotas API pour des requêtes filtrées.

---

## 3. Stratégie d'Intégration Airtable

### Communication
*   **Adapter Pattern** : Créer un service `lib/airtable.ts` qui isole toute la logique Airtable.
*   **Filtrage Serveur** : Les requêtes `GET` doivent TOUJOURS utiliser `filterByFormula` pour ne récupérer que les réservations du jour (ou de la date sélectionnée). On ne charge jamais toute la base.
    *   *Formule* : `IS_SAME({Date}, TODA(), 'day')`
*   **Tri** : `sort: [{field: "Date", direction: "asc"}]` côté Airtable pour recevoir les données déjà ordonnées.

### Performance & Rate Limits
*   Airtable limite à **5 req/s**.
*   **Solution** : Utiliser une librairie comme `bottleneck` côté serveur si nécessaire, ou simplement gérer les erreurs `429` avec un retry exponentiel (intégré dans React Query côté client, à gérer manuellement côté API Routes).

### Gestion des Erreurs
*   Si Airtable est down ou lent : Le client affiche un "Toast" discret (ex: "Synchronisation en attente...") et permet de continuer à consulter les données en cache.
*   Les mutations (POST/PATCH) sont mises en file d'attente via React Query (`useMutation` avec context de rollback).

---

## 4. Sécurité

### Authentification "Low-Friction"
Le personnel doit accéder très vite à l'outil. Pas d'emails/mots de passe complexes.

*   **Méthode** : **PIN Code** (Code d'accès partagé).
*   **Implémentation** :
    1.  Une page de login demande un code à 4-6 chiffres.
    2.  Ce code est comparé à une variable d'environnement `APP_ACCESS_CODE`.
    3.  Succès -> Création d'un **Cookie HTTPOnly** signé (JWT simple).
    4.  Middleware Next.js vérifie ce cookie sur toutes les routes `/protected` et API.

---

## 5. Instructions Développeur

### Structure du Projet (Suggérée)
```
/src
  /app
    /api           # Proxy endpoints
    /login         # Page auth
    /(dashboard)   # Routes protégées
      page.tsx     # Vue Liste
  /components
    /ui            # shadcn components
    /features      # Business components (ReservationCard)
  /lib
    airtable.ts    # Service Airtable
    utils.ts
    types.ts
  /hooks           # Custom hooks (useReservations)
```

### Checklist Démarrage
1.  **Environment** : Configurer `.env.local` avec :
    *   `AIRTABLE_API_KEY`
    *   `AIRTABLE_BASE_ID`
    *   `AIRTABLE_TABLE_NAME`
    *   `APP_ACCESS_CODE` (ex: "1234")
    *   `JWT_SECRET`
2.  **React Query** : Configurer le `QueryClient` par défaut avec `staleTime: 1000 * 60` (1 min) et `gcTime: 1000 * 60 * 60` (1 heure) pour éviter les re-fetchs agressifs.
3.  **Airtable SDK** : Utiliser le package officiel `airtable`.
    *   **Initialisation recommandée** (Conforme doc officielle) :
        ```typescript
        import Airtable from 'airtable';

        // Initialisation explicite pour le contexte Server Side
        const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);
        
        export default base;
        ```

### Focus Latence
*   TOUJOURS utiliser l'approche **Optimistic Update** pour `create`, `update`, `delete`. L'UI change immédiatement, le serveur travaille ensuite.
*   Ne jamais bloquer l'UI avec un loader plein écran ("Skeleton" accepté uniquement au premier chargement).

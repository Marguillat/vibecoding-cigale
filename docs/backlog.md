# Backlog - CRM Réservations "La Cigale"

## Vision du Produit
Un CRM "métier" ultra-simplifié pour l'équipe en salle, agissant comme interface rapide et fiable au-dessus d'Airtable. L'outil doit être optimisé pour l'usage sur tablette en service (rapidité, ergonomie tactile, mode sombre) tout en centralisant les données dans Airtable.

## État d'avancement (Récapitulatif)

| ID | Tâche | Agent Assigné | Statut |
| :--- | :--- | :--- | :--- |
| **ARCH-001** | Initialisation Stack & Architecture | Software Architect | 🟢 Fait |
| **UX-001** | Design System "La Cigale" (Dark Mode) | UX/UI Designer | 🟢 Fait |
| **UX-002** | Maquettes Vues & Flux Utilisateur | UX/UI Designer | 🟢 Fait |
| **DEV-001** | Connecteur Airtable (Service API) | Fullstack Developer | 🟢 Fait |
| **DEV-002** | Vue Liste des Réservations (Read) | Fullstack Developer | 🟢 Fait |
| **DEV-003** | Création & Édition Rapide (Create/Update) | Fullstack Developer | 🟢 Fait |
| **DEV-004** | Gestion Statuts & Annulation (Update/Delete) | Fullstack Developer | 🟢 Fait |
| **DEV-005** | Intégration Champ Status (en-attente/arrivé/libéré) | Fullstack Developer | 🟢 Fait |

## Backlog Détaillé

### ARCH-001 : Initialisation Stack & Architecture
**Agent :** Software Architect
**Description :** Mettre en place le socle technique du projet. Choisir les technologies adaptées pour garantir la rapidité (temps de réponse < 200ms) et la compatibilité iPad. Définir la structure du projet et la stratégie de gestion d'état (sync Airtable).
**Critères d'Acceptation :**
- Stack initialisée (ex: Vite/React ou Next.js).
- Configuration du linter/formatter.
- Architecture prête pour la sync bi-directionnelle (gestion des erreurs réseau).
- Preuve de concept (POC) de latence locale minime.

### UX-001 : Design System "La Cigale" (Dark Mode)
**Agent :** UX/UI Designer
**Description :** Définir les guides de style pour une interface sobre et sombre, adaptée à l'ambiance tamisée du restaurant. Priorité à la lisibilité et à l'ergonomie tactile.
**Critères d'Acceptation :**
- Palette de couleurs "Dark Mode" définie.
- Typographie lisible sur tablette.
- Composants "Touch-friendly" (Boutons larges, zones de clic > 44px).

### UX-002 : Maquettes Vues & Flux Utilisateur
**Agent :** UX/UI Designer
**Description :** Maquetter les écrans principaux en respectant la contrainte "Mobile-First / Tablet-Friendly".
**Critères d'Acceptation :**
- Maquette vue liste (Indicateurs statut, filtre date).
- Maquette formulaire création "express".
- Flux de validation "Arrivée client" en max 2 clics.

### DEV-001 : Connecteur Airtable (Service API)
**Agent :** Fullstack Developer
**Description :** Implémenter la couche de service responsable de la communication avec l'API Airtable. Doit gérer la lecture et l'écriture.
**Critères d'Acceptation :**
- Connexion API Airtable fonctionnelle.
- Méthodes CRUD de base implémentées.
- Mapping des champs : `name`, `date`, `nb_chairs`, `phone_number`, `options`, `status`.
- Synchronisation bi-directionnelle vérifiée (< 5 secondes).
- Gestion des erreurs d'API (retry ou notification).

### DEV-002 : Vue Liste des Réservations (Read)
**Agent :** Fullstack Developer
**Description :** Développer l'écran principal affichant les réservations du jour.
**Critères d'Acceptation :**
- Liste chargée depuis Airtable.
- Filtrage par défaut sur la date du jour (champ `date`).
- Affichage clair des infos : Heure (via `date`), Nom (`name`), Pax (`nb_chairs`), Table (à définir si géré dans `options` ou nouveau champ), Notes (`options`).
- Indicateurs visuels des statuts basés sur le champ `status` (en-attente, arrivé, libéré).

### DEV-003 : Création & Édition Rapide (Create/Update)
**Agent :** Fullstack Developer
**Description :** Intégrer le formulaire de prise de réservation et de modification.
**Critères d'Acceptation :**
- Formulaire accessible en 1 clic.
- Champs : Nom (`name`), Tel (`phone_number`), Nb personnes (`nb_chairs`), Heure (`date`), Notes/Options (`options`).
- La création d'une entrée remonte dans Airtable avec les bons types de données.
- Modification simple possible (Heure, Notes/Options).

### DEV-004 : Gestion Statuts & Annulation (Update/Delete)
**Agent :** Fullstack Developer
**Description :** Implémenter les interactions rapides pour le service (Arrivée client, Annulation).
**Critères d'Acceptation :**
- Action "Marquer comme Arrivé" en max 2 clics.
- Annulation avec confirmation.
- Mise à jour immédiate de l'interface (Optimistic UI fortement recommandé).

### DEV-005 : Intégration Champ Status (en-attente/arrivé/libéré)
**Agent :** Fullstack Developer
**Description :** Les serveurs de La Cigale ont ajouté un nouveau champ `status` dans la table Airtable des réservations. Ce champ est une sélection unique avec trois valeurs possibles : `en-attente`, `arrivé`, `libéré`. Il doit être intégré dans le CRM pour permettre un suivi précis du cycle de vie des réservations.
**Critères d'Acceptation :**
- Le champ `status` est mappé dans le service API Airtable.
- Le type TypeScript reflète les trois valeurs possibles : `"en-attente" | "arrivé" | "libéré"`.
- La vue liste affiche visuellement le statut de chaque réservation (badges colorés recommandés).
- Le formulaire de création initialise le statut à `"en-attente"` par défaut.
- Les actions rapides permettent de changer le statut : `en-attente` → `arrivé` → `libéré`.
- La modification du statut se synchronise avec Airtable en < 5 secondes.
- L'interface reflète immédiatement le changement (Optimistic UI).

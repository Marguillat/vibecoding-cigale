# Backlog - CRM Réservations "La Cigale"

> **Dernière Modification** : 26 Février 2026 (Vérification & Ajout Vue Jour/Semaine Timeline)
> **Statut** : En cours de maintenance / évolutions


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
| **UX-003** | Maquette Vue Kanban (Mobile First) | UX/UI Designer | � Fait |
| **ARCH-002** | Sélection Librairie Drag & Drop (Touch support) | Software Architect | � Fait |
| **DEV-006** | Structure Vue Kanban (Colonnes) | Fullstack Developer | 🟢 Fait |
| **DEV-007** | Implémentation Drag & Drop et Gestion d'État | Fullstack Developer | 🟢 Fait |
| **UX-004** | Intégration Visuelle Indicateur "Notes" | UX/UI Designer | 🟢 Fait |
| **DEV-008** | Logique d'Affichage Icône Warning (Notes) | Fullstack Developer | 🟢 Fait |
| **UX-005** | Maquette Vue Calendrier (Mensuel/Occupation) | UX/UI Designer | 🟢 Fait |
| **ARCH-003** | Choix Librairie Calendrier & Gestion Dates | Software Architect | 🟢 Fait |
| **DEV-009** | Implémentation Vue Calendrier (Navigation) | Fullstack Developer | 🟢 Fait |
| **DEV-010** | Logique Drag & Drop Calendrier (Modif Date) | Fullstack Developer | 🔴 À faire |
| **DEV-011** | Adaptation API pour fetch hebdomadaire | Fullstack Developer | 🔴 À faire |
| **UX-006** | Maquette Vue Semaine / Timeline | UX/UI Designer | 🟢 Fait |
| **ARCH-004** | Architecture Vue Timeline (CSS Grid + dnd-kit) | Software Architect | 🟢 Fait |
| **DEV-012** | Composant Grille Timeline Semaine | Fullstack Developer | 🔴 À faire |
| **DEV-013** | Composant Bloc Réservation (Timeline Block) | Fullstack Developer | 🔴 À faire |
| **DEV-014** | Intégration Timeline dans le Dashboard | Fullstack Developer | 🔴 À faire |

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

### UX-003 : Maquette Vue Kanban (Mobile First)
**Agent :** UX/UI Designer
**Description :** Concevoir une vue Kanban pour visualiser les réservations par statut (`en-attente`, `arrivé`, `libéré`). L'interface doit rester ultra-simple et adaptée aux tablettes (zones de drop larges).
**Critères d'Acceptation :**
- 3 colonnes clairement identifiées correspondant aux statuts.
- Cards simplifiées pour la vue Kanban (Nom, Heure, Nb Pax).
- Indicateurs visuels clairs lors du survol/drag d'une carte.
- Adaptation mobile (scroll horizontal ou navigation par onglets si manque d'espace).

### ARCH-002 : Sélection Librairie Drag & Drop (Touch support)
**Agent :** Software Architect
**Description :** Sélectionner et valider une librairie de Drag & Drop compatible React 19 et parfaitement fonctionnelle sur écran tactile (iPad).
**Critères d'Acceptation :**
- Librairie compatible React 19 (ex: `dnd-kit`, `react-beautiful-dnd` ou HTML5 Dnd API avec polyfill).
- Support tactile natif sans latence perceptible.
- POC rapide validant le fonctionnement sur mobile/tablette.

### DEV-006 : Structure Vue Kanban (Colonnes)
**Agent :** Fullstack Developer
**Description :** Implémenter le squelette de la vue Kanban avec les 3 colonnes basées sur les statuts existants.
**Critères d'Acceptation :**
- Nouvelle route ou switch de vue (Liste / Kanban) sur le dashboard.
- 3 Colonnes : En attente, Arrivé, Libéré.
- Les réservations existantes s'affichent dans la bonne colonne.
- Le design respecte les maquettes UX-003.

### DEV-007 : Implémentation Drag & Drop et Gestion d'État
**Agent :** Fullstack Developer
**Description :** Rendre le tableau Kanban interactif. Le déplacement d'une carte d'une colonne à une autre doit mettre à jour le statut.
**Critères d'Acceptation :**
- Drag & Drop fluide des cartes entre les colonnes.
- Mise à jour optimiste de l'UI (le changement est immédiat visuellement).
- Appel API en arrière-plan pour sauvegarder le nouveau statut.
- Gestion des erreurs (rollback de la carte si l'API échoue).

### UX-004 : Intégration Visuelle Indicateur "Notes"
**Agent :** UX/UI Designer
**Description :** Définir l'emplacement et le style d'une icône d'alerte pour les réservations comportant des notes (allergies, demandes spéciales).
**Critères d'Acceptation :**
- Utilisation d'une icône (ex: `AlertCircle` ou `MessageSquare`) et non d'un emoji.
- L'icône doit être visible sur la carte en vue Kanban sans surcharger le design.
- Couleur d'accentuation (ex: `amber-500`) pour attirer l'attention du serveur.

### DEV-008 : Logique d'Affichage Icône Warning (Notes)
**Agent :** Fullstack Developer
**Description :** Implémenter la logique conditionnelle pour afficher l'icône de warning sur les `KanbanCard`.
**Critères d'Acceptation :**
- L'icône ne s'affiche QUE si le champ `notes` (ou `options` dans Airtable) n'est pas vide.
- Utilisation du composant `lucide-react` approprié.
- Ajout d'un tooltip ou d'un simple indicateur visuel.
- Testé sur vue Kanban et vue Liste (optionnel mais recommandé pour cohérence).

### UX-005 : Maquette Vue Calendrier (Mensuel/Occupation)
**Agent :** UX/UI Designer
**Description :** Concevoir une vue calendrier permettant une vision macro de l'occupation du restaurant.
**Critères d'Acceptation :**
- Vue mensuelle affichant un indicateur de charge par jour (ex: jauge ou points de couleur vert/orange/rouge).
- Navigation fluide entre les mois (flèches + sélection rapide "Aujourd'hui").
- Au clic sur un jour : redirection vers la vue Liste/Kanban filtrée à cette date.
- Design cohérent avec le "Dark Mode" existant.

### ARCH-003 : Choix Librairie Calendrier & Gestion Dates
**Agent :** Software Architect
**Description :** Sélectionner la librairie la plus adaptée pour gérer un calendrier complet avec interactions avancées.
**Critères d'Acceptation :**
- Librairie compatible React 19 / Next.js (ex: `react-day-picker` v9, `react-big-calendar` ou solution `shadcn/ui` customisée).
- Support natif de l'internationalisation (fr-FR) et des Timezones.
- Légèreté et performance (éviter les bloatwares type fullcalendar si non nécessaire).

### DEV-009 : Implémentation Vue Calendrier (Navigation)
**Agent :** Fullstack Developer
**Description :** Intégrer la vue Calendrier dans le dashboard (nouvel onglet "Planning").
**Critères d'Acceptation :**
- Intégration dans les Tabs existants (Liste / Kanban / Calendrier).
- Affichage de la grille du mois courant par défaut.
- Navigation Mois Précédent / Mois Suivant fonctionnelle.
- Clic sur une case jour -> Change le filtre de date global et bascule sur la vue Liste.

### DEV-010 : Logique Drag & Drop Calendrier (Modif Date)
**Agent :** Fullstack Developer
**Description :** Permettre de glisser une réservation (depuis une sidebar "non assignée" ou un drawer) vers une date du calendrier pour la planifier/déplacer. *Note : Cette fonctionnalité peut être complexe, starting simple.*
**Critères d'Acceptation :**
- (À affiner selon UX) Capacité à déplacer une réservation d'un jour à l'autre.
- Confirmation obligatoire ("Voulez-vous déplacer la réservation de M. X au 12/03 ?").
- Mise à jour API instantanée.

### DEV-011 : Adaptation API pour fetch mensuel
**Agent :** Fullstack Developer
**Description :** Optimiser le chargement des données pour la vue calendrier.
**Critères d'Acceptation :**
- Création d'une route API (ou Server Action) capable de renvoyer les réservations pour une plage de dates (semaine entière).
- Formule Airtable : `AND(IS_AFTER({date}, 'weekStart'), IS_BEFORE({date}, 'weekEnd'))`.
- Clé de cache React Query : `['reservations', 'week', weekStart]`.
- Mise en cache adaptée.

### UX-006 : Maquette Vue Semaine / Timeline
**Agent :** UX/UI Designer
**Description :** Concevoir la vue Timeline hebdomadaire type "Google Calendar". Le design a été réalisé et est documenté dans `design_specs.md` (section "Vue Semaine / Timeline Hebdomadaire").
**Critères d'Acceptation :**
- Layout grille 8 colonnes (1 axe horaire + 7 jours).
- Blocs réservation positionnés verticalement à l'heure exacte.
- Bordure gauche colorée selon le statut.
- Adaptation mobile (1 seul jour visible + swipe).

### ARCH-004 : Architecture Vue Timeline (CSS Grid + dnd-kit)
**Agent :** Software Architect
**Description :** L'architecture de la vue Timeline a été définie dans `architecture.md`. Choix validé : CSS Grid custom (pas de librairie externe type FullCalendar) + réutilisation de `dnd-kit` pour le drag temporel.
**Critères d'Acceptation :**
- CSS Grid simple (11 créneaux × 7 jours).
- Chaque cellule (jour × créneau) = zone droppable `dnd-kit`.
- URL State pour la navigation (`?week=2026-02-24`).

---

### DEV-012 : Composant Grille Timeline Semaine
**Agent :** Fullstack Developer

#### Description
Créer le composant `week-timeline.tsx` qui affiche une grille chronologique hebdomadaire.

#### Spécification Fonctionnelle Détaillée

**Fichier cible :** `src/components/features/week-timeline.tsx`

**Props attendues :**
```typescript
interface WeekTimelineProps {
  reservations: Reservation[];  // Réservations de la semaine
  weekStart: Date;              // Lundi de la semaine affichée
  onReservationClick: (reservation: Reservation) => void; // Ouvre le Sheet d'édition
  onEmptySlotClick: (date: Date, hour: number) => void;   // Ouvre le formulaire pré-rempli
}
```

**Structure de la grille :**
- **Layout** : `display: grid` avec `grid-template-columns: 60px repeat(7, 1fr)`.
- **Axe Y (colonne 1)** : Créneaux horaires de **11h à 22h** (11 lignes). Chaque cellule = 60px de hauteur minimum. Afficher le label horaire ("11:00", "12:00", etc.).
- **Axe X (colonnes 2-8)** : 7 jours de la semaine. Header avec le label jour ("lun. 24/02", "mar. 25/02", etc.).
- **Lignes horizontales** : Séparateurs légers entre chaque créneau (`border-zinc-100` / `dark:border-zinc-800`).
- **Colonne du jour courant** : Fond légèrement accentué (`bg-primary/5`).

**Header de la grille :**
- Titre : "Semaine du X au Y".
- Flèches de navigation (< >) pour changer de semaine.
- Bouton "Aujourd'hui" pour revenir à la semaine courante.

**Interaction clic sur créneau vide :**
- Appeler `onEmptySlotClick(date, hour)` avec la date et l'heure du créneau cliqué.
- Le formulaire de création doit s'ouvrir pré-rempli avec cette date+heure.

**Adaptation mobile (< 768px) :**
- Afficher **1 seul jour** à la fois (grille 2 colonnes : axe horaire + 1 jour).
- Swipe horizontal pour naviguer entre les jours.
- Header : Nom du jour + date ("mer. 25/02").

**Critères d'Acceptation :**
- La grille s'affiche correctement avec les 7 jours et les créneaux 11h-22h.
- Les réservations sont positionnées dans la bonne cellule (jour + heure).
- Le header de navigation fonctionne.
- Le clic sur un créneau vide déclenche `onEmptySlotClick`.
- Responsive : 1 jour visible sur mobile.

---

### DEV-013 : Composant Bloc Réservation (Timeline Block)
**Agent :** Fullstack Developer

#### Description
Créer le composant `timeline-block.tsx` qui représente une réservation positionnée dans la grille Timeline.

#### Spécification Fonctionnelle Détaillée

**Fichier cible :** `src/components/features/timeline-block.tsx`

**Props attendues :**
```typescript
interface TimelineBlockProps {
  reservation: Reservation;
  onClick: (reservation: Reservation) => void;
}
```

**Positionnement dans la grille :**
- Extraire l'heure depuis `reservation.date` (ex: `new Date(reservation.date).getHours()`).
- Positionner le bloc dans la cellule correspondante via `grid-row` et `grid-column`.
- **Hauteur** : Fixe (minimum 60px), ou proportionnelle si une durée est définie (par défaut 1 créneau = 1h).

**Contenu du bloc :**
- **Heure** : Gras, 14-16px (ex: "19:00").
- **Nom** : Texte tronqué si nécessaire (`truncate`).
- **Pax** : Badge avec nombre de couverts (ex: "4 pers.").
- **Téléphone** : Optionnel, affiché si l'espace le permet.
- **Indicateur Notes** : Réutiliser l'icône `MessageSquareText` (amber) si `reservation.notes` non vide.

**Style visuel :**
- **Bordure gauche colorée** selon le statut (`border-l-4`) :
  - `en-attente` : `border-amber-500`
  - `arrivé` : `border-emerald-500`
  - `libéré` : `border-zinc-400`
- **Fond** : `bg-white dark:bg-zinc-900` avec `shadow-sm`.
- **Radius** : `rounded-md`.

**Interaction :**
- **Clic** : Appeler `onClick(reservation)` pour ouvrir le Sheet d'édition.

**Critères d'Acceptation :**
- Le bloc affiche correctement Heure, Nom, Pax.
- La bordure gauche reflète le statut de la réservation.
- L'icône de note s'affiche si `notes` est présent.
- Le clic ouvre le formulaire d'édition.
- Le bloc est positionné correctement dans la grille.

---

### DEV-014 : Intégration Timeline dans le Dashboard
**Agent :** Fullstack Developer

#### Description
Intégrer la vue Timeline dans le dashboard existant.

#### Spécification Fonctionnelle Détaillée

**Fichier cible :** `src/app/dashboard/page.tsx` (modification)

**Changements requis :**

1. **Sous-navigation dans l'onglet Planning** :
   - L'onglet "Planning" existant (qui affiche `CalendarView`) doit proposer un sub-toggle : **Mois** | **Semaine**.
   - Composant recommandé : `ToggleGroup` (shadcn/ui) ou sous-`Tabs`.
   - Le sub-mode sélectionné est persisté dans `localStorage`.

2. **Mode "Mois"** (existant) :
   - Affiche le `CalendarView` actuel (pas de changement).

3. **Mode "Semaine"** (nouveau) :
   - Affiche le composant `WeekTimeline`.
   - **Data Fetching** : Utiliser le hook `useWeekReservations(weekStart)` (appelé via DEV-011).
   - **Interaction clic sur bloc** : Ouvre le `Sheet` d'édition (même comportement que la vue Liste).
   - **Interaction clic sur créneau vide** : Ouvre le formulaire de création pré-rempli avec la date et l'heure du créneau.

4. **Dépendances** :
   - DEV-011 (API fetch hebdomadaire) doit être implémenté en premier.
   - DEV-012 et DEV-013 doivent être terminés.

**Critères d'Acceptation :**
- Le toggle Mois/Semaine fonctionne dans l'onglet Planning.
- La vue Semaine charge les réservations de la semaine sélectionnée.
- Le clic sur un bloc ouvre l'édition.
- Le clic sur un créneau vide ouvre la création pré-remplie.
- Navigation entre semaines fonctionnelle.
- Le mode est persisté en localStorage.




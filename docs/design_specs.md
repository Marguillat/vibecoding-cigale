# Design Specifications - CRM La Cigale

> **Document de Référence UX/UI**
> *   **Version** : 1.1
> *   **Statut** : Validé pour développement
> *   **Cible** : Personnel de salle (Serveurs, Maîtres d'hôtel)
> *   **Dernière mise à jour** : 26 Février 2026 (Ajout Vue Semaine / Timeline)

---

## 1. Vision Ergonomique
L'interface est conçue pour être une extension naturelle de la main du serveur. Chaque milliseconde compte en service.

*   **Philosophie "Cockpit"** : Toutes les informations critiques pour le service en cours sont visibles sans scroll.
*   **Adaptabilité Lumineuse (Adaptive Design)** :
    *   **Mode Jour (Light)** : Contraste élevé pour la lisibilité en terrasse ou sous forte lumière artificielle.
    *   **Mode Nuit (Dark)** : Confort visuel pour le service du soir, limitant l'éblouissement.
    *   *Le système doit suivre la préférence système de l'appareil par défaut.*
*   **La Règle du Pouce** : Les zones d'interaction principales (Validation, Navigation) sont situées dans la zone inférieure de l'écran, accessible au pouce.

---

## 2. Design Tokens
Basés sur **Tailwind CSS**. L'interface utilise des variables CSS ou les modifieurs `dark:` pour gérer les deux thèmes.

### 🎨 Couleurs Sémantiques (Light / Dark)
Utilisation du preset `zinc` pour une neutralité maximale.

| Usage | Light Mode (Jour) | Dark Mode (Nuit) | Description |
| :--- | :--- | :--- | :--- |
| **Background App** | `bg-white` | `bg-zinc-950` | Fond principal. |
| **Surface Card** | `bg-white` (Border) | `bg-zinc-900` | Conteneurs. En light, on utilise souvent une bordure plutôt qu'un fond gris. |
| **Surface Elev** | `bg-zinc-100` | `bg-zinc-800` | Éléments interactifs secondaires / Hovers. |
| **Text Primary** | `text-zinc-900` | `text-zinc-50` | Titres, données critiques. |
| **Text Secondary** | `text-zinc-500` | `text-zinc-400` | Labels, métadonnées. |
| **Border** | `border-zinc-200` | `border-zinc-800` | Séparateurs. |
| **Primary/Action** | `bg-primary text-primary-fg` | `bg-primary text-primary-fg` | Bouton principal. |
| **Success** | `text-emerald-600` | `text-emerald-500` | Statut "Confirmé" / "Arrivé". |
| **Warning** | `text-amber-600` | `text-amber-500` | Attention requise. |
| **Destructive** | `text-red-600` | `text-red-500` | Annulation. |
| **Status: En-Attente** | `bg-amber-100 text-amber-700` | `bg-amber-950 text-amber-400` | Badge pour réservations en attente. |
| **Status: Arrivé** | `bg-emerald-100 text-emerald-700` | `bg-emerald-950 text-emerald-400` | Badge pour clients arrivés. |
| **Status: Libéré** | `bg-zinc-100 text-zinc-700` | `bg-zinc-800 text-zinc-300` | Badge pour tables libérées. |

### 🔠 Typographie
*   **Famille** : `Inter` (Sans-serif, lisibilité maximale).
*   **Tailles Clés** :
    *   `text-lg` (18px) : Données standards (Nom, Heure). *Minimum pour lisibilité rapide.*
    *   `text-sm` (14px) : Métadonnées secondaires (Date de créa).
    *   `text-2xl` (24px) : Chiffres clés (Nb couverts).

### 📐 Espacements & Formes
*   **Radius** : `rounded-md` (0.375rem).
*   **Padding Touch** : Minimum `p-4` sur les conteneurs tactiles.
*   **Gap** : `gap-4` standard.

---

## 3. Composants Clés (shadcn/ui implémentation)

### `Card` (L'unité atomique)
Utilisé pour représenter une réservation dans la vue liste mobile.
*   **Structure** :
    *   `CardHeader` : Heure (Gros) + Statut (Badge).
    *   `CardContent` : Nom du client + Nb Personnes (Icon User).
    *   `CardFooter` : Actions rapides (Arrivé).

### `Button` (Extensions)
*   Standard (Primary) : `h-12 px-6` (Plus grand que le défaut `h-10`).
*   Ghost : Pour les actions secondaires afin de réduire le bruit visuel.
*   IconOnly : Doit impérativement avoir une `w-12 h-12` pour la cible tactile.

### `Sheet` (Side Panel)
Utilisé pour **Créer / Modifier** une réservation sans quitter le contexte de la liste.
*   S'ouvre sur le côté droit (ou bas sur mobile).
*   Garde la liste visible en arrière-plan (overlay sombre).

### `Badge` (Statuts)
Utilisé pour afficher le champ `status` des réservations (DEV-005).

*   **En-Attente** : `variant="secondary"` avec couleurs personnalisées Amber.
    *   Light: `bg-amber-100 text-amber-700 border-amber-300`
    *   Dark: `bg-amber-950 text-amber-400 border-amber-800`
    *   Icône recommandée: `Clock` (lucide-react)
*   **Arrivé** : `variant="secondary"` avec couleurs personnalisées Emerald.
    *   Light: `bg-emerald-100 text-emerald-700 border-emerald-300`
    *   Dark: `bg-emerald-950 text-emerald-400 border-emerald-800`
    *   Icône recommandée: `CheckCircle2` (lucide-react)
*   **Libéré** : `variant="secondary"` avec couleurs personnalisées Zinc (neutre).
    *   Light: `bg-zinc-100 text-zinc-700 border-zinc-300`
    *   Dark: `bg-zinc-800 text-zinc-300 border-zinc-700`
    *   Icône recommandée: `CircleCheck` ou `Circle` (lucide-react)

---

## 4. Mapping Backlog

### 🟢 DEV-002 : Vue Liste (Read)
*   **Composant** : `ScrollArea` contenant une liste de `Card`.
*   **Layout** :
    *   Header fixe : Titre "Aujourd'hui" + Filtre Date (`Popover` calendar) + Bouton "+".
    *   Body scrollable : Liste des réservations triées par heure.
*   **État vide** : Afficher un composant clair "Aucune réservation" au centre.

### 🟡 DEV-003 : Formulaire Express (Create/Update)
*   **Composant** : `Sheet` contenant un `Form` (react-hook-form + zod).
*   **Champs** :
    1.  `Input` (Nom) - *Focus automatique à l'ouverture*.
    2.  `Input` type="tel" (Téléphone) - Clavier numérique large.
    3.  `Select` ou `ToggleGroup` (Nb Personnes) - Boutons pré-définis [1] [2] [3] [4] [5+] pour rapidité.
    4.  `Input` type="time" (Heure).
    5.  `Textarea` (Notes) - Optionnel.
*   **Action** : Bouton "Enregistrer" (`w-full`) en bas de sheet (sticky bottom).

### 🔴 DEV-004 : Actions Rapides (Update Status / Modif)
*   **Vue Liste - Boutons Directs** (Demande terrain : limiter les clics).
    *   **Edit** : Bouton Icône `Pencil` (Ghost variant). Ouvre la Sheet.
    *   **Cancel** : Bouton Icône `Trash2` (Ghost variant, text-destructive). Ouvre AlertDialog.
    *   **Action Principale** : Bouton/Badge "Arrivé" (accès direct).
*   **Vue Kanban - Actions** :
    *   Menu "..." (`DropdownMenu`) conservé pour la vue Kanban (manque d'espace sur les cartes).
    *   Drag & Drop prioritaire pour le statut.

### 🟣 DEV-005 : Intégration Champ Status (Cycle de Vie)
*   **Composant Principal** : `Badge` avec icône intégrée pour afficher le statut actuel.
*   **Positionnement** : Dans le `CardHeader` à côté de l'heure, ou en haut à droite de la `Card`.
*   **Interaction - Changement de Statut** :
    *   **Option 1 (Recommandée)** : `DropdownMenu` au clic sur le Badge.
        *   Menu avec 3 options : "En-Attente", "Arrivé", "Libéré".
        *   Chaque option affiche l'icône et la couleur correspondante.
        *   Sélection = changement immédiat (Optimistic UI).
    *   **Option 2** : Boutons d'action rapide dans `CardFooter`.
        *   Bouton "Marquer Arrivé" (visible si `status === "en-attente"`).
        *   Bouton "Libérer Table" (visible si `status === "arrivé"`).
*   **Flux Typique** :
    1.  Création → `status = "en-attente"` (Badge Amber).
    2.  Client arrive → Clic → `status = "arrivé"` (Badge Emerald).
    3.  Table libérée → Clic → `status = "libéré"` (Badge Zinc/Gris).
*   **Feedback Visuel** :
    *   Animation de transition du badge (fade + scale).
    *   Toast de confirmation optionnel : "Statut mis à jour".
    *   En cas d'erreur API : Rollback du badge + Toast d'erreur.

### 🟠 UX-003 : Vue Kanban (Board)
Alternative visuelle à la liste pour le pilotage du service.

*   **Structure (Tablet Co-located)** :
    *   3 colonnes fixes (`grid-cols-3` height 100%).
    *   Headers clairs avec compteurs : "En Attente (3)", "Arrivé (5)", "Libéré (12)".
    *   Fond de colonne subtil : `bg-zinc-50/50` (Light) / `bg-zinc-900/50` (Dark).

*   **Composant Card (Kanban Variant)** :
    *   Plus compacte que la vue liste.
    *   Contenu : Heure (Gras 18px), Nom (Tuncate), Badge Pax.
    *   *Pas de boutons* : L'interaction principale est le drag.

*   **Adaptation Mobile (< 768px)** :
    *   Pas de place pour 3 colonnes.
    *   **Solution** : Scroll Horizontal avec "Snap Points". Une colonne prend 85% de la largeur.
    *   Indicateur de scroll (dots) en bas d'écran.

*   **Interactions Drag & Drop** :
    *   **Lift** : La carte gagne une ombre portée (`shadow-xl`) et scale (1.05) au début du drag.
    *   **Drop Zone** : La colonne survolée s'illumine (`ring-2 ring-primary/20`).
    *   **Haptic** : Vibration légère au drop réussi (si supporté).
    *   **Transition** : Déplacement de la carte instantané (Optimistic).

### 🟡 UX-004 : Indicateur "Notes" (Warning)
Alerte visuelle critique pour les réservations contenant des demandes spéciales ou allergies.

*   **Composant Visuel** :
    *   Icône : `AlertCircle` (famille Lucide).
    *   Couleur : `text-amber-500` (Light & Dark).
    *   Taille : Relative au texte (16px).

*   **Emplacement** :
    *   **Vue Liste** : À droite du nom du client.
    *   **Vue Kanban** : Coin supérieur droit de la carte (Badge).

*   **Comportement** :
    *   S'affiche **uniquement** si le champ `notes` n'est pas vide.
    *   Doit être visible au premier coup d'œil (scan rapide avant service).

### 🔵 UX-005 : Vue Calendrier (Planning)

*   **Cellule Jour (Composant)** :
    *   Affichage du numéro (ex: "12").
    *   **Indicateur de Charge** : Point simple (`w-2 h-2`) sous le numéro.
        *   🟢 Vert (`text-emerald-500`) : Charge faible (<50%).
        *   🟠 Orange (`text-amber-500`) : Charge moyenne (50-80%).
        *   🔴 Rouge (`text-red-500`) : Complet / Haute charge (>80%).
    *   **État Actif** : Cercle plein (`bg-primary text-primary-foreground`) si sélectionné.
    *   **Aujourd'hui** : Bordure accentuée (`border-primary`).

*   **Interactions** :
    *   **Clic Date** :
        1.  Filtre la liste globale sur cette date.
        2.  Bascule automatiquement vers la vue précédemment active (Liste ou Kanban).
    *   **Swipe (Mobile)** : Navigation Mois suivant/précédent.

#### Vue Semaine (Timeline Hebdomadaire)
Vue chronologique type "Google Calendar" pour dispatcher visuellement les réservations.

*   **Structure (Tablet/Desktop)** :
    *   **Layout** : `grid` avec 8 colonnes (1 axe horaire + 7 jours).
    *   **Axe Y** : Créneaux horaires (11h-22h, configurable). Lignes horizontales légères (`border-zinc-100` / `dark:border-zinc-800`).
    *   **Axe X** : 7 colonnes jour avec label ("lun. 23/02") et la date.
    *   **Header** : "Semaine du X au Y" + Flèches Nav (< >) + Bouton "Aujourd'hui".
    *   **Jour courant** : Colonne avec fond légèrement accentué (`bg-primary/5`).

*   **Composant "Reservation Block"** (Time Card) :
    *   Positionée verticalement à l'heure exacte dans la colonne du jour.
    *   **Hauteur** : Proportionnelle à la durée (min 60px pour lisibilité).
    *   **Contenu** : Heure (Gras), Nom (Truncate), Pax (Badge), Téléphone.
    *   **Bordure gauche colorée** selon le statut :
        *   `border-l-4 border-amber-500` : En attente.
        *   `border-l-4 border-emerald-500` : Arrivé.
        *   `border-l-4 border-zinc-400` : Libéré.
    *   **Fond** : `bg-white dark:bg-zinc-900` avec `shadow-sm`.
    *   **Clic** : Ouvre le `Sheet` d'édition.

*   **Interactions** :
    *   **Clic créneau vide** : Ouvre le formulaire de création pré-rempli (date + heure du créneau cliqué).
    *   **Drag & Drop** : Déplacement vertical (changement d'heure) ou horizontal (changement de jour).
    *   **Confirmation** : `AlertDialog` "Déplacer la réservation de X au [date] à [heure] ?".

*   **Adaptation Mobile (< 768px)** :
    *   Afficher **1 seul jour** à la fois (axe Y horaire visible).
    *   **Swipe horizontal** : Navigation entre les jours.
    *   Header : Nom du jour + date ("mer. 25/02").

*   **Navigation Planning** :
    *   Sous-tabs ou `ToggleGroup` dans la vue Planning : **Mois** | **Semaine**.
    *   Le mode sélectionné est persisté (localStorage).

---

## 5. Règles d'Accessibilité & Performance

### ♿ Accessibilité (A11Y)
1.  **Cible Tactile (Touch Target)** : Tout élément interactif doit faire au minimum **44x44 pixels**. Si l'icône est plus petite, ajouter du padding invisible.
2.  **Contraste** : Vérifier que le `text-zinc-400` sur `bg-zinc-950` passe le ratio AA. Si non, utiliser `text-zinc-300`.
3.  **Labels** : Tous les `Button` icon-only doivent avoir un `aria-label`.

### ⚡ Performance (Perceived Latency)
1.  **Optimistic UI** : Lors du clic sur "Enregistrer" ou "Arrivé", l'interface se met à jour **immédiatement**. La requête API part en arrière-plan.
    *   *Si erreur* : "Toast" (`Sonner`) d'erreur et rollback de l'état.
2.  **Feedback Tactile** : État `:active` visible sur tous les boutons (changement d'opacité ou scale 0.98) pour confirmer la prise en compte du clic.
3.  **Skeleton Loading** : Au chargement initial, afficher des `Skeleton` Cards pour éviter le layout shift.

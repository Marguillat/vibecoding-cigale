# PRD - CRM Réservations "La Cigale"

> **Dernière Modification** : 30 Janvier 2026


## 1. Introduction & Vision
Le restaurant "La Cigale" utilise actuellement Airtable pour gérer ses réservations. Bien que puissant, Airtable est jugé trop complexe et peu ergonomique pour une utilisation rapide en plein service (tablette, stress, rapidité requise). 

L'objectif est de créer un CRM "métier" ultra-simplifié qui agit comme une interface au-dessus d'Airtable, permettant une gestion fluide des réservations par l'équipe en salle.

## 2. Objectifs Métier
*   **Rapidité d'exécution** : Réduire le temps de saisie d'une réservation.
*   **Fiabilité** : Éviter les erreurs de manipulation propres à l'interface Airtable sur mobile/tablette.
*   **Centralisation** : Garder Airtable comme base de données unique (Single Source of Truth) tout en offrant une UX dédiée.

## 3. Périmètre (In/Out)

### In
*   Affichage de la liste des réservations du jour.
*   **[NOUVEAU] Vue Calendrier (Mensuelle/Hebdomadaire) pour pilotage des disponibilités.**
*   **[NOUVEAU] Vue Kanban (Suivi des statuts en temps réel).**
*   Création d'une nouvelle réservation (Nom, Tel, Nb personnes, Heure, Table).
*   Modification simple (Changement d'heure, attribution de table, changement de statut).
*   Annulation/Suppression.
*   Synchronisation bi-directionnelle avec Airtable.

### Out
*   Gestion des stocks et inventaire.
*   Gestion des plannings employés.
*   Analytiques complexes et CRM Marketing (emails, fidélité). *Ces tâches restent dans Airtable.*

## 4. Fonctionnalités Clés (CRUD & Vues)
*   **Lecture (Read)** : vue liste filtrée par date, vue Kanban par statut.
*   **Vue Calendrier (Planification)** : 
    *   **Vision Macro** : Calendrier mensuel affichant le taux d'occupation (ex: points de couleur ou jauge).
    *   **Navigation** : Changement rapide de jour par clic sur une date.
    *   **Interaction** : Drag & Drop d'une réservation pour changer sa date (avec confirmation).
*   **Création (Create)** : Formulaire "express" accessible en un clic.
*   **Mise à jour (Update)** : Modification rapide du statut (ex: cliquer sur un bouton pour marquer comme "Arrivé") ou de la table.
*   **Suppression (Delete)** : Possibilité d'annuler une réservation avec confirmation.

## 5. Contraintes d'Utilisation (UX/UI & Performance)
*   **Mobile-First / Tablet-Friendly** : Les boutons doivent être larges pour une utilisation tactile aisée.
*   **Interface sobre et sombre** : Pour ne pas éblouir le personnel ou les clients dans l'ambiance tamisée du restaurant.
*   **Performance** : Temps de réponse < 200ms pour les interactions locales.
*   **Stabilité** : Gestion robuste des pertes de connexion momentanées.

## 6. Critères d'Acceptation
*   Toute réservation créée dans le CRM doit apparaître dans Airtable en moins de 5 secondes.
*   L'équipe doit pouvoir valider l'arrivée d'un client en maximum 2 interactions tactiles.
*   Le CRM doit fonctionner parfaitement sur un iPad standard.

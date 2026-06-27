# Plan de Conception — MadaStack

## Phase 1 : Fondation (Terminée)
- [x] Initialisation du projet Vite + React + TS.
- [x] Configuration de Tailwind CSS et des polices.
- [x] Architecture des dossiers (`components`, `pages`, `hooks`, `types`, `lib`).
- [x] Création du projet Supabase et connexion (Variables d'environnement).
- [x] Définition du schéma de base de données (apps, categories) - `supabase_schema.sql`.

## Phase 2 : Développement des Pages Principales (Terminée)
- [x] Navbar et Layout global.
- [x] Page d'accueil (Home) :
  - [x] Section Hero.
  - [x] Grille d'applications (AppCard) avec design uniforme.
- [x] Page de détails d'une application (AppDetails) :
  - [x] Header avec bannière et informations de l'application.
  - [x] Bouton de téléchargement direct.
  - [x] Description complète.
  - [x] Galerie dynamique des captures d'écran (jusqu'à 5 images).

## Phase 3 : Back-Office et Authentification (Terminée)
- [x] Création d'un compte Administrateur sécurisé.
- [x] Page de connexion Administrateur (`/admin/login`).
- [x] Espace membre et Social Login (`/auth`)
- [x] Protection des routes administrateur et des actions membres.
- [x] Tableau de Bord Administrateur (`/admin/dashboard`).
- [x] Formulaire de création/édition d'application avec Upload multiple d'images (Icône, Bannière, et Captures d'écran via Supabase Storage).

## Phase 4 : Interactions Utilisateurs et Statistiques (Terminée)
- [x] Ajout des tables Supabase : commentaires, votes, visiteurs, messages (via `supabase_schema_v2.sql`).
- [x] Fonctionnalité de commentaires et notation (étoiles).
- [x] Tracking des vues et téléchargements.
- [x] Boutons J'aime / Je n'aime pas.
- [x] Formulaire de contact pour envoyer des messages à l'admin.
- [x] Mise à jour du Dashboard admin avec les statistiques journalières et classement par popularité.

## Phase 5 : Polissage et Mise en Production (En cours)
- [x] Ajout d'une barre de recherche performante avec filtrage instantané.
- [x] Optimisation UI globale (Mode sombre géré, scrollbars custom).
- [x] Déploiement en production (Vercel).
- [ ] **Refactoring Clean Architecture** : Découpage des gros composants (`AppDetails.tsx`, `Dashboard.tsx`) en sous-composants réutilisables et extraction de la logique dans de nouveaux custom hooks (`useComments`, `useStats`).
- [ ] Lier les actions de téléchargement avec une table `user_downloads` pour historique.
- [ ] Édition et suppression des applications existantes dans le Dashboard admin.
- [ ] Implémentation d'une pagination pour optimiser les performances.
- [ ] Configuration de la sécurité (Row Level Security) sur Supabase pour la production.

## Phase 6 : Fonctionnalités Avancées (Prochaines Étapes)
- [ ] **Assistant Cognitif Administrateur (IA)** : Intégration d'un module intelligent dans le dashboard pour assister la gestion de la plateforme.
- [ ] Système de messagerie temps réel avec indicateurs de lecture/écriture (style WhatsApp).

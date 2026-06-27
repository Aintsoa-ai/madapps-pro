# AintStore

**AintStore** est une plateforme professionnelle de distribution d'applications. Elle permet aux utilisateurs de découvrir, de télécharger, de noter et de commenter des applications, tout en offrant aux administrateurs un tableau de bord complet pour gérer le catalogue et analyser les statistiques.

## Fonctionnalités Principales

### Pour les Membres (Utilisateurs)
- **Catalogue d'Applications** : Liste des applications disponibles triées par catégories.
- **Détails de l'Application** : Page dédiée avec bannière, icône, description complète et galerie de captures d'écran (jusqu'à 5 images).
- **Authentification Unifiée** : Inscription par email/mot de passe ou via **Google (OAuth)**. L'authentification est requise pour interagir avec les applications.
- **Téléchargement Direct** : Les liens Google Drive sont convertis en liens de téléchargement directs.
- **Statistiques en Temps Réel** : Compteurs visibles pour les Vues (👁️) et les Téléchargements (⬇️).
- **Système de Notation (Avis)** : Les membres peuvent laisser un commentaire et attribuer une note (de 1 à 5 étoiles) à une application.
- **Votes (J'aime / Je n'aime pas)** : Système de vote unique par utilisateur pour évaluer rapidement une application.
- **Contact Admin** : Un bouton flottant permet aux membres d'envoyer des messages directs à l'administrateur de la plateforme.

### Pour l'Administrateur
- **Tableau de Bord Privé** : Espace sécurisé pour gérer les applications.
- **Gestion du Catalogue** : Ajout, modification et suppression d'applications avec upload d'images (Icône, Bannière, et jusqu'à 5 captures d'écran) directement sur le serveur.
- **Tri Intelligent** : Les applications sont automatiquement classées par popularité (nombre de téléchargements).
- **Statistiques Globales** : Suivi des visiteurs quotidiens, du total des téléchargements et gestion des messages entrants envoyés par les membres.

## Technologies Utilisées
- **Frontend** : React 19, TypeScript, Tailwind CSS, Lucide React (Icônes).
- **Backend & Base de Données** : Supabase (PostgreSQL, Authentication, Storage).
- **Architecture** : Clean Architecture, séparation des préoccupations avec Custom Hooks.

## Démarrage Rapide

1. Installez les dépendances :
   ```bash
   npm install
   ```
2. Lancez le serveur de développement (accessible sur réseau local) :
   ```bash
   npm run dev -- --host
   ```
3. L'application est disponible sur `http://localhost:5173`.

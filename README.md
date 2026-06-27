# MadaStack

**MadaStack** est une plateforme professionnelle de distribution d'applications. Elle permet aux utilisateurs de découvrir, de télécharger, de noter et de commenter des applications, tout en offrant aux administrateurs un tableau de bord complet pour gérer le catalogue et analyser les statistiques.

## Fonctionnalités Principales

### Pour les Membres (Utilisateurs)
- **Catalogue d'Applications & Recherche** : Liste triée avec une barre de recherche intelligente (Titre, description, développeur).
- **Navigation & Profil** : Menu latéral interactif donnant accès aux paramètres, aide et profil.
- **Détails de l'Application** : Page dédiée avec galerie d'images et bouton de téléchargement.
- **Authentification Unifiée** : Inscription par email/mot de passe ou via **Google et Facebook (OAuth)**.
- **Personnalisation** : Sélecteur visuel d'avatars pour le profil membre (sans surcharger la BDD).
- **Système de Notation & Votes** : Les membres peuvent laisser un commentaire, noter et voter (J'aime / Je n'aime pas).
- **Contact Admin** : Un bouton permet d'envoyer des tickets/messages de support.

### Pour l'Administrateur
- **Tableau de Bord Privé & Indicateurs** : Suivi des statistiques et des membres inscrits (avec indicateur en ligne simulé).
- **Gestion du Catalogue** : Ajout et upload d'images multiples (Storage).
- **Vision Assistant Cognitif (En cours)** : Préparation du terrain pour une IA d'assistance au tri de requêtes.

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

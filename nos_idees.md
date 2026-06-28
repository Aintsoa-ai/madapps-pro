# Nos Idées — MadaStack

## Points Forts (Ce qui marche très bien)
- Interface graphique moderne, premium et dynamique (Tailwind CSS, animations).
- Personnalisation complète des scrollbars (barres de défilement) rendues ultra-fines et "discrètes" pour un aspect professionnel.
- Possibilité d'ajouter jusqu'à 5 captures d'écran par application (Upload complet et galerie).
- Authentification unifiée et extensible (préparation pour Social Login Google/GitHub).
- Base de données robuste via Supabase avec architecture relationnelle scalable.
- Mises à jour instantanées (optimistic UI) pour les likes et compteurs.

## Faiblesses & Dette Technique (À corriger)
- **Dette Architecturale (Urgent)** : Le fichier `AppDetails.tsx` fait plus de 200 lignes et mélange logique de base de données (fetch commentaires, updates) avec l'interface. Il viole la règle #1 (Custom Hooks) et #2 (Composants modulaires). Il faut extraire `useComments`, `useAppStats` et scinder l'interface en `<CommentSection />`, `<AppBanner />`.
- Manque de pagination pour les applications sur la page d'accueil et les commentaires.
- La création de profil automatique via OAuth Google n'est pas encore sécurisée par un Trigger SQL natif.

## Ce qui a été fait (Aujourd'hui - 27 Juin 2026)
- [x] Refonte UI & Navigation : Mise en place d'un menu latéral (Sidebar) pour accéder au Profil, Mes Téléchargements, Paramètres, et Aide.
- [x] Renommage complet de la plateforme en **MadaStack**.
- [x] Accessibilité : Correction de la visibilité des textes (text-gray-900) pour contrer les modes sombres forcés sur mobile.
- [x] Optimisation de Stockage : Remplacement de l'upload d'avatar par un "Sélecteur visuel d'Avatars" (DiceBear) pour économiser la mémoire de Supabase et accélérer le chargement.
- [x] Authentification : Réintégration parfaite des boutons Google & Facebook, et résolution du bug `validation_failed` et `upsert` (`full_name`/`updated_at`).
- [x] Fonctionnalité : Ajout d'une barre de recherche professionnelle et dynamique sur la page d'accueil (Recherche par titre, développeur, description courte).
- [x] Dashboard Admin : Mise à jour de la table des membres pour afficher l'Avatar, le Pseudo, et une pastille verte "En ligne" (style Facebook/Messenger).
- [x] Déploiements Continus : Le projet a été testé, buildé (`vite build`) et déployé avec succès sur Vercel à chaque étape clé.

## Ce qui a été fait (Aujourd'hui - 28 Juin 2026)
- [x] **Refonte UI des Captures d'Écran** : Les images sur la page `AppDetails` s'affichent désormais au format portrait (ratio de téléphone) pour éviter le rognage inesthétique.
- [x] **Affichage Responsive (Style Play Store)** : Les miniatures s'adaptent selon l'appareil (petites sur mobile pour en afficher 3, plus grandes sur ordinateur).
- [x] **Navigation Carrousel** : Ajout de flèches de défilement (gauche/droite) pour naviguer facilement dans les captures d'écran sur ordinateur.
- [x] **Mode Plein Écran** : Cliquer sur une capture d'écran permet de l'afficher en plein écran avec ses vraies proportions (`object-contain`).
- [x] **Correction de Bug & Sécurité (RLS)** : Correction d'une "erreur silencieuse" lors de la publication de commentaires. Création et application des règles de sécurité Supabase (RLS) pour autoriser l'insertion de profils et de commentaires par les utilisateurs authentifiés.
- [x] **Déploiement** : Push et synchronisation en direct avec Vercel pour la mise en production immédiate.
## Ce qui reste à accomplir (Idées pour la suite)
- [ ] **Règle du Boy Scout & Clean Architecture (Urgent)** : Refactoriser `AppDetails.tsx` (plus de 430 lignes) et `Dashboard.tsx` (plus de 470 lignes) en sous-composants (`<AppBanner />`, `<CommentSection />`, `<UserList />`) AVANT d'y ajouter la moindre nouvelle fonctionnalité.
- [ ] **Intelligence Cognitive (IA)** : Intégrer la vision d'un "Assistant Cognitif IA" dans le Dashboard Administrateur pour analyser les téléchargements et pré-trier le support client.
- [ ] Mettre en place un vrai système de "debouncing" pour la barre de recherche.
- [ ] Lier la page "Mes Téléchargements" à une nouvelle table `user_downloads` pour que l'utilisateur voie ses applications.
- [ ] Ajouter la messagerie instantanée "En train d'écrire" / "Lu" (style WhatsApp) comme demandé par l'admin.

## Prompt Agent IA (Nouvelles Idées et Fonctionnalités Avancées)

Voici le prompt optimisé et structuré que vous pouvez copier-coller à votre agent IA. Il est conçu pour être direct et donner à l'IA toutes les directives techniques nécessaires pour votre environnement de développement.

---

**Agis en tant que développeur expert React (et Supabase). Tu dois intégrer de nouvelles fonctionnalités de monétisation, de gestion de rôles et d'assistance IA dans la plateforme "MadApps Pro". Voici le cahier des charges détaillé à implémenter, étape par étape :**

**1. Intégration d'un Assistant IA (Google AI Studio)**

* **Objectif :** Créer un assistant virtuel pour modérer et interagir avec la communauté en mon absence.
* **Action :** Implémente l'API Google AI Studio pour analyser les commentaires des membres. Configure un déclencheur : si l'IA détermine qu'un commentaire est "favorable", elle doit générer et publier automatiquement une réponse appropriée.

**2. Gestion des Rôles Utilisateurs**

* **Inscription :** Modifie le flux d'inscription pour obliger l'utilisateur à choisir entre deux statuts : "Visiteur" ou "Développeur".
* **Privilèges :** Le "Visiteur" ne fait que consulter. Le "Développeur" possède l'interface et les droits pour soumettre une application (en fournissant un lien d'hébergement lié à son propre Google Drive).

**3. Flux de Publication et Approbation Admin**

* **Soumission :** Lorsqu'un développeur publie une application, son statut en base de données doit être mis sur `en attente`.
* **Message de paiement :** L'interface doit afficher une instruction claire : "Veuillez contacter l'administrateur au 034 82 372 67 ou au 037 38 946 19 pour valider la publication".
* **Validation :** L'application ne devient visible par les visiteurs que lorsque l'administrateur change manuellement le statut en `publié` après confirmation du paiement.

**4. Modèle Économique et Abonnements**

* **Tarif Standard :** Le coût de base est de 10.000 Ar pour chaque application publiée.
* **Statut "Développeur Premium" :** Ajoute une gestion d'abonnement permettant de publier des APK en illimité. Les forfaits sont de 100.000 Ar pour 6 mois ou 150.000 Ar pour 1 an.

**5. Fonctionnalité de Mise en Avant ("Boost")**

* **Interface :** Ajoute un bouton "Booster l'application" dans le tableau de bord du développeur.
* **Processus de commande :** Au clic, affiche un message poli et formaté indiquant les tarifs du boost (ex: 50.000 Ar pour 7 jours) et demandant d'appeler l'administrateur pour validation et paiement.
* **Affichage Front-End :** Modifie le flux d'affichage principal. Les applications avec un paramètre `is_boosted` actif doivent apparaître obligatoirement en tête de liste dans une section "Applications en vogue".

**6. Assistant Cognitif Évolutif (IA Administrateur)**

* **Objectif :** Doter le tableau de bord administrateur d'un véritable copilote intelligent capable d'évoluer, d'analyser les tendances, de suggérer des décisions et d'automatiser les réponses aux utilisateurs.
* **Fonctionnalités clés :**
  - **Agent de Tri Cognitif :** Analyser automatiquement l'humeur/l'intention des messages reçus par les membres et rédiger des suggestions de réponses ("Réponse Proposée par IA").
  - **Apprentissage Quotidien :** L'IA mémorise les habitudes de validation de l'administrateur pour alerter automatiquement sur les "anomalies" de trafic ou de téléchargement (ex: pic soudain de téléchargement sur une app douteuse).
  - **Copilote du Périple :** Un widget persistant dans le dashboard admin permettant à l'administrateur de demander en langage naturel "Quelles sont les apps les plus populaires cette semaine ?" ou "Prépare un message groupé pour annoncer la maintenance".

**Pour commencer, fournis-moi la structure des tables Supabase mises à jour (profils, applications, abonnements) pour gérer ces nouvelles contraintes. Ensuite, donne-moi le code React pour modifier l'écran d'inscription.**

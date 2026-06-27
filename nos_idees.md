# Nos Idées — AintStore

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
- [x] Accessibilité : Correction de la visibilité des textes (text-gray-900) pour contrer les modes sombres forcés sur mobile.
- [x] Optimisation de Stockage : Remplacement de l'upload d'avatar par un "Sélecteur visuel d'Avatars" (DiceBear) pour économiser la mémoire de Supabase et accélérer le chargement.
- [x] Authentification : Réintégration parfaite des boutons Google & Facebook, et résolution du bug `validation_failed` et `upsert` (`full_name`/`updated_at`).
- [x] Fonctionnalité : Ajout d'une barre de recherche professionnelle et dynamique sur la page d'accueil (Recherche par titre, développeur, description courte).
- [x] Dashboard Admin : Mise à jour de la table des membres pour afficher l'Avatar, le Pseudo, et une pastille verte "En ligne" (style Facebook/Messenger).
- [x] Déploiements Continus : Le projet a été testé, buildé (`vite build`) et déployé avec succès sur Vercel à chaque étape clé.

## Ce qui reste à accomplir (Idées pour la suite)
- [ ] **Règle du Boy Scout & Clean Architecture (Urgent)** : Refactoriser `AppDetails.tsx` (plus de 430 lignes) et `Dashboard.tsx` (plus de 470 lignes) en sous-composants (`<AppBanner />`, `<CommentSection />`, `<UserList />`) AVANT d'y ajouter la moindre nouvelle fonctionnalité.
- [ ] **Intelligence Cognitive (IA)** : Intégrer la vision d'un "Assistant Cognitif IA" dans le Dashboard Administrateur pour analyser les téléchargements et pré-trier le support client.
- [ ] Mettre en place un vrai système de "debouncing" pour la barre de recherche.
- [ ] Lier la page "Mes Téléchargements" à une nouvelle table `user_downloads` pour que l'utilisateur voie ses applications.
- [ ] Ajouter la messagerie instantanée "En train d'écrire" / "Lu" (style WhatsApp) comme demandé par l'admin.

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

**Pour commencer, fournis-moi la structure des tables Supabase mises à jour (profils, applications, abonnements) pour gérer ces nouvelles contraintes. Ensuite, donne-moi le code React Native pour modifier l'écran d'inscription.**

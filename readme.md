# P.E.IoT — IoT Dashboard (POC)

## Contexte

Ce projet est un Proof of Concept (POC) réalisé en réponse à l’appel d’offre de l’entreprise **P.E.IoT**.  
Il vise à concevoir un dashboard IoT permettant la supervision d’un parc de capteurs domotiques, en mettant l’accent sur **l’ergonomie**, **la visualisation des données** et **l’expérience utilisateur**.

---

## Sommaire

- [Persona & UX Research](https://www.notion.so/Persona-UX-Research-2d2421028bc080a1b648cb537c8c85f2?source=copy_link)
- [Widgets & Fonctionnalités](https://www.notion.so/Widgets-Fonctionnalit-s-2d2421028bc080b2becece883c6ec5e0?source=copy_link)
- [Organisation & Planning](https://www.notion.so/Organisation-Planning-2d2421028bc080a49be7c6501418c45e?source=copy_link)

---

## Persona principal : Sylvie — Operations Manager

- Supervision d’un parc de capteurs IoT  
- Travail en open-space  
- Besoin de clarté, de priorisation et de concentration  

Le dashboard est conçu autour de ce persona afin de garantir une approche centrée utilisateur.

---

## Installation & Lancement

1.  **Pré-requis** : Node.js et MongoDB installés et lancés.
2.  **Cloner le projet** :
    ```bash
    git clone <votre-url-repo>
    cd <votre-dossier-projet>
    ```
3.  **Lancer le Back-end** :
    ```bash
    cd server
    npm install
    npm run start
    ```
    Le serveur démarre sur `http://localhost:3000`.

4.  **Lancer le Front-end** :
    ```bash
    cd web
    npm install
    npm run dev
    ```
    L'application est accessible sur `http://localhost:5173`.

---

## Fonctionnalités & Interface

L'interface repose sur un **Design System unique** mêlant **Glassmorphism** (transparence, flou) et **Neumorphism** (relief tactile) pour une expérience immersive et moderne.

### Dashboard Opérateur
-   **Graphiques Interactifs** : Visualisation des données capteurs (Température, Humidité, Pollution) avec filtres temporels.
-   **Plante Digitale** : Widget gamifié qui évolue en fonction de la résolution des incidents.
-   **Ckecklist Opérations** : Gestionnaire de tâches rapide (`MiniTodo`) pour les actions quotidiennes.
-   **Feed d'Anomalies** : Liste des alertes en temps réel avec **code couleur sémantique** (Orange = Température, Bleu = Humidité, Vert = Pollution).
-   **Météo Locale** : Ce widget devait à la base être un widget lecteur de sons d'ambiance ou de musique (se référer à la maquette Figma). Nous avons changé d'avis car nous pension qu'un widget météo contextuel basé sur la localisation serait plus en accord avec le contexte du projet.

### Page Admin
-   **Provisioning** : Création manuelle d'Opérateurs, de Capteurs et injection de Mesures de test.
-   **Explorateur de Données** : Tableau de bord CRUD pour gérer toutes les collections (Utilisateurs, Capteurs, Mesures) avec édition et suppression en ligne.

---

## Stack technique

-   **Front-end** : React 19, Tailwind CSS v4, Recharts, Lucide-react (Icônes)
-   **Back-end** : Node.js, Express, Nodemon
-   **Base de données** : MongoDB, Mongoose
-   **UX & UI** : Design System "Glass-Morphic" personnalisé (CSS pur + Tailwind)

---

## Liens utiles

- **Figma** :  
  https://www.figma.com/design/hbnfOmP071yHBXJW1BKwqt/Untitled?node-id=5-1245&t=PRyAXGiTOmcl2u9o-1

- **Notion (organisation, UX et planning)** :  
  https://www.notion.so/P-E-IoT-IoT-Dashboard-POC-2d1421028bc0800a98c4c7eadde9dd5f?pvs=21

- **Video démo** :
  https://youtu.be/PHsM4ugbu7c

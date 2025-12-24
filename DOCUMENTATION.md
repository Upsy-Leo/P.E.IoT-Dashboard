# Documentation Technique - P.E.IoT Dashboard

Cette documentation détaille l'architecture, les choix techniques et le fonctionnement des composants du projet P.E.IoT.

## 1. Architecture Globale

Le projet suit une architecture **Client-Serveur** classique :

*   **Serveur (API REST)** : Construit avec Node.js et Express. Il expose des endpoints pour gérer les utilisateurs, capteurs, mesures, alertes et tâches ("todos"). Il interagit avec une base de données MongoDB via Mongoose.
*   **Client (SPA)** : Application React (Vite) consommant l'API REST. Elle gère l'état global et l'affichage des widgets en temps réel (polling).

---

## 2. Design System & UI

L'identité visuelle est une manière de nous mettre en valeur et de nous différencier des autres. Elle combine deux tendances modernes pour créer une interface immersive "Dark Mode" :

### A. Glassmorphism (Widgets & Conteneurs)
-   **Utilisation** : Widgets principaux (`.glass-card`), modales, et superpositions.
-   **Effet** : Transparence, flou d'arrière-plan (`backdrop-filter: blur`), et bordures fines semi-transparentes pour simuler du verre dépoli.
-   **Objectif** : Créer de la profondeur et de la hiérarchie sans alourdir l'interface.

### B. Neumorphism (Boutons & Contrôles)
-   **Utilisation** : Boutons d'action, navigation (`.neumorphic-button`).
-   **Effet** : Jeux d'ombres et de lumières pour donner du relief tactile (éléments qui semblent extrudés ou enfoncés dans la matière).
-   **Objectif** : Rendre les interactions tangibles et satisfaisantes ("cliquable").

### C. Code Couleur Sémantique
-   **Orange (`#f97316`)** : Données et alertes de **Température**.
-   **Bleu (`#3b82f6`)** : Données et alertes d'**Humidité**.
-   **Vert (`#22c55e`)** : Données de **Pollution de l'air** et actions positives (résolution, succès).
-   **Rouge** : Erreurs critiques ou alertes non catégorisées.

---

## 3. Composants Clés (Widgets)

### `MeasureChart.jsx`
Gère l'affichage des courbes de données.
-   Utilise `recharts` pour le rendu graphique.
-   Permet le filtrage par **Période** (1W, 1M, 1Y...) et par **Type** (Température, Humidité...).
-   Les couleurs du graphique s'adaptent dynamiquement au type de donnée sélectionné.

### `AnomalyFeed.jsx`
Affiche le flux des dernières alertes détectées.
-   Scroll infini (ou zone déroulante).
-   Chaque alerte est une carte interactive.
-   **Mise en évidence** : Bordures et tags colorés selon le type d'alerte (sémantique).

### `DigitalPlant.jsx` (Gamification)
Représente la "santé" du système sous forme d'une plante.
-   Récupère l'XP de l'utilisateur (`/api/users/me`).
-   La plante change de forme (icône `lucide-react`) selon le niveau de l'utilisateur.
-   Barre de progression animée.

### `SensorInfo.jsx`
Panneau de détail contextuel.
-   S'affiche lors du clic sur un point de graphique ou une alerte.
-   Permet de **"Résoudre"** une alerte (appel API POST `/resolve`), ce qui donne de l'XP à l'utilisateur.

### `MiniTodo.jsx`
Une "Checklist Opérationnelle" persistante.
-   CRUD complet de tâches (ajout, suppression, toggle).
-   Stocké en base de données pour la persistance entre sessions.

---

## 4. API Backend (Routes Principales)

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/measures` | Récupère l'historique des mesures (avec filtres `type`, `period`). |
| **GET** | `/api/alerts` | Récupère les alertes non résolues. |
| **POST** | `/api/alerts/:id/resolve` | Marque une alerte comme résolue et attribue de l'XP. |
| **GET** | `/api/weather` | Récupère la météo (simulée ou API tierce). |
| **GET** | `/api/users/me` | Récupère le profil utilisateur (XP, Niveau). |
| **POST** | `/api/sensors` | Crée un nouveau capteur (Admin). |
| **POST** | `/api/measures` | Injecte une nouvelle mesure (Admin). |

---

## 5. Modèle de Données (MongoDB)

*   **User** : Opérateur du système. Possède `xp`, `level`, `location`.
*   **Sensor** : Capteur physique. Lié à un `User`. Possède `type`, `location`.
*   **Measure** : Donnée brute. Liée à un `Sensor`. Possède `value`, `type`, `timestamp`.
*   **Alert** : Anomalie détectée. Peut être liée à une `Measure` ou générée indépendamment.

---

## 6. Maintenance & Évolutions

Pour ajouter un nouveau **Widget** :
1.  Créer le composant dans `web/src/widgets/`.
2.  Lui appliquer la classe `glass-card`.
3.  L'importer dans `App.jsx` et l'ajouter à la grille CSS (`grid-cols`).

Pour modifier le **Thème** :
1.  Éditer `web/src/App.css` pour ajuster les variables CSS ou les classes utilitaires `.glass-card` / `.neumorphic-button`.

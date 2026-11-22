# CineMatch

Application web qui aide à **choisir un film à regarder**. Elle utilise l'API [TMDB](https://www.themoviedb.org/) (The Movie Database) pour afficher les films, leurs informations et leurs bandes-annonces.

Projet réalisé en **JavaScript avec React** (Vite).

---

## Fonctionnalités

### Accueil
- **Film du jour** : un grand bandeau avec l'image du film, son titre, sa note, sa durée et ses genres, et trois actions : *Voir le film*, *Bande-annonce* et ♡ *favori*. Le film change chaque jour.
- **« Surprends-moi »** : tire au hasard un film bien noté dans le genre choisi.
- **Recommandations** : deux rangées qui défilent horizontalement (*Tendances de la semaine* et *Les mieux notés*).

### Catalogue
- **Recherche** par titre.
- **Tri** : popularité, meilleure note, plus récent, plus ancien.
- **Filtres** sous forme de tags, combinables entre eux :
  - **Genre** : action, comédie, drame, horreur, science-fiction, animation…
  - **Année** : avant 1980, 1980–1999, 2000–2009, 2010–2019, 2020 et après
  - **Durée** : moins d'1h, 1h–1h30, 1h30–2h, plus de 2h
  - **Note** : ★ 5+, 6+, 7+, 8+
- Une grille de films (affiche, titre, année, note, cœur), avec un bouton *Charger plus de films*.
- Les filtres sont enregistrés dans l'URL : on les retrouve en revenant d'une fiche film.

### Fiche d'un film
- L'image de fond du film, avec son affiche par-dessus.
- Le titre, l'année, la durée, la note et les genres.
- Le synopsis et le casting.
- La bande-annonce YouTube, qui s'ouvre dans une fenêtre (fermeture par ✕, Échap ou clic à côté).

### Favoris
- Un bouton ♡ sur chaque film (cartes, fiche, film du jour, « Surprends-moi ») pour l'ajouter à ses favoris ou l'en retirer.
- Une page qui liste les films favoris.
- Une **sauvegarde dans le navigateur** : les favoris restent après un rafraîchissement.

### Connexion
- Un formulaire email et mot de passe, avec des messages d'erreur en français.
- Une fois connecté, le nom de l'utilisateur s'affiche dans la barre de navigation, et on peut se déconnecter.
- ⚠️ La connexion est **simulée** : le projet n'a pas de serveur pour vérifier les identifiants. Seuls l'email et le nom sont gardés dans le navigateur, jamais le mot de passe.

---

## Technologies

| Outil | Rôle |
|---|---|
| **React 19** | Interface |
| **Vite** | Création du projet, serveur de développement, build |
| **React Router** | Navigation entre les pages |
| **Context API + localStorage** | Favoris et session, partagés par toute l'application et sauvegardés dans le navigateur |
| **API TMDB** | Données des films (infos, affiches, casting, vidéos) |
| **CSS** (variables CSS) | Thème sombre |
| **oxlint** | Analyse du code |

---

## Installation

**Prérequis :** Node.js 20.19 ou plus récent, et une clé API TMDB.

### 1. Obtenir une clé API TMDB (gratuite)
1. Créer un compte sur [themoviedb.org](https://www.themoviedb.org/signup).
2. Aller dans **Paramètres → API** et demander une clé (usage personnel / éducatif).
3. Copier la **clé API (v3 auth)**.

### 2. Installer le projet
```bash
git clone https://github.com/EmmaDotCom/CineMatch.git
cd CineMatch
npm install
cp .env.example .env.local
```

### 3. Ajouter la clé
Ouvrir `.env.local` et y coller la clé :
```
VITE_TMDB_API_KEY=votre_cle
```
> `.env.local` est ignoré par Git : la clé n'est jamais envoyée sur GitHub.

### 4. Lancer
```bash
npm run dev
```
Puis ouvrir **http://localhost:5173**.

### Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Crée la version de production dans `dist/` |
| `npm run preview` | Affiche la version de production en local |
| `npm run lint` | Analyse le code |

---

## Organisation du code

```
src/
├── api/
│   └── tmdb.js              Toutes les requêtes à l'API TMDB
├── components/              Éléments réutilisables
│   ├── Layout.jsx           Squelette commun (navbar + page)
│   ├── Navbar.jsx
│   ├── MovieCard.jsx        Carte d'un film (affiche, titre, note, cœur)
│   ├── MovieRow.jsx         Rangée de films qui défile horizontalement
│   ├── FavoriteButton.jsx   Bouton cœur
│   ├── FeaturedMovie.jsx    Bandeau « Film du jour »
│   ├── SurpriseMe.jsx       Bloc « Surprends-moi »
│   └── TrailerModal.jsx     Fenêtre de la bande-annonce
├── context/                 Données partagées par toute l'application
│   ├── FavoritesContext.jsx + useFavorites.js
│   └── AuthContext.jsx      + useAuth.js
├── pages/                   Une page = une route
│   ├── Home.jsx             /
│   ├── Catalogue.jsx        /catalogue
│   ├── Favoris.jsx          /favoris
│   ├── Connexion.jsx        /connexion
│   ├── MovieDetail.jsx      /film/:id
│   └── NotFound.jsx         page 404
├── utils/
│   ├── catalogueFilters.js  Options de tri et de filtre → paramètres TMDB
│   └── movie.js             Recherche de la bande-annonce, format de la durée
├── App.jsx                  Liste des routes
├── main.jsx                 Point d'entrée (Router + Providers)
├── index.css                Thème : couleurs, polices
└── App.css                  Styles des pages et des composants
```

---

## Choix techniques

- **Filtres côté serveur.** Le catalogue utilise l'endpoint `/discover/movie` de TMDB, qui trie et filtre lui-même. Un nombre minimum de votes est imposé, pour éviter qu'un film noté 10/10 par deux personnes arrive en tête du classement.
- **Recherche par titre.** L'endpoint de recherche ne sait ni trier ni filtrer : ces opérations sont donc faites dans l'application, sur les résultats reçus. TMDB ne fournit pas la durée dans les résultats de recherche, donc ce filtre est désactivé pendant une recherche.
- **Filtres dans l'URL** (`useSearchParams`). Ils sont conservés quand on revient en arrière, et on peut partager le lien d'une recherche.
- **Film du jour.** Le numéro du jour sert à choisir un film parmi les tendances. Le film est donc le même toute la journée, et différent le lendemain.
- **Bandes-annonces.** On cherche d'abord une version française, sinon une version anglaise, sinon un teaser.
- **Requêtes annulées** (`AbortController`). Quand on tape vite ou qu'on change de page, les anciennes requêtes sont annulées. La recherche attend aussi 400 ms après la dernière frappe avant d'appeler l'API.

---

## Design

Thème sombre, inspiré de l'ambiance d'une salle de cinéma :

| Rôle | Couleur |
|---|---|
| Fond | `#0f0f12` |
| Cartes, champs | `#1c1c21` |
| Texte principal | `#f4f2ec` |
| Texte secondaire | `#9a988f` |
| Accent (boutons, tags actifs, cœur) | `#E24B4A` |
| Notes, « Film du jour » | `#EF9F27` |

Polices : **Bebas Neue** pour les titres (condensée, en majuscules) et **Inter** pour le texte.
Toutes les couleurs sont des variables CSS définies dans `src/index.css`.

---

## Crédits

Données et images fournies par [TMDB](https://www.themoviedb.org/).
*This product uses the TMDB API but is not endorsed or certified by TMDB.*

# Application MERN

## Structure

- `back/` : API Express et connexion MongoDB avec Mongoose
- `Front/` : interface HTML, CSS et JavaScript

## Lancement local

```bash
cd back
npm install
cp .env.example .env
npm start
```

Variables requises dans `back/.env` :

```env
MONGODB_URI=mongodb+srv://...
PORT=3000
NODE_ENV=development
```

Le frontend peut être servi avec un serveur statique :

```bash
cd Front
python3 -m http.server 5500
```

## Routes API

- `GET /api/health` : vérifie que l'API répond et indique l'état MongoDB
- `GET /api/items` : retourne les éléments
- `POST /api/items` : crée un élément avec `name` obligatoire et `description` facultative

## Déploiement

Le frontend peut être déployé sur Vercel avec `Front/` comme Root Directory.
Le backend peut être déployé séparément sur Vercel avec `back/` comme Root
Directory, ou sur Railway avec la commande `npm start`.

Les variables `MONGODB_URI`, `NODE_ENV` et `PORT` doivent être configurées
séparément dans chaque plateforme. Aucun secret ne doit être commité.

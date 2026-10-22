# Application MERN - API Express et frontend statique

Application réalisée avec :

- **Frontend** : HTML, CSS et JavaScript natif dans `Front/`
- **Backend** : Node.js, Express et Mongoose dans `back/`
- **Base de données** : MongoDB Atlas
- **Déploiement prévu** : Vercel pour le frontend et Cloudflare Pages ou Vercel pour le backend

## Liens de déploiement

Remplace les valeurs ci-dessous par les URLs réellement fournies par les plateformes :

- Frontend Vercel : `https://<frontend-vercel>.vercel.app`
- Backend Vercel : `https://<backend-vercel>.vercel.app`
- Frontend Cloudflare Pages : `https://<projet>.pages.dev`
- Backend Cloudflare : non fonctionnel actuellement, voir la section [Erreur Cloudflare](#erreur-cloudflare)
- Route de vérification backend : `https://<backend-url>/api/health`

## Structure du projet

```text
.
├── Front/
│   ├── index.html
│   ├── index.css
│   └── index.js
├── back/
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example
│   ├── .gitignore
│   └── vercel.json
├── .gitignore
└── README.md
```

## Prérequis

- Node.js 18 ou version supérieure
- npm
- Un compte MongoDB Atlas
- Git

## Installation du backend

```bash
cd back
npm install
cp .env.example .env
```

Modifier ensuite `back/.env` :

```env
MONGODB_URI=mongodb+srv://<utilisateur>:<mot_de_passe>@<cluster>/<base>?retryWrites=true&w=majority
PORT=3000
NODE_ENV=development
```

Le fichier `.env` est local et ne doit jamais être envoyé sur GitHub.

## Démarrage local

Depuis `back/` :

```bash
npm start
```

Pour le développement avec redémarrage automatique :

```bash
npm run abdelkrim
```

Le backend est alors disponible sur :

```text
http://localhost:3000
```

Servir le frontend dans un autre terminal :

```bash
cd Front
python3 -m http.server 5500
```

Ouvrir ensuite :

```text
http://localhost:5500
```

L'URL de l'API est centralisée dans `Front/index.js`. En local, elle doit
pointer vers :

```js
const API_BASE_URL = 'http://localhost:3000/api';
```

## Routes API

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/` | Confirme que l'API est démarrée |
| `GET` | `/api/health` | Vérifie l'état de l'API et de MongoDB |
| `GET` | `/api/items` | Retourne les éléments enregistrés |
| `POST` | `/api/items` | Crée un élément |

Exemple de création :

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Premier élément","description":"Élément de test"}'
```

Le champ `name` est obligatoire. Le champ `description` est facultatif.

## Configuration MongoDB Atlas

1. Créer un cluster de test dans MongoDB Atlas.
2. Créer un utilisateur dédié à cette base.
3. Créer ou sélectionner la base de test.
4. Dans **Network Access**, ajouter `0.0.0.0/0` uniquement pour cet exercice.
5. Copier l'URI MongoDB dans la variable `MONGODB_URI`.
6. Ne jamais publier cette URI avec le mot de passe.

Tester la connexion :

```bash
curl http://localhost:3000/api/health
```

Résultat attendu :

```json
{
  "status": "ok",
  "database": "connected"
}
```

## Déploiement du frontend sur Vercel

1. Importer le dépôt GitHub dans Vercel.
2. Créer un projet Vercel pour le frontend.
3. Configurer **Root Directory** avec `Front`.
4. Choisir **Other** comme framework si nécessaire.
5. Laisser les commandes de build vides, car le frontend est statique.
6. Déployer.

Avant le déploiement, remplacer dans `Front/index.js` :

```js
const API_BASE_URL = 'http://localhost:3000/api';
```

par l'URL publique du backend :

```js
const API_BASE_URL = 'https://<backend-url>/api';
```

## Déploiement du backend sur Vercel

1. Créer un deuxième projet Vercel avec le même dépôt.
2. Configurer **Root Directory** avec `back`.
3. Choisir **Other** comme framework.
4. Laisser la commande de build vide.
5. Ajouter les variables d'environnement :

```text
MONGODB_URI=<uri-mongodb-atlas>
NODE_ENV=production
```

6. Déployer.
7. Vérifier :

```text
https://<backend-vercel>.vercel.app/api/health
```

Le fichier `back/vercel.json` configure le routage de l'API.

## Déploiement du frontend sur Cloudflare Pages

Cloudflare Pages convient au frontend statique :

1. Ouvrir Cloudflare Pages.
2. Connecter le dépôt GitHub.
3. Choisir le dossier `Front` comme répertoire racine.
4. Laisser la commande de build vide.
5. Utiliser `/` comme répertoire de sortie.
6. Déployer.

Le frontend sera disponible sur une URL de type :

```text
https://<projet>.pages.dev
```

## Erreur Cloudflare

Le backend Cloudflare a retourné une erreur pendant l'installation :

```text
npm error [-w|--workspace <workspace-name> ...]
npm error aliases: clean-install, ic, install-clean, isntall-clean
Failed: error occurred while installing tools or dependencies
```

Cette erreur vient généralement du fait que Cloudflare essaie d'exécuter
`npm ci` à la racine du dépôt alors que le `package.json` et le
`package-lock.json` du backend sont dans `back/`. Le dépôt ne possède pas de
projet npm à la racine.

### Correction si Cloudflare sert uniquement le frontend

Ne pas déployer `back/` avec Cloudflare Pages. Configurer :

```text
Root directory: Front
Build command: laisser vide
Output directory: /
```

Déployer le backend séparément sur Vercel ou Railway, puis mettre son URL
publique dans `Front/index.js`.

### Correction si une plateforme exige le backend dans `back/`

Configurer le répertoire de travail ou le répertoire racine sur `back/`, puis
utiliser :

```bash
npm install
npm start
```

Ne pas lancer `npm ci` à la racine du dépôt. Si la plateforme ne permet pas de
modifier le répertoire de travail et exige un backend Cloudflare Workers, le
code Express actuel doit être adapté à l'API Workers. Un serveur Express
classique avec `app.listen()` n'est pas un Worker Cloudflare directement
compatible.

## Variables de production

Configurer séparément dans chaque plateforme :

```text
MONGODB_URI=<uri-secrete>
NODE_ENV=production
```

Le `PORT` est généralement fourni par la plateforme. En local, le code utilise
`3000` comme valeur de repli.

## Git et commits

Vérifier les fichiers ignorés et l'état du dépôt :

```bash
git status
git check-ignore -v back/.env
git log --oneline --decorate
```

Commandes de publication :

```bash
git add .
git commit -m "docs: documenter installation et deploiement"
git push origin main
```

Ne jamais commiter :

- `back/.env`
- `node_modules/`
- les mots de passe MongoDB
- les clés ou variables secrètes de déploiement

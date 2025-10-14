# CGI Reader - Code Général des Impôts Reader

Une application web moderne pour consulter le Code Général des Impôts français avec une interface inspirée de Medium.com.

## 🚀 Fonctionnalités

- **Recherche avancée** : Recherchez par numéro d'article ou mots-clés
- **Interface moderne** : Design inspiré de Medium.com avec une expérience utilisateur fluide
- **Export PDF** : Exportez les articles en PDF avec un formatage professionnel
- **Navigation intuitive** : Références cliquables et navigation fluide
- **Design responsive** : Optimisé pour tous les appareils
- **API complète** : Backend NestJS avec endpoints REST
- **Base de données** : SQLite avec support des références et tags
- **Gestion des articles** : CRUD complet pour les articles

## 🛠️ Technologies

### Backend
- **NestJS** - Framework Node.js
- **TypeORM** - ORM pour la base de données
- **SQLite** - Base de données
- **Puppeteer** - Génération de PDF
- **Swagger** - Documentation API

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS
- **Lucide React** - Icônes
- **React Markdown** - Rendu du contenu
- **Fuse.js** - Recherche floue

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation des dépendances

```bash
# Backend
npm install

# Frontend
cd frontend
npm install
```

### Configuration de la base de données

```bash
# Seeder la base de données avec les articles CGI
npm run seed
```

## 🚀 Démarrage

### Mode développement

```bash
# Terminal 1 - Backend
npm run start:dev

# Terminal 2 - Frontend
npm run frontend:dev
```

L'application sera accessible sur :
- Frontend : http://localhost:3001
- Backend API : http://localhost:3000
- Documentation API : http://localhost:3000/api

### Mode production

```bash
# Build
npm run build
npm run frontend:build

# Start
npm run start:prod
```

## 📚 API Documentation

### Endpoints principaux

#### Articles
- `GET /articles` - Liste des articles avec pagination et recherche
- `GET /articles/:id` - Détails d'un article
- `GET /articles/number/:articleNumber` - Article par numéro
- `GET /articles/:id/pdf` - Export PDF d'un article
- `POST /articles` - Créer un article
- `PATCH /articles/:id` - Modifier un article
- `DELETE /articles/:id` - Supprimer un article

#### Recherche
- `GET /articles/search?keyword=...` - Recherche par mot-clé
- `GET /articles?query=...&tag=...&page=...&limit=...` - Recherche avancée

#### Tags
- `GET /articles/tags` - Liste des tags

### Exemples d'utilisation

```bash
# Rechercher des articles
curl "http://localhost:3000/articles?query=impôt&limit=10"

# Obtenir un article par numéro
curl "http://localhost:3000/articles/number/Article%201"

# Exporter en PDF
curl "http://localhost:3000/articles/1/pdf" -o article.pdf
```

## 🗄️ Structure de la base de données

### Articles
- `id` - Identifiant unique
- `articleNumber` - Numéro de l'article (ex: "1", "9 bis")
- `title` - Titre de l'article
- `content` - Contenu de l'article
- `section` - Section du code
- `chapter` - Chapitre
- `isActive` - Statut actif/inactif
- `lastModified` - Date de dernière modification
- `modificationReason` - Raison de la modification

### Références
- `id` - Identifiant unique
- `referenceText` - Texte de la référence
- `targetArticleNumber` - Numéro d'article cible
- `referenceType` - Type de référence
- `externalUrl` - URL externe

### Tags
- `id` - Identifiant unique
- `name` - Nom du tag (ex: "IS", "TVA", "IR")
- `description` - Description du tag
- `color` - Couleur d'affichage

## 🎨 Design et UX

L'interface s'inspire de Medium.com avec :
- Typographie lisible (Georgia pour le contenu)
- Espacement généreux
- Couleurs douces et professionnelles
- Navigation intuitive
- Recherche en temps réel
- Modales pour la lecture d'articles
- Export PDF avec formatage professionnel

## 🔧 Développement

### Structure du projet

```
cgi-reader/
├── src/                    # Backend NestJS
│   ├── articles/          # Module articles
│   ├── pdf/              # Service PDF
│   ├── parser/           # Parser CGI
│   └── scripts/          # Scripts utilitaires
├── frontend/             # Frontend Next.js
│   ├── app/              # Pages et layout
│   ├── components/       # Composants React
│   ├── lib/              # Utilitaires
│   └── types/            # Types TypeScript
└── CGI-2025-FR.txt       # Fichier source CGI
```

### Ajout de nouvelles fonctionnalités

1. **Backend** : Ajoutez vos modules dans `src/`
2. **Frontend** : Créez vos composants dans `frontend/components/`
3. **Types** : Définissez les types dans `frontend/types/`
4. **API** : Documentez avec Swagger

## 📝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation API sur `/api`
- Vérifiez les logs du serveur

## 🔄 Mise à jour des données

Pour mettre à jour les articles CGI :

1. Remplacez le fichier `CGI-2025-FR.txt`
2. Relancez le seeder : `npm run seed`
3. Redémarrez l'application

---

Développé avec ❤️ pour faciliter l'accès au Code Général des Impôts français.
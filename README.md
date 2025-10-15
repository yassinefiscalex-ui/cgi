# 🇲🇦 CGI Reader - Interface Legifrance

**Code Général des Impôts Marocain** - Interface de consultation en ligne inspirée de Legifrance

## 🎯 Description

CGI Reader est une application web moderne qui permet de consulter facilement le Code Général des Impôts marocain. L'interface est inspirée de Legifrance avec une navigation intuitive, une recherche avancée et des fonctionnalités d'export PDF.

## ✨ Fonctionnalités

### 🔍 **Recherche Avancée**
- Recherche en temps réel avec suggestions
- Filtrage par année, type de référence
- Tri par numéro d'article, titre ou date
- Historique des recherches

### 📚 **Navigation Hiérarchique**
- Structure par Livres, Titres, Chapitres et Sections
- Navigation fluide entre les articles
- Articles similaires et références croisées

### 📄 **Consultation des Articles**
- Interface de lecture optimisée
- Affichage des références législatives
- Export PDF professionnel
- Fonction d'impression

### 📊 **Statistiques**
- Nombre total d'articles
- Répartition par année
- Comptage des références

## 🛠️ Technologies Utilisées

- **Backend**: Express.js, Node.js
- **Frontend**: EJS, HTML5, CSS3, JavaScript
- **Base de données**: JSON (cgi_2025.json)
- **PDF**: Puppeteer
- **Styling**: CSS personnalisé inspiré de Legifrance

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 14 ou supérieure)
- npm (généralement inclus avec Node.js)

### Installation Rapide
```bash
# Cloner le repository
git clone https://github.com/yassinefiscalex-ui/cgi.git
cd cgi/cgi-reader-legifrance

# Installer les dépendances
npm install

# Démarrer l'application
./start.sh
```

### Installation Manuelle
```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Ou démarrer en mode production
npm start
```

## 🌐 Accès à l'Application

Une fois démarrée, l'application est accessible sur :
- **Interface Web**: http://localhost:3000
- **API REST**: http://localhost:3000/api

## 📁 Structure du Projet

```
cgi-reader-legifrance/
├── src/
│   ├── controllers/     # Contrôleurs Express
│   ├── services/        # Services métier
│   ├── routes/          # Routes API
│   ├── middleware/      # Middleware Express
│   └── app.js          # Point d'entrée principal
├── views/              # Templates EJS
├── public/             # Fichiers statiques
│   ├── css/           # Styles CSS
│   ├── js/            # JavaScript
│   └── images/        # Images et logos
├── cgi_2025.json      # Base de données JSON
├── package.json       # Dépendances npm
└── start.sh          # Script de démarrage
```

## 🔧 Configuration

### Variables d'Environnement
```bash
PORT=3000                    # Port du serveur
NODE_ENV=development         # Environnement (development/production)
```

### Personnalisation
- **Couleurs**: Modifier `/public/css/legifrance-style.css`
- **Logo**: Remplacer `/public/images/logo-maroc.svg`
- **Données**: Modifier `cgi_2025.json`

## 📖 API Endpoints

### Articles
- `GET /api/articles` - Liste des articles avec filtres
- `GET /api/articles/:id` - Détail d'un article
- `GET /api/articles/:id/pdf` - Export PDF d'un article

### Recherche
- `GET /api/search` - Recherche globale
- `GET /api/search/suggestions` - Suggestions de recherche
- `GET /api/search/stats` - Statistiques de recherche

## 🎨 Interface Utilisateur

### Page d'Accueil
- Présentation du Code Général des Impôts
- Statistiques générales
- Recherche rapide
- Articles récents

### Liste des Articles
- Filtres avancés
- Pagination
- Tri personnalisable
- Actions rapides (lire, PDF)

### Détail d'un Article
- Contenu complet
- Références législatives
- Articles similaires
- Export PDF/Impression

### Structure Hiérarchique
- Navigation par Livres/Titres/Chapitres/Sections
- Articles organisés par structure
- Liens directs vers les articles

## 🔍 Fonctionnalités de Recherche

### Recherche Textuelle
- Recherche dans le contenu des articles
- Recherche par numéro d'article
- Recherche par titre
- Suggestions en temps réel

### Filtres Avancés
- Filtrage par année
- Filtrage par type de référence
- Tri par différents critères
- Pagination des résultats

## 📱 Responsive Design

L'interface s'adapte automatiquement à tous les écrans :
- **Mobile** (< 600px)
- **Tablette** (600px - 768px)
- **Desktop** (> 768px)

## 🖨️ Export et Impression

### Export PDF
- Formatage professionnel
- En-têtes et pieds de page
- Références incluses
- Téléchargement direct

### Impression
- Styles optimisés pour l'impression
- Masquage des éléments non nécessaires
- Formatage adapté au papier

## 🔒 Sécurité

- Protection contre les attaques XSS
- Limitation du taux de requêtes
- Validation des entrées utilisateur
- Headers de sécurité

## 📊 Performance

- Compression gzip
- Mise en cache des données
- Chargement asynchrone
- Optimisation des images

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

## 🏛️ À Propos

Développé pour le **Ministère de l'Économie et des Finances** du Royaume du Maroc.

---

**Version**: 1.0.0  
**Dernière mise à jour**: 2025  
**Auteur**: Équipe CGI Reader
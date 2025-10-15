const express = require('express');
const articleController = require('../controllers/articleController');
const searchController = require('../controllers/searchController');

const router = express.Router();

// Page d'accueil
router.get('/', articleController.getHomePage);

// Pages des articles
router.get('/articles', articleController.getArticlesList);
router.get('/articles/:id', articleController.getArticleDetail);
router.get('/articles/:id/pdf', articleController.exportArticlePDF);

// Structure hiérarchique
router.get('/hierarchy', articleController.getHierarchicalStructure);

// Page de recherche
router.get('/search', searchController.getSearchPage);

// API Routes
router.get('/api/articles/:id', articleController.getArticleAPI);
router.get('/api/articles', articleController.searchArticlesAPI);
router.get('/api/search/suggestions', searchController.searchWithSuggestions);
router.get('/api/search', searchController.globalSearch);
router.get('/api/search/stats', searchController.getSearchStats);
router.get('/api/popular', searchController.getPopularArticles);

module.exports = router;
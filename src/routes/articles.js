const express = require('express');
const articleController = require('../controllers/articleController');

const router = express.Router();

// Routes pour les articles
router.get('/', articleController.searchArticlesAPI);
router.get('/:id', articleController.getArticleAPI);
router.get('/:id/pdf', articleController.exportArticlePDF);

module.exports = router;
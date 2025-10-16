const express = require('express');
const searchController = require('../controllers/searchController');

const router = express.Router();

// Routes de recherche
router.get('/suggestions', searchController.searchWithSuggestions);
router.get('/', searchController.globalSearch);

module.exports = router;
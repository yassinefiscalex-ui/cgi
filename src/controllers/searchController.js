const dataService = require('../services/dataService');

class SearchController {
  // Page de recherche avancée
  async getSearchPage(req, res) {
    try {
      const stats = await dataService.getStatistics();
      
      res.render('search', {
        title: 'Recherche Avancée',
        stats,
        years: stats.years
      });
    } catch (error) {
      console.error('Erreur page recherche:', error);
      res.status(500).render('error', {
        title: 'Erreur',
        message: 'Erreur lors du chargement de la page de recherche'
      });
    }
  }

  // API - Recherche avec suggestions
  async searchWithSuggestions(req, res) {
    try {
      const { q: query, limit = 10 } = req.query;
      
      if (!query || query.length < 2) {
        return res.json({ suggestions: [] });
      }

      const results = await dataService.searchArticles(query, { 
        limit: parseInt(limit),
        sortBy: 'id',
        sortOrder: 'asc'
      });

      const suggestions = results.articles.map(article => ({
        id: article.id,
        numero: article.numero_article,
        titre: article.titre,
        annee: article.annee,
        preview: article.content ? article.content.substring(0, 150) + '...' : ''
      }));

      res.json({ suggestions });
    } catch (error) {
      console.error('Erreur suggestions:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // API - Recherche globale
  async globalSearch(req, res) {
    try {
      const { 
        q: query, 
        page = 1, 
        limit = 20, 
        sortBy = 'id', 
        sortOrder = 'asc',
        annee,
        typeReference
      } = req.query;

      if (!query || query.length < 2) {
        return res.json({ 
          articles: [], 
          total: 0, 
          page: 1, 
          limit: 20, 
          totalPages: 0 
        });
      }

      const filters = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        annee: annee ? parseInt(annee) : undefined,
        typeReference
      };

      const results = await dataService.searchArticles(query, filters);
      res.json(results);
    } catch (error) {
      console.error('Erreur recherche globale:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }


}

module.exports = new SearchController();
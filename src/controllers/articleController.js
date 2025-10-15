const dataService = require('../services/dataService');
const puppeteer = require('puppeteer');

class ArticleController {
  // Page d'accueil
  async getHomePage(req, res) {
    try {
      const stats = await dataService.getStatistics();
      const recentArticles = await dataService.searchArticles('', { 
        sortBy: 'id', 
        sortOrder: 'desc', 
        limit: 6 
      });
      
      res.render('index', {
        title: 'Code Général des Impôts - Maroc',
        stats,
        recentArticles: recentArticles.articles,
        currentYear: new Date().getFullYear()
      });
    } catch (error) {
      console.error('Erreur page d\'accueil:', error);
      res.status(500).render('error', {
        title: 'Erreur',
        message: 'Erreur lors du chargement de la page d\'accueil'
      });
    }
  }

  // Liste des articles
  async getArticlesList(req, res) {
    try {
      const { 
        query = '', 
        page = 1, 
        limit = 20, 
        sortBy = 'id', 
        sortOrder = 'asc',
        annee,
        typeReference
      } = req.query;

      const filters = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        annee: annee ? parseInt(annee) : undefined,
        typeReference
      };

      const results = await dataService.searchArticles(query, filters);
      const stats = await dataService.getStatistics();

      res.render('articles/list', {
        title: 'Liste des Articles',
        articles: results.articles,
        pagination: {
          currentPage: results.page,
          totalPages: results.totalPages,
          total: results.total,
          limit: results.limit
        },
        filters: {
          query,
          sortBy,
          sortOrder,
          annee,
          typeReference
        },
        stats,
        years: stats.years
      });
    } catch (error) {
      console.error('Erreur liste articles:', error);
      res.status(500).render('error', {
        title: 'Erreur',
        message: 'Erreur lors du chargement de la liste des articles'
      });
    }
  }

  // Détail d'un article
  async getArticleDetail(req, res) {
    try {
      const { id } = req.params;
      const article = await dataService.getArticleById(id);
      
      if (!article) {
        return res.status(404).render('error', {
          title: 'Article non trouvé',
          message: 'L\'article demandé n\'a pas été trouvé'
        });
      }

      const relatedArticles = await dataService.getRelatedArticles(id, 5);
      const stats = await dataService.getStatistics();

      res.render('articles/detail', {
        title: `${article.numero_article} - ${article.titre}`,
        article,
        relatedArticles,
        stats,
        currentYear: new Date().getFullYear()
      });
    } catch (error) {
      console.error('Erreur détail article:', error);
      res.status(500).render('error', {
        title: 'Erreur',
        message: 'Erreur lors du chargement de l\'article'
      });
    }
  }

  // Structure hiérarchique
  async getHierarchicalStructure(req, res) {
    try {
      const structure = await dataService.getHierarchicalStructure();
      const stats = await dataService.getStatistics();

      res.render('hierarchy', {
        title: 'Structure du Code',
        structure,
        stats
      });
    } catch (error) {
      console.error('Erreur structure hiérarchique:', error);
      res.status(500).render('error', {
        title: 'Erreur',
        message: 'Erreur lors du chargement de la structure'
      });
    }
  }

  // Export PDF d'un article
  async exportArticlePDF(req, res) {
    try {
      const { id } = req.params;
      const article = await dataService.getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      
      // HTML pour le PDF
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${article.numero_article} - ${article.titre}</title>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              line-height: 1.6;
              margin: 40px;
              color: #333;
            }
            .header {
              border-bottom: 2px solid #2c5aa0;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .article-number {
              font-size: 24px;
              font-weight: bold;
              color: #2c5aa0;
              margin-bottom: 10px;
            }
            .article-title {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .content {
              font-size: 14px;
              text-align: justify;
              white-space: pre-line;
            }
            .references {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
            .reference {
              margin-bottom: 10px;
              font-size: 12px;
              color: #666;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="article-number">${article.numero_article}</div>
            <div class="article-title">${article.titre}</div>
          </div>
          
          <div class="content">${article.content}</div>
          
          ${article.references && article.references.length > 0 ? `
            <div class="references">
              <h3>Références :</h3>
              ${article.references.map(ref => `
                <div class="reference">${ref.texte}</div>
              `).join('')}
            </div>
          ` : ''}
          
          <div class="footer">
            <p>Code Général des Impôts - Maroc ${article.annee}</p>
            <p>Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </body>
        </html>
      `;

      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        }
      });

      await browser.close();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="article-${article.numero_article.replace(/\s+/g, '-')}.pdf"`);
      res.send(pdf);

    } catch (error) {
      console.error('Erreur export PDF:', error);
      res.status(500).json({ error: 'Erreur lors de la génération du PDF' });
    }
  }

  // API - Obtenir un article
  async getArticleAPI(req, res) {
    try {
      const { id } = req.params;
      const article = await dataService.getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      res.json(article);
    } catch (error) {
      console.error('Erreur API article:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // API - Recherche d'articles
  async searchArticlesAPI(req, res) {
    try {
      const { 
        query = '', 
        page = 1, 
        limit = 20, 
        sortBy = 'id', 
        sortOrder = 'asc',
        annee,
        typeReference
      } = req.query;

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
      console.error('Erreur API recherche:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

module.exports = new ArticleController();
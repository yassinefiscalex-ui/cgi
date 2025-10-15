const fs = require('fs').promises;
const path = require('path');

class DataService {
  constructor() {
    this.data = null;
    this.dataPath = path.join(__dirname, '../../cgi_2025.json');
    this.hierarchicalStructure = null;
  }

  async loadData() {
    try {
      if (!this.data) {
        const fileContent = await fs.readFile(this.dataPath, 'utf8');
        this.data = JSON.parse(fileContent);
        this.buildHierarchicalStructure();
        console.log(`✅ ${this.data.length} articles chargés depuis cgi_2025.json`);
      }
      return this.data;
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      throw error;
    }
  }

  buildHierarchicalStructure() {
    if (!this.data) return;

    this.hierarchicalStructure = {
      livres: {},
      titres: {},
      chapitres: {},
      sections: {}
    };

    this.data.forEach(article => {
      // Extraire les informations hiérarchiques du contenu
      const content = article.content || '';
      
      // Détecter les livres
      const livreMatch = content.match(/LIVRE\s+([IVX]+)[\s\-]+(.+?)(?=\n|$)/i);
      if (livreMatch) {
        const livreKey = livreMatch[1];
        if (!this.hierarchicalStructure.livres[livreKey]) {
          this.hierarchicalStructure.livres[livreKey] = {
            numero: livreKey,
            titre: livreMatch[2].trim(),
            articles: []
          };
        }
        this.hierarchicalStructure.livres[livreKey].articles.push(article);
      }

      // Détecter les titres
      const titreMatch = content.match(/TITRE\s+([IVX]+)[\s\-]+(.+?)(?=\n|$)/i);
      if (titreMatch) {
        const titreKey = titreMatch[1];
        if (!this.hierarchicalStructure.titres[titreKey]) {
          this.hierarchicalStructure.titres[titreKey] = {
            numero: titreKey,
            titre: titreMatch[2].trim(),
            articles: []
          };
        }
        this.hierarchicalStructure.titres[titreKey].articles.push(article);
      }

      // Détecter les chapitres
      const chapitreMatch = content.match(/CHAPITRE\s+([IVX]+)[\s\-]+(.+?)(?=\n|$)/i);
      if (chapitreMatch) {
        const chapitreKey = chapitreMatch[1];
        if (!this.hierarchicalStructure.chapitres[chapitreKey]) {
          this.hierarchicalStructure.chapitres[chapitreKey] = {
            numero: chapitreKey,
            titre: chapitreMatch[2].trim(),
            articles: []
          };
        }
        this.hierarchicalStructure.chapitres[chapitreKey].articles.push(article);
      }

      // Détecter les sections
      const sectionMatch = content.match(/SECTION\s+([IVX]+)[\s\-]+(.+?)(?=\n|$)/i);
      if (sectionMatch) {
        const sectionKey = sectionMatch[1];
        if (!this.hierarchicalStructure.sections[sectionKey]) {
          this.hierarchicalStructure.sections[sectionKey] = {
            numero: sectionKey,
            titre: sectionMatch[2].trim(),
            articles: []
          };
        }
        this.hierarchicalStructure.sections[sectionKey].articles.push(article);
      }
    });
  }

  async getAllArticles() {
    await this.loadData();
    return this.data;
  }

  async getArticleById(id) {
    await this.loadData();
    return this.data.find(article => article.id === parseInt(id));
  }

  async getArticleByNumber(numero) {
    await this.loadData();
    return this.data.find(article => 
      article.numero_article && 
      article.numero_article.toLowerCase().includes(numero.toLowerCase())
    );
  }

  async searchArticles(query, filters = {}) {
    await this.loadData();
    
    let results = this.data;

    // Filtrage par texte
    if (query) {
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
      results = results.filter(article => {
        const searchableText = [
          article.numero_article || '',
          article.titre || '',
          article.content || ''
        ].join(' ').toLowerCase();

        return searchTerms.every(term => searchableText.includes(term));
      });
    }

    // Filtrage par année
    if (filters.annee) {
      results = results.filter(article => article.annee === parseInt(filters.annee));
    }

    // Filtrage par type de référence
    if (filters.typeReference) {
      results = results.filter(article => 
        article.references && 
        article.references.some(ref => 
          ref.texte && ref.texte.toLowerCase().includes(filters.typeReference.toLowerCase())
        )
      );
    }

    // Tri
    const sortBy = filters.sortBy || 'id';
    const sortOrder = filters.sortOrder || 'asc';
    
    results.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1;
      } else {
        return aVal > bVal ? 1 : -1;
      }
    });

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      articles: results.slice(startIndex, endIndex),
      total: results.length,
      page,
      limit,
      totalPages: Math.ceil(results.length / limit)
    };
  }

  async getHierarchicalStructure() {
    await this.loadData();
    return this.hierarchicalStructure;
  }

  async getStatistics() {
    await this.loadData();
    
    const stats = {
      totalArticles: this.data.length,
      years: [...new Set(this.data.map(a => a.annee))].sort(),
      totalReferences: this.data.reduce((sum, article) => 
        sum + (article.references ? article.references.length : 0), 0
      ),
      articlesWithReferences: this.data.filter(a => a.references && a.references.length > 0).length
    };

    return stats;
  }

  async getRelatedArticles(articleId, limit = 5) {
    await this.loadData();
    
    const article = await this.getArticleById(articleId);
    if (!article) return [];

    // Trouver des articles similaires basés sur les mots-clés du titre
    const titleWords = (article.titre || '').toLowerCase().split(/\s+/).filter(word => word.length > 3);
    
    const related = this.data
      .filter(a => a.id !== articleId)
      .map(a => {
        const score = titleWords.reduce((acc, word) => {
          const content = (a.titre || '').toLowerCase();
          return acc + (content.includes(word) ? 1 : 0);
        }, 0);
        return { ...a, score };
      })
      .filter(a => a.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return related;
  }
}

module.exports = new DataService();
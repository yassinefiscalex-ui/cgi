'use client';

import { useState, useEffect } from 'react';
import { Search, FileText, Download, Tag, Calendar } from 'lucide-react';
import { Article } from '@/types/article';
import { SearchModal } from '@/components/SearchModal';
import { ArticleCard } from '@/components/ArticleCard';
import { ArticleModal } from '@/components/ArticleModal';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/articles?limit=20');
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/articles?query=${encodeURIComponent(query)}&limit=20`);
      setArticles(response.data.articles);
      setSearchQuery(query);
    } catch (error) {
      console.error('Error searching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleDownloadPdf = async (article: Article) => {
    try {
      const response = await api.get(`/articles/${article.id}/pdf`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `article-${article.articleNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearchClick={() => setSearchModalOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Code Général des Impôts
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Consultez facilement les articles du CGI avec une interface moderne et intuitive. 
            Recherchez, lisez et exportez en PDF.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="btn btn-primary text-lg px-8 py-3"
            >
              <Search className="w-5 h-5 mr-2" />
              Rechercher un article
            </button>
            <button
              onClick={loadArticles}
              className="btn btn-secondary text-lg px-8 py-3"
            >
              <FileText className="w-5 h-5 mr-2" />
              Voir tous les articles
            </button>
          </div>
        </div>

        {/* Search Results Header */}
        {searchQuery && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Résultats pour "{searchQuery}"
            </h2>
            <p className="text-gray-600">
              {articles.length} article{articles.length !== 1 ? 's' : ''} trouvé{articles.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={() => handleArticleClick(article)}
                onDownloadPdf={() => handleDownloadPdf(article)}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && articles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun article trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez avec d'autres mots-clés ou consultez tous les articles.
            </p>
            <button
              onClick={() => setSearchModalOpen(true)}
              className="btn btn-primary"
            >
              <Search className="w-4 h-4 mr-2" />
              Nouvelle recherche
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Modals */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSearch={handleSearch}
      />

      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          isOpen={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onDownloadPdf={() => handleDownloadPdf(selectedArticle)}
        />
      )}
    </div>
  );
}
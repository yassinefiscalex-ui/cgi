'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText, Download, Tag, Calendar, SortAsc, SortDesc } from 'lucide-react';
import { Article } from '@/types/article';
import { SearchModal } from '@/components/SearchModal';
import { ArticleCard } from '@/components/ArticleCard';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';

export default function Home() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'articleNumber' | 'title' | 'createdAt'>('articleNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const itemsPerPage = 12;

  useEffect(() => {
    loadArticles();
    loadTags();
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery || selectedTag || sortBy || sortOrder) {
      loadArticles();
    }
  }, [debouncedSearchQuery, selectedTag, sortBy, sortOrder, currentPage]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sortBy,
        sortOrder,
      });
      
      if (debouncedSearchQuery) {
        params.append('query', debouncedSearchQuery);
      }
      
      if (selectedTag) {
        params.append('tag', selectedTag);
      }
      
      const response = await api.get(`/articles?${params.toString()}`);
      setArticles(response.data.articles);
      setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      setTotalArticles(response.data.total);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const response = await api.get('/articles/tags');
      setAvailableTags(response.data);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleArticleClick = (article: Article) => {
    router.push(`/article/${article.id}`);
  };

  const handleSort = (field: 'articleNumber' | 'title' | 'createdAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleTagFilter = (tagName: string) => {
    setSelectedTag(selectedTag === tagName ? '' : tagName);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag('');
    setSortBy('articleNumber');
    setSortOrder('asc');
    setCurrentPage(1);
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
              onClick={clearFilters}
              className="btn btn-secondary text-lg px-8 py-3"
            >
              <FileText className="w-5 h-5 mr-2" />
              Voir tous les articles
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Rechercher par numéro d'article ou mots-clés..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Sort Controls */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleSort('articleNumber')}
                  className={`btn ${sortBy === 'articleNumber' ? 'btn-primary' : 'btn-secondary'} flex items-center`}
                >
                  Article
                  {sortBy === 'articleNumber' && (
                    sortOrder === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />
                  )}
                </button>
                <button
                  onClick={() => handleSort('title')}
                  className={`btn ${sortBy === 'title' ? 'btn-primary' : 'btn-secondary'} flex items-center`}
                >
                  Titre
                  {sortBy === 'title' && (
                    sortOrder === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />
                  )}
                </button>
              </div>
            </div>

            {/* Tags Filter */}
            {availableTags.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-700 mr-2">Filtrer par tag:</span>
                  {availableTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagFilter(tag.name)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedTag === tag.name
                          ? 'bg-primary-100 text-primary-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {searchQuery ? `Résultats pour "${searchQuery}"` : 'Articles'}
              </h2>
              <p className="text-gray-600 mt-1">
                {totalArticles} article{totalArticles !== 1 ? 's' : ''} trouvé{totalArticles !== 1 ? 's' : ''}
                {selectedTag && ` • Filtré par: ${selectedTag}`}
              </p>
            </div>
            
            {totalPages > 1 && (
              <div className="mt-4 sm:mt-0">
                <span className="text-sm text-gray-500">
                  Page {currentPage} sur {totalPages}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(itemsPerPage)].map((_, i) => (
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
          <>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    const isActive = page === currentPage;
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </nav>
              </div>
            )}
          </>
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
              onClick={clearFilters}
              className="btn btn-primary"
            >
              <Search className="w-4 h-4 mr-2" />
              Nouvelle recherche
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSearch={handleSearch}
      />
    </div>
  );
}
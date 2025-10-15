'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Tag, Calendar, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Article } from '@/types/article';
import { api } from '@/lib/api';
import { ReferenceModal } from '@/components/ReferenceModal';
import 'highlight.js/styles/github.css';

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedReference, setSelectedReference] = useState<any>(null);

  useEffect(() => {
    if (params.id) {
      loadArticle(params.id as string);
    }
  }, [params.id]);

  const loadArticle = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/articles/${id}`);
      setArticle(response.data);
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!article) return;
    
    setIsDownloading(true);
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
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReferenceClick = (reference: any) => {
    setSelectedReference(reference);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
          <button
            onClick={() => router.push('/')}
            className="btn btn-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="btn btn-secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? 'Téléchargement...' : 'PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Article Header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center mb-4">
              <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                Article {article.articleNumber}
              </span>
              {article.lastModified && (
                <span className="text-xs text-gray-500 ml-4 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Modifié le {formatDate(article.lastModified)}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            {(article.section || article.chapter) && (
              <div className="text-sm text-gray-600 mb-4">
                {article.section && <span>Section: {article.section}</span>}
                {article.section && article.chapter && <span className="mx-2">•</span>}
                {article.chapter && <span>Chapitre: {article.chapter}</span>}
              </div>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Article Body */}
          <div className="px-6 py-8">
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 mt-6">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-700">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      {children}
                    </pre>
                  ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* References */}
          {article.references && article.references.length > 0 && (
            <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Références
              </h3>
              <div className="space-y-3">
                {article.references.map((reference, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        {reference.referenceText}
                      </p>
                      {reference.referenceType && (
                        <span className="text-xs text-gray-500">
                          Type: {reference.referenceType}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleReferenceClick(reference)}
                      className="text-primary-600 hover:text-primary-700 p-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Article {article.articleNumber} • Code Général des Impôts</span>
              <span>Généré le {new Date().toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </article>
      </div>

      {/* Reference Modal */}
      {selectedReference && (
        <ReferenceModal
          reference={selectedReference}
          isOpen={!!selectedReference}
          onClose={() => setSelectedReference(null)}
        />
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { X, Download, Tag, Calendar, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Article } from '@/types/article';
import 'highlight.js/styles/github.css';

interface ArticleModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
  onDownloadPdf: () => void;
}

export function ArticleModal({ article, isOpen, onClose, onDownloadPdf }: ArticleModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await onDownloadPdf();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReferenceClick = (reference: any) => {
    if (reference.targetArticleNumber) {
      // In a real app, you would navigate to the target article
      console.log('Navigate to article:', reference.targetArticleNumber);
    } else if (reference.externalUrl) {
      window.open(reference.externalUrl, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
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
                <h2 className="text-2xl font-bold text-gray-900">
                  {article.title}
                </h2>
                {(article.section || article.chapter) && (
                  <div className="text-sm text-gray-600 mt-2">
                    {article.section && <span>Section: {article.section}</span>}
                    {article.section && article.chapter && <span className="mx-2">•</span>}
                    {article.chapter && <span>Chapitre: {article.chapter}</span>}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isDownloading}
                  className="btn btn-secondary text-sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  {isDownloading ? 'Téléchargement...' : 'PDF'}
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
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

          {/* Content */}
          <div className="bg-white px-6 py-6 max-h-96 overflow-y-auto">
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
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Références
              </h3>
              <div className="space-y-2">
                {article.references.map((reference, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 p-3 bg-white rounded-lg border border-gray-200"
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
                    {(reference.targetArticleNumber || reference.externalUrl) && (
                      <button
                        onClick={() => handleReferenceClick(reference)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Article {article.articleNumber} • Code Général des Impôts
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="btn btn-ghost text-sm"
              >
                Fermer
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="btn btn-primary text-sm"
              >
                <Download className="w-4 h-4 mr-1" />
                {isDownloading ? 'Téléchargement...' : 'Télécharger PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
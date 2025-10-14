'use client';

import { FileText, Download, Tag, Calendar } from 'lucide-react';
import { Article } from '@/types/article';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
  onDownloadPdf: () => void;
}

export function ArticleCard({ article, onClick, onDownloadPdf }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="card p-6 hover:shadow-md transition-shadow cursor-pointer group">
      <div onClick={onClick}>
        {/* Article Number */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
            Article {article.articleNumber}
          </span>
          {article.lastModified && (
            <span className="text-xs text-gray-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(article.lastModified)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
          {article.title}
        </h3>

        {/* Content Preview */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {truncateContent(article.content)}
        </p>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag.name}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{article.tags.length - 3} autres
              </span>
            )}
          </div>
        )}

        {/* Section/Chapter */}
        {(article.section || article.chapter) && (
          <div className="text-xs text-gray-500 mb-4">
            {article.section && <span>Section: {article.section}</span>}
            {article.section && article.chapter && <span className="mx-2">•</span>}
            {article.chapter && <span>Chapitre: {article.chapter}</span>}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={onClick}
          className="flex items-center text-sm text-primary-600 hover:text-primary-700 transition-colors"
        >
          <FileText className="w-4 h-4 mr-1" />
          Lire l'article
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownloadPdf();
          }}
          className="flex items-center text-sm text-gray-600 hover:text-gray-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-1" />
          PDF
        </button>
      </div>
    </div>
  );
}
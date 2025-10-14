import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Article } from '../articles/entities/article.entity';

@Injectable()
export class PdfService {
  async generateArticlePdf(article: Article): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      
      const html = this.generateArticleHtml(article);
      
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
      });

      return pdf;
    } finally {
      await browser.close();
    }
  }

  private generateArticleHtml(article: Article): string {
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${article.title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #fff;
          }
          
          .article-header {
            border-bottom: 1px solid #e5e5e5;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .article-number {
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
          }
          
          .article-title {
            font-size: 32px;
            font-weight: 700;
            line-height: 1.2;
            color: #000;
            margin-bottom: 15px;
          }
          
          .article-meta {
            display: flex;
            gap: 20px;
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
          }
          
          .tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 20px;
          }
          
          .tag {
            background: #f0f0f0;
            color: #333;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
          }
          
          .article-content {
            font-size: 18px;
            line-height: 1.8;
            color: #333;
          }
          
          .article-content h1,
          .article-content h2,
          .article-content h3 {
            margin: 30px 0 15px 0;
            font-weight: 700;
            color: #000;
          }
          
          .article-content h1 {
            font-size: 28px;
          }
          
          .article-content h2 {
            font-size: 24px;
          }
          
          .article-content h3 {
            font-size: 20px;
          }
          
          .article-content p {
            margin-bottom: 20px;
          }
          
          .article-content ul,
          .article-content ol {
            margin: 20px 0;
            padding-left: 30px;
          }
          
          .article-content li {
            margin-bottom: 8px;
          }
          
          .article-content blockquote {
            border-left: 4px solid #e5e5e5;
            padding-left: 20px;
            margin: 20px 0;
            font-style: italic;
            color: #666;
          }
          
          .references {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
          }
          
          .references h3 {
            font-size: 18px;
            margin-bottom: 15px;
            color: #666;
          }
          
          .reference {
            margin-bottom: 8px;
            font-size: 14px;
            color: #666;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
            font-size: 12px;
            color: #999;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="article-header">
          <div class="article-number">Article ${article.articleNumber}</div>
          <h1 class="article-title">${article.title}</h1>
          <div class="article-meta">
            ${article.section ? `<span>Section: ${article.section}</span>` : ''}
            ${article.chapter ? `<span>Chapitre: ${article.chapter}</span>` : ''}
            ${article.lastModified ? `<span>Dernière modification: ${new Date(article.lastModified).toLocaleDateString('fr-FR')}</span>` : ''}
          </div>
          ${article.tags && article.tags.length > 0 ? `
            <div class="tags">
              ${article.tags.map(tag => `<span class="tag">${tag.name}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        
        <div class="article-content">
          ${this.formatContent(article.content)}
        </div>
        
        ${article.references && article.references.length > 0 ? `
          <div class="references">
            <h3>Références</h3>
            ${article.references.map(ref => `<div class="reference">${ref.referenceText}</div>`).join('')}
          </div>
        ` : ''}
        
        <div class="footer">
          <p>Code Général des Impôts - Article ${article.articleNumber}</p>
          <p>Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
        </div>
      </body>
      </html>
    `;
  }

  private formatContent(content: string): string {
    // Basic formatting for the content
    return content
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      .replace(/<p><\/p>/g, '');
  }
}
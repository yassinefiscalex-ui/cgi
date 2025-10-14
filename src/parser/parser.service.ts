import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../articles/entities/article.entity';
import { Tag } from '../articles/entities/tag.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ParserService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async parseCgiFile(filePath: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const articles = this.parseContent(content);
      
      // Create default tags
      await this.createDefaultTags();
      
      // Save articles to database
      for (const articleData of articles) {
        const existingArticle = await this.articlesRepository.findOne({
          where: { articleNumber: articleData.articleNumber }
        });

        if (!existingArticle) {
          const article = this.articlesRepository.create(articleData);
          
          // Detect and assign tags
          const tagNames = this.detectTags(article.content, article.section || '', article.chapter || '');
          if (tagNames.length > 0) {
            const tags = await this.findOrCreateTags(tagNames);
            article.tags = tags;
          }
          
          await this.articlesRepository.save(article);
        }
      }

      console.log(`Successfully parsed and saved ${articles.length} articles`);
    } catch (error) {
      console.error('Error parsing CGI file:', error);
      throw error;
    }
  }

  private parseContent(content: string): Partial<Article>[] {
    const articles: Partial<Article>[] = [];
    const lines = content.split('\n');
    
    let currentArticle: Partial<Article> | null = null;
    let currentContent: string[] = [];
    let inArticle = false;
    let currentSection = '';
    let currentChapter = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Detect section/chapter headers
      const sectionMatch = line.match(/^(Section|Chapitre|Titre|Livre)\s+(.+)/i);
      if (sectionMatch) {
        if (sectionMatch[1].toLowerCase() === 'section') {
          currentSection = sectionMatch[2];
        } else if (sectionMatch[1].toLowerCase() === 'chapitre') {
          currentChapter = sectionMatch[2];
        }
        continue;
      }
      
      // Detect article start
      const articleMatch = line.match(/^Article\s+(\d+(?:\s+(?:bis|ter|quater|quinquies|sexies|septies|octies|nonies|decies))?)/i);
      
      if (articleMatch) {
        // Save previous article if exists
        if (currentArticle && currentContent.length > 0) {
          currentArticle.content = currentContent.join('\n').trim();
          currentArticle.section = currentSection;
          currentArticle.chapter = currentChapter;
          articles.push(currentArticle);
        }

        // Start new article
        currentArticle = {
          articleNumber: articleMatch[1],
          title: this.extractTitle(line),
          content: '',
          isActive: true,
          tags: [],
          section: currentSection,
          chapter: currentChapter,
        };
        currentContent = [];
        inArticle = true;
        continue;
      }

      // Detect modification info
      if (inArticle && currentArticle) {
        const modMatch = line.match(/(?:modifié|ajouté|abrogé|supprimé)/i);
        if (modMatch) {
          currentArticle.modificationReason = line;
          currentArticle.lastModified = new Date();
        }

        // Add content
        if (line.length > 0) {
          currentContent.push(line);
        }
      }
    }

    // Save last article
    if (currentArticle && currentContent.length > 0) {
      currentArticle.content = currentContent.join('\n').trim();
      currentArticle.section = currentSection;
      currentArticle.chapter = currentChapter;
      articles.push(currentArticle);
    }

    return articles;
  }

  private extractTitle(line: string): string {
    // Extract title from article line
    const titleMatch = line.match(/^Article\s+\d+(?:\s+(?:bis|ter|quater|quinquies|sexies|septies|octies|nonies|decies))?\s*[-–]\s*(.+)/i);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
    
    // Fallback to article number
    const articleMatch = line.match(/^Article\s+(\d+(?:\s+(?:bis|ter|quater|quinquies|sexies|septies|octies|nonies|decies))?)/i);
    return articleMatch ? `Article ${articleMatch[1]}` : 'Article sans titre';
  }

  private detectTags(content: string, section: string, chapter: string): string[] {
    const tags: string[] = [];
    const text = (content + ' ' + section + ' ' + chapter).toLowerCase();

    // Tax tags
    if (text.includes('impôt sur le revenu') || text.includes('revenu net global')) {
      tags.push('IR');
    }
    if (text.includes('impôt sur les sociétés') || text.includes('bénéfice des sociétés')) {
      tags.push('IS');
    }
    if (text.includes('taxe sur la valeur ajoutée') || text.includes('tva')) {
      tags.push('TVA');
    }
    if (text.includes('cotisation foncière des entreprises') || text.includes('cfe')) {
      tags.push('CFE');
    }
    if (text.includes('cotisation sur la valeur ajoutée des entreprises') || text.includes('cvae')) {
      tags.push('CVAE');
    }
    if (text.includes('taxe d\'habitation') || text.includes('logement')) {
      tags.push('TH');
    }
    if (text.includes('taxe foncière') || text.includes('propriétés bâties')) {
      tags.push('TF');
    }
    if (text.includes('droits d\'enregistrement') || text.includes('mutations à titre onéreux')) {
      tags.push('DE');
    }
    if (text.includes('droits de mutation') || text.includes('transmissions à titre gratuit')) {
      tags.push('DM');
    }

    // Special regimes
    if (text.includes('micro-entreprise') || text.includes('micro-entrepreneur')) {
      tags.push('Micro-entreprise');
    }
    if (text.includes('zone franche urbaine') || text.includes('zfu')) {
      tags.push('ZFU');
    }
    if (text.includes('zone de revitalisation rurale') || text.includes('zrr')) {
      tags.push('ZRR');
    }
    if (text.includes('crédit d\'impôt recherche') || text.includes('recherche et développement')) {
      tags.push('CIR');
    }
    if (text.includes('crédit d\'impôt transition énergétique') || text.includes('économie d\'énergie')) {
      tags.push('CITE');
    }

    // General fiscal tag
    if (tags.length === 0) {
      tags.push('Fiscalité');
    }

    return tags;
  }

  private async findOrCreateTags(tagNames: string[]): Promise<Tag[]> {
    const tags: Tag[] = [];
    
    for (const tagName of tagNames) {
      let tag = await this.tagsRepository.findOne({ where: { name: tagName } });
      if (!tag) {
        tag = this.tagsRepository.create({ name: tagName });
        await this.tagsRepository.save(tag);
      }
      tags.push(tag);
    }
    
    return tags;
  }

  private async createDefaultTags(): Promise<void> {
    const defaultTags = [
      { name: 'IS', description: 'Impôt sur les sociétés', color: '#3B82F6' },
      { name: 'TVA', description: 'Taxe sur la valeur ajoutée', color: '#10B981' },
      { name: 'IR', description: 'Impôt sur le revenu', color: '#F59E0B' },
      { name: 'CFE', description: 'Cotisation foncière des entreprises', color: '#EF4444' },
      { name: 'CVAE', description: 'Cotisation sur la valeur ajoutée des entreprises', color: '#8B5CF6' },
      { name: 'TH', description: 'Taxe d\'habitation', color: '#06B6D4' },
      { name: 'TF', description: 'Taxe foncière', color: '#84CC16' },
      { name: 'DE', description: 'Droits d\'enregistrement', color: '#F97316' },
      { name: 'DM', description: 'Droits de mutation', color: '#EC4899' },
      { name: 'Fiscalité', description: 'Dispositions fiscales générales', color: '#6B7280' },
      { name: 'Micro-entreprise', description: 'Régime micro-entreprise', color: '#8B5CF6' },
      { name: 'ZFU', description: 'Zone franche urbaine', color: '#10B981' },
      { name: 'ZRR', description: 'Zone de revitalisation rurale', color: '#F59E0B' },
      { name: 'CIR', description: 'Crédit d\'impôt recherche', color: '#3B82F6' },
      { name: 'CITE', description: 'Crédit d\'impôt transition énergétique', color: '#10B981' },
    ];

    for (const tagData of defaultTags) {
      const existingTag = await this.tagsRepository.findOne({
        where: { name: tagData.name }
      });

      if (!existingTag) {
        const tag = this.tagsRepository.create(tagData);
        await this.tagsRepository.save(tag);
      }
    }
  }
}
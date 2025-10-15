"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const article_entity_1 = require("../articles/entities/article.entity");
const tag_entity_1 = require("../articles/entities/tag.entity");
const fs = require("fs");
let ParserService = class ParserService {
    constructor(articlesRepository, tagsRepository) {
        this.articlesRepository = articlesRepository;
        this.tagsRepository = tagsRepository;
    }
    async parseCgiJsonFile(filePath) {
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`JSON file not found at: ${filePath}`);
            }
            const jsonRaw = fs.readFileSync(filePath, 'utf-8');
            const jsonData = JSON.parse(jsonRaw);
            await this.createDefaultTags();
            for (const entry of jsonData) {
                const articleNumber = this.extractArticleNumber(entry.numero_article);
                const existingArticle = await this.articlesRepository.findOne({
                    where: { articleNumber },
                });
                if (existingArticle) {
                    continue;
                }
                const tagNames = this.detectTags(entry.content || '', entry.titre || '', '');
                const tags = tagNames.length > 0 ? await this.findOrCreateTags(tagNames) : [];
                const article = this.articlesRepository.create({
                    articleNumber,
                    title: entry.titre?.trim() || this.extractTitle(entry.numero_article),
                    content: (entry.content || '').trim(),
                    isActive: true,
                    section: undefined,
                    chapter: undefined,
                    tags,
                });
                const references = (entry.references || []).map((ref) => ({
                    id: undefined,
                    referenceText: ref.texte,
                    targetArticleNumber: undefined,
                    referenceType: undefined,
                    externalUrl: undefined,
                    article,
                    articleId: undefined,
                }));
                article.references = references;
                await this.articlesRepository.save(article);
            }
            console.log(`Successfully parsed and saved ${jsonData.length} articles from JSON`);
        }
        catch (error) {
            console.error('Error parsing CGI JSON file:', error);
            throw error;
        }
    }
    extractArticleNumber(numeroArticle) {
        if (!numeroArticle) {
            return '';
        }
        const match = numeroArticle.match(/Article\s+([0-9]+(?:\s*(?:bis|ter|quater|quinquies|sexies|septies|octies|nonies|decies))?)/i);
        if (match) {
            return match[1].trim();
        }
        return numeroArticle.trim();
    }
    async parseCgiFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const articles = this.parseContent(content);
            await this.createDefaultTags();
            for (const articleData of articles) {
                const existingArticle = await this.articlesRepository.findOne({
                    where: { articleNumber: articleData.articleNumber }
                });
                if (!existingArticle) {
                    const article = this.articlesRepository.create(articleData);
                    const tagNames = this.detectTags(article.content, article.section || '', article.chapter || '');
                    if (tagNames.length > 0) {
                        const tags = await this.findOrCreateTags(tagNames);
                        article.tags = tags;
                    }
                    await this.articlesRepository.save(article);
                }
            }
            console.log(`Successfully parsed and saved ${articles.length} articles`);
        }
        catch (error) {
            console.error('Error parsing CGI file:', error);
            throw error;
        }
    }
    parseContent(content) {
        const articles = [];
        const lines = content.split('\n');
        let currentArticle = null;
        let currentContent = [];
        let inArticle = false;
        let currentSection = '';
        let currentChapter = '';
        let currentBook = '';
        let currentTitle = '';
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || line.includes('C:\\Users\\') || line.includes('.jpg') || line === '2025') {
                continue;
            }
            const bookMatch = line.match(/^LIVRE\s+([IVX]+)\s*[-–]\s*(.+)/i);
            if (bookMatch) {
                currentBook = bookMatch[2];
                continue;
            }
            const titleMatch = line.match(/^TITRE\s+([IVX]+)\s*[-–]\s*(.+)/i);
            if (titleMatch) {
                currentTitle = titleMatch[2];
                continue;
            }
            const chapterMatch = line.match(/^CHAPITRE\s+([IVX]+)\s*[-–]\s*(.+)/i);
            if (chapterMatch) {
                currentChapter = chapterMatch[2];
                continue;
            }
            const sectionMatch = line.match(/^SECTION\s+([IVX]+)\s*[-–]\s*(.+)/i);
            if (sectionMatch) {
                currentSection = sectionMatch[2];
                continue;
            }
            const articleMatch = line.match(/^Article\s+(\d+(?:[a-z]+)?)/i);
            if (articleMatch) {
                if (currentArticle && currentContent.length > 0) {
                    currentArticle.content = currentContent.join('\n').trim();
                    currentArticle.section = currentSection;
                    currentArticle.chapter = currentChapter;
                    articles.push(currentArticle);
                }
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
            if (inArticle && currentArticle) {
                const modMatch = line.match(/(?:modifié|ajouté|abrogé|supprimé|abrogé|réformé)/i);
                if (modMatch) {
                    currentArticle.modificationReason = line;
                    currentArticle.lastModified = new Date();
                }
                if (line.length > 0 && !line.match(/^[IVX]+\./)) {
                    currentContent.push(line);
                }
            }
        }
        if (currentArticle && currentContent.length > 0) {
            currentArticle.content = currentContent.join('\n').trim();
            currentArticle.section = currentSection;
            currentArticle.chapter = currentChapter;
            articles.push(currentArticle);
        }
        return articles;
    }
    extractTitle(line) {
        const titleMatch = line.match(/^Article\s+\d+(?:\s+(?:bis|ter|quater|quinquies|sexies|septies|octies|nonies|decies))?\s*[-–]\s*(.+)/i);
        if (titleMatch) {
            return titleMatch[1].trim();
        }
        const articleMatch = line.match(/^Article\s+(\d+(?:\s+(?:bis|ter|quater|quinquies|sexies|septies|octies|nonies|decies))?)/i);
        return articleMatch ? `Article ${articleMatch[1]}` : 'Article sans titre';
    }
    detectTags(content, section, chapter) {
        const tags = [];
        const text = (content + ' ' + section + ' ' + chapter).toLowerCase();
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
        if (tags.length === 0) {
            tags.push('Fiscalité');
        }
        return tags;
    }
    async findOrCreateTags(tagNames) {
        const tags = [];
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
    async createDefaultTags() {
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
};
exports.ParserService = ParserService;
exports.ParserService = ParserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(article_entity_1.Article)),
    __param(1, (0, typeorm_1.InjectRepository)(tag_entity_1.Tag)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ParserService);
//# sourceMappingURL=parser.service.js.map
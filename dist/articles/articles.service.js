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
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const article_entity_1 = require("./entities/article.entity");
const tag_entity_1 = require("./entities/tag.entity");
let ArticlesService = class ArticlesService {
    constructor(articlesRepository, tagsRepository) {
        this.articlesRepository = articlesRepository;
        this.tagsRepository = tagsRepository;
    }
    async create(createArticleDto) {
        const article = this.articlesRepository.create(createArticleDto);
        if (createArticleDto.tagNames && createArticleDto.tagNames.length > 0) {
            const tags = await this.findOrCreateTags(createArticleDto.tagNames);
            article.tags = tags;
        }
        return this.articlesRepository.save(article);
    }
    async findAll(searchDto) {
        const { query, articleNumber, tag, page = 1, limit = 10, sortBy = 'articleNumber', sortOrder = 'asc' } = searchDto;
        const skip = (page - 1) * limit;
        const queryBuilder = this.articlesRepository
            .createQueryBuilder('article')
            .leftJoinAndSelect('article.tags', 'tags')
            .leftJoinAndSelect('article.references', 'references')
            .where('article.isActive = :isActive', { isActive: true });
        if (query) {
            queryBuilder.andWhere('(article.title LIKE :query OR article.content LIKE :query OR article.articleNumber LIKE :query)', { query: `%${query}%` });
        }
        if (articleNumber) {
            queryBuilder.andWhere('article.articleNumber LIKE :articleNumber', {
                articleNumber: `%${articleNumber}%`
            });
        }
        if (tag) {
            queryBuilder.andWhere('tags.name = :tag', { tag });
        }
        let orderColumn = 'article.articleNumber';
        if (sortBy === 'title') {
            orderColumn = 'article.title';
        }
        else if (sortBy === 'createdAt') {
            orderColumn = 'article.createdAt';
        }
        const [articles, total] = await queryBuilder
            .orderBy(orderColumn, sortOrder.toUpperCase())
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        return {
            articles,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const article = await this.articlesRepository.findOne({
            where: { id },
            relations: ['tags', 'references'],
        });
        if (!article) {
            throw new common_1.NotFoundException(`Article with ID ${id} not found`);
        }
        return article;
    }
    async findByArticleNumber(articleNumber) {
        const article = await this.articlesRepository.findOne({
            where: { articleNumber },
            relations: ['tags', 'references'],
        });
        if (!article) {
            throw new common_1.NotFoundException(`Article ${articleNumber} not found`);
        }
        return article;
    }
    async update(id, updateArticleDto) {
        const article = await this.findOne(id);
        if (updateArticleDto.tagNames) {
            const tags = await this.findOrCreateTags(updateArticleDto.tagNames);
            article.tags = tags;
        }
        Object.assign(article, updateArticleDto);
        return this.articlesRepository.save(article);
    }
    async remove(id) {
        const article = await this.findOne(id);
        await this.articlesRepository.remove(article);
    }
    async searchByKeyword(keyword) {
        return this.articlesRepository.find({
            where: [
                { title: (0, typeorm_2.Like)(`%${keyword}%`) },
                { content: (0, typeorm_2.Like)(`%${keyword}%`) },
                { articleNumber: (0, typeorm_2.Like)(`%${keyword}%`) },
            ],
            relations: ['tags', 'references'],
        });
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
    async getAllTags() {
        return this.tagsRepository.find();
    }
    async createTag(name, description, color) {
        const tag = this.tagsRepository.create({ name, description, color });
        return this.tagsRepository.save(tag);
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(article_entity_1.Article)),
    __param(1, (0, typeorm_1.InjectRepository)(tag_entity_1.Tag)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map
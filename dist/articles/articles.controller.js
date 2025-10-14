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
exports.ArticlesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const articles_service_1 = require("./articles.service");
const pdf_service_1 = require("../pdf/pdf.service");
const create_article_dto_1 = require("./dto/create-article.dto");
const update_article_dto_1 = require("./dto/update-article.dto");
const search_articles_dto_1 = require("./dto/search-articles.dto");
let ArticlesController = class ArticlesController {
    constructor(articlesService, pdfService) {
        this.articlesService = articlesService;
        this.pdfService = pdfService;
    }
    create(createArticleDto) {
        return this.articlesService.create(createArticleDto);
    }
    findAll(searchDto) {
        return this.articlesService.findAll(searchDto);
    }
    searchByKeyword(keyword) {
        return this.articlesService.searchByKeyword(keyword);
    }
    getAllTags() {
        return this.articlesService.getAllTags();
    }
    findOne(id) {
        return this.articlesService.findOne(+id);
    }
    findByArticleNumber(articleNumber) {
        return this.articlesService.findByArticleNumber(articleNumber);
    }
    update(id, updateArticleDto) {
        return this.articlesService.update(+id, updateArticleDto);
    }
    remove(id) {
        return this.articlesService.remove(+id);
    }
    async exportPdf(id, res) {
        const article = await this.articlesService.findOne(+id);
        const pdf = await this.pdfService.generateArticlePdf(article);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="article-${article.articleNumber}.pdf"`,
            'Content-Length': pdf.length.toString(),
        });
        res.send(pdf);
    }
    async exportPdfByNumber(articleNumber, res) {
        const article = await this.articlesService.findByArticleNumber(articleNumber);
        const pdf = await this.pdfService.generateArticlePdf(article);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="article-${article.articleNumber}.pdf"`,
            'Content-Length': pdf.length.toString(),
        });
        res.send(pdf);
    }
};
exports.ArticlesController = ArticlesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new article' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Article created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_article_dto_1.CreateArticleDto]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all articles with search and pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: false, description: 'Search query' }),
    (0, swagger_1.ApiQuery)({ name: 'articleNumber', required: false, description: 'Article number filter' }),
    (0, swagger_1.ApiQuery)({ name: 'tag', required: false, description: 'Tag filter' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_articles_dto_1.SearchArticlesDto]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search articles by keyword' }),
    (0, swagger_1.ApiQuery)({ name: 'keyword', required: true, description: 'Search keyword' }),
    __param(0, (0, common_1.Query)('keyword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "searchByKeyword", null);
__decorate([
    (0, common_1.Get)('tags'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tags' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "getAllTags", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get article by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('number/:articleNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Get article by article number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    __param(0, (0, common_1.Param)('articleNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "findByArticleNumber", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update article' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_article_dto_1.UpdateArticleDto]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete article' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/pdf'),
    (0, swagger_1.ApiOperation)({ summary: 'Export article as PDF' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'PDF generated successfully', content: { 'application/pdf': {} } }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "exportPdf", null);
__decorate([
    (0, common_1.Get)('number/:articleNumber/pdf'),
    (0, swagger_1.ApiOperation)({ summary: 'Export article as PDF by article number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'PDF generated successfully', content: { 'application/pdf': {} } }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    __param(0, (0, common_1.Param)('articleNumber')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "exportPdfByNumber", null);
exports.ArticlesController = ArticlesController = __decorate([
    (0, swagger_1.ApiTags)('articles'),
    (0, common_1.Controller)('articles'),
    __metadata("design:paramtypes", [articles_service_1.ArticlesService,
        pdf_service_1.PdfService])
], ArticlesController);
//# sourceMappingURL=articles.controller.js.map
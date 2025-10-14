import { Response } from 'express';
import { ArticlesService } from './articles.service';
import { PdfService } from '../pdf/pdf.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { SearchArticlesDto } from './dto/search-articles.dto';
export declare class ArticlesController {
    private readonly articlesService;
    private readonly pdfService;
    constructor(articlesService: ArticlesService, pdfService: PdfService);
    create(createArticleDto: CreateArticleDto): Promise<import("./entities/article.entity").Article>;
    findAll(searchDto: SearchArticlesDto): Promise<{
        articles: import("./entities/article.entity").Article[];
        total: number;
        page: number;
        limit: number;
    }>;
    searchByKeyword(keyword: string): Promise<import("./entities/article.entity").Article[]>;
    getAllTags(): Promise<import("./entities/tag.entity").Tag[]>;
    findOne(id: string): Promise<import("./entities/article.entity").Article>;
    findByArticleNumber(articleNumber: string): Promise<import("./entities/article.entity").Article>;
    update(id: string, updateArticleDto: UpdateArticleDto): Promise<import("./entities/article.entity").Article>;
    remove(id: string): Promise<void>;
    exportPdf(id: string, res: Response): Promise<void>;
    exportPdfByNumber(articleNumber: string, res: Response): Promise<void>;
}

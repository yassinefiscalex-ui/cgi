import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { Tag } from './entities/tag.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { SearchArticlesDto } from './dto/search-articles.dto';
export declare class ArticlesService {
    private articlesRepository;
    private tagsRepository;
    constructor(articlesRepository: Repository<Article>, tagsRepository: Repository<Tag>);
    create(createArticleDto: CreateArticleDto): Promise<Article>;
    findAll(searchDto: SearchArticlesDto): Promise<{
        articles: Article[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<Article>;
    findByArticleNumber(articleNumber: string): Promise<Article>;
    update(id: number, updateArticleDto: UpdateArticleDto): Promise<Article>;
    remove(id: number): Promise<void>;
    searchByKeyword(keyword: string): Promise<Article[]>;
    private findOrCreateTags;
    getAllTags(): Promise<Tag[]>;
    createTag(name: string, description?: string, color?: string): Promise<Tag>;
}

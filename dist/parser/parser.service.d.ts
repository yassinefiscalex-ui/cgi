import { Repository } from 'typeorm';
import { Article } from '../articles/entities/article.entity';
import { Tag } from '../articles/entities/tag.entity';
export declare class ParserService {
    private articlesRepository;
    private tagsRepository;
    constructor(articlesRepository: Repository<Article>, tagsRepository: Repository<Tag>);
    parseCgiJsonFile(filePath: string): Promise<void>;
    private extractArticleNumber;
    parseCgiFile(filePath: string): Promise<void>;
    private parseContent;
    private extractTitle;
    private detectTags;
    private findOrCreateTags;
    private createDefaultTags;
}

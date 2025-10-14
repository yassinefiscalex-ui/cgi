import { Article } from './article.entity';
export declare class Reference {
    id: number;
    referenceText: string;
    targetArticleNumber: string;
    referenceType: string;
    externalUrl: string;
    article: Article;
    articleId: number;
}

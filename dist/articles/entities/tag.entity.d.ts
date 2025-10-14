import { Article } from './article.entity';
export declare class Tag {
    id: number;
    name: string;
    description: string;
    color: string;
    articles: Article[];
}

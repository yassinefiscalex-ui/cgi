import { Reference } from './reference.entity';
import { Tag } from './tag.entity';
export declare class Article {
    id: number;
    articleNumber: string;
    title: string;
    content: string;
    section: string;
    chapter: string;
    isActive: boolean;
    lastModified: Date;
    modificationReason: string;
    references: Reference[];
    tags: Tag[];
    createdAt: Date;
    updatedAt: Date;
}

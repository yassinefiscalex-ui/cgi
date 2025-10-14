import { CreateReferenceDto } from './create-reference.dto';
export declare class CreateArticleDto {
    articleNumber: string;
    title: string;
    content: string;
    section?: string;
    chapter?: string;
    isActive?: boolean;
    modificationReason?: string;
    references?: CreateReferenceDto[];
    tagNames?: string[];
}

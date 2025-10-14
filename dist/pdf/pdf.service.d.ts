import { Article } from '../articles/entities/article.entity';
export declare class PdfService {
    generateArticlePdf(article: Article): Promise<Buffer>;
    private generateArticleHtml;
    private formatContent;
}

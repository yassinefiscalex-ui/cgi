import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Article } from './entities/article.entity';
import { Tag } from './entities/tag.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { SearchArticlesDto } from './dto/search-articles.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = this.articlesRepository.create(createArticleDto);
    
    // Handle tags
    if (createArticleDto.tagNames && createArticleDto.tagNames.length > 0) {
      const tags = await this.findOrCreateTags(createArticleDto.tagNames);
      article.tags = tags;
    }

    return this.articlesRepository.save(article);
  }

  async findAll(searchDto: SearchArticlesDto): Promise<{ articles: Article[]; total: number; page: number; limit: number }> {
    const { query, articleNumber, tag, page = 1, limit = 10 } = searchDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.articlesRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.tags', 'tags')
      .leftJoinAndSelect('article.references', 'references')
      .where('article.isActive = :isActive', { isActive: true });

    if (query) {
      queryBuilder.andWhere(
        '(article.title LIKE :query OR article.content LIKE :query OR article.articleNumber LIKE :query)',
        { query: `%${query}%` }
      );
    }

    if (articleNumber) {
      queryBuilder.andWhere('article.articleNumber LIKE :articleNumber', { 
        articleNumber: `%${articleNumber}%` 
      });
    }

    if (tag) {
      queryBuilder.andWhere('tags.name = :tag', { tag });
    }

    const [articles, total] = await queryBuilder
      .orderBy('article.articleNumber', 'ASC')
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

  async findOne(id: number): Promise<Article> {
    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: ['tags', 'references'],
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    return article;
  }

  async findByArticleNumber(articleNumber: string): Promise<Article> {
    const article = await this.articlesRepository.findOne({
      where: { articleNumber },
      relations: ['tags', 'references'],
    });

    if (!article) {
      throw new NotFoundException(`Article ${articleNumber} not found`);
    }

    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const article = await this.findOne(id);

    // Handle tags
    if (updateArticleDto.tagNames) {
      const tags = await this.findOrCreateTags(updateArticleDto.tagNames);
      article.tags = tags;
    }

    Object.assign(article, updateArticleDto);
    return this.articlesRepository.save(article);
  }

  async remove(id: number): Promise<void> {
    const article = await this.findOne(id);
    await this.articlesRepository.remove(article);
  }

  async searchByKeyword(keyword: string): Promise<Article[]> {
    return this.articlesRepository.find({
      where: [
        { title: Like(`%${keyword}%`) },
        { content: Like(`%${keyword}%`) },
        { articleNumber: Like(`%${keyword}%`) },
      ],
      relations: ['tags', 'references'],
    });
  }

  private async findOrCreateTags(tagNames: string[]): Promise<Tag[]> {
    const tags: Tag[] = [];
    
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

  async getAllTags(): Promise<Tag[]> {
    return this.tagsRepository.find();
  }

  async createTag(name: string, description?: string, color?: string): Promise<Tag> {
    const tag = this.tagsRepository.create({ name, description, color });
    return this.tagsRepository.save(tag);
  }
}
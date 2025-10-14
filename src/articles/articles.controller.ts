import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ArticlesService } from './articles.service';
import { PdfService } from '../pdf/pdf.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { SearchArticlesDto } from './dto/search-articles.dto';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({ status: 201, description: 'Article created successfully' })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles with search and pagination' })
  @ApiQuery({ name: 'query', required: false, description: 'Search query' })
  @ApiQuery({ name: 'articleNumber', required: false, description: 'Article number filter' })
  @ApiQuery({ name: 'tag', required: false, description: 'Tag filter' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  findAll(@Query() searchDto: SearchArticlesDto) {
    return this.articlesService.findAll(searchDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search articles by keyword' })
  @ApiQuery({ name: 'keyword', required: true, description: 'Search keyword' })
  searchByKeyword(@Query('keyword') keyword: string) {
    return this.articlesService.searchByKeyword(keyword);
  }

  @Get('tags')
  @ApiOperation({ summary: 'Get all tags' })
  getAllTags() {
    return this.articlesService.getAllTags();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by ID' })
  @ApiResponse({ status: 200, description: 'Article found' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Get('number/:articleNumber')
  @ApiOperation({ summary: 'Get article by article number' })
  @ApiResponse({ status: 200, description: 'Article found' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  findByArticleNumber(@Param('articleNumber') articleNumber: string) {
    return this.articlesService.findByArticleNumber(articleNumber);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update article' })
  @ApiResponse({ status: 200, description: 'Article updated successfully' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete article' })
  @ApiResponse({ status: 200, description: 'Article deleted successfully' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Export article as PDF' })
  @ApiResponse({ status: 200, description: 'PDF generated successfully', content: { 'application/pdf': {} } })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async exportPdf(@Param('id') id: string, @Res() res: Response) {
    const article = await this.articlesService.findOne(+id);
    const pdf = await this.pdfService.generateArticlePdf(article);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="article-${article.articleNumber}.pdf"`,
      'Content-Length': pdf.length.toString(),
    });
    
    res.send(pdf);
  }

  @Get('number/:articleNumber/pdf')
  @ApiOperation({ summary: 'Export article as PDF by article number' })
  @ApiResponse({ status: 200, description: 'PDF generated successfully', content: { 'application/pdf': {} } })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async exportPdfByNumber(@Param('articleNumber') articleNumber: string, @Res() res: Response) {
    const article = await this.articlesService.findByArticleNumber(articleNumber);
    const pdf = await this.pdfService.generateArticlePdf(article);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="article-${article.articleNumber}.pdf"`,
      'Content-Length': pdf.length.toString(),
    });
    
    res.send(pdf);
  }
}
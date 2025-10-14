import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParserService } from './parser.service';
import { Article } from '../articles/entities/article.entity';
import { Tag } from '../articles/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Tag])],
  providers: [ParserService],
  exports: [ParserService],
})
export class ParserModule {}
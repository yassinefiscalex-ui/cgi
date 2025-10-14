import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ArticlesModule } from './articles/articles.module';
import { PdfModule } from './pdf/pdf.module';
import { ParserModule } from './parser/parser.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Article } from './articles/entities/article.entity';
import { Reference } from './articles/entities/reference.entity';
import { Tag } from './articles/entities/tag.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'cgi-reader.db',
      entities: [Article, Reference, Tag],
      synchronize: true,
    }),
    ArticlesModule,
    PdfModule,
    ParserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
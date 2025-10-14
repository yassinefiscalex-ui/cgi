import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Article } from './article.entity';

@Entity('references')
export class Reference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  referenceText: string;

  @Column({ nullable: true })
  targetArticleNumber: string;

  @Column({ nullable: true })
  referenceType: string; // 'article', 'section', 'chapter', 'external'

  @Column({ nullable: true })
  externalUrl: string;

  @ManyToOne(() => Article, article => article.references, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'articleId' })
  article: Article;

  @Column()
  articleId: number;
}
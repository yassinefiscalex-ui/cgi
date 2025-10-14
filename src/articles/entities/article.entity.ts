import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Reference } from './reference.entity';
import { Tag } from './tag.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  articleNumber: string;

  @Column('text')
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  section: string;

  @Column({ nullable: true })
  chapter: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastModified: Date;

  @Column({ nullable: true })
  modificationReason: string;

  @OneToMany(() => Reference, reference => reference.article, { cascade: true })
  references: Reference[];

  @ManyToMany(() => Tag, tag => tag.articles)
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
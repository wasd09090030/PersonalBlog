import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// 定义文章类别枚举
export enum ArticleCategory {
  STUDY = 'study', // 学习
  GAME = 'game', // 游戏
  WORK = 'work', // 个人作品
  OTHER = 'other', // 其他
}

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column('text', { nullable: true })
  contentMarkdown: string;

  @Column({
    type: 'varchar',
    enum: ArticleCategory,
    default: ArticleCategory.OTHER,
  })
  category: ArticleCategory;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

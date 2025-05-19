import { PartialType } from '@nestjs/mapped-types';

export class CreateArticleDto {
  title: string;
  content: string;
  contentMarkdown?: string; // 添加存储Markdown原文的字段
}

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}

import { PartialType } from '@nestjs/mapped-types';

export class CreateArticleDto {
  title: string;
  content: string;
  author?: string;
}

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}

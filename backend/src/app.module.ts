import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article/article.entity';
import { ArticleModule } from './article/article.module'; // Import ArticleModule

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'blog.sqlite',
      entities: [Article],
      synchronize: true,
    }),
    ArticleModule, // Add ArticleModule here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

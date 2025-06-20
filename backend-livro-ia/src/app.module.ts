import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ChapterModule } from './chapter/chapter.module'
import { BookModule } from './book/book.module';
import { GeminiService } from './ia/gemini.service'
import { ImageModule } from './ia/image.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/escritor-magico-db'),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', 
    }),
    ChapterModule,
    BookModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService, GeminiService],
})
export class AppModule { }

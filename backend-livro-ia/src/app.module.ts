import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ChapterModule } from './chapter/chapter.module'
import { BookModule } from './book/book.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/escritor-magico-db'),
    ChapterModule,
    BookModule,
  ],
  controllers: [AppController],   
  providers: [AppService],        
})
export class AppModule { }

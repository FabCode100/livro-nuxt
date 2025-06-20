import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Book, BookSchema } from './book.schema'
import { BookService } from './book.service'
import { BookController } from './book.controller'
import { ChapterModule } from '../chapter/chapter.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    ChapterModule
  ],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}


import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Chapter, ChapterSchema } from './chapter.schema'
import { ChapterService } from './chapter.service'
import { ChapterController } from './chapter.controller'
import { GeminiService } from 'src/ia/gemini.service'
import { BookModule } from 'src/book/book.module'
import { Book, BookSchema } from 'src/book/book.schema'

@Module({
    imports: [MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    forwardRef(() => BookModule)],
    
    controllers: [ChapterController],
    providers: [ChapterService, GeminiService],
    exports: [ChapterService],
})
export class ChapterModule { }

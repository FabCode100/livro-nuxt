
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Chapter, ChapterSchema } from './chapter.schema'
import { ChapterService } from './chapter.service'
import { ChapterController } from './chapter.controller'
import { GeminiService } from 'src/ia/gemini.service'

@Module({
    imports: [MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }])],
    controllers: [ChapterController],
    providers: [ChapterService, GeminiService],
    exports: [ChapterService],  // <== exporte o serviço se for usar fora do módulo
})
export class ChapterModule { }

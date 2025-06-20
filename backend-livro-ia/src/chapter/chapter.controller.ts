import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { ChapterService } from './chapter.service'

// chapter.controller.ts
@Controller('capitulos')
export class ChapterController {
    constructor(private readonly chapterService: ChapterService) {}

    @Post()
    create(@Body() body: any) {
        return this.chapterService.create(body)
    }

    @Get('por-livro/:livroId')
    getByLivro(@Param('livroId') livroId: string) {
        return this.chapterService.findByLivroId(livroId)
    }

    @Get()
    listarTodos() {
        return this.chapterService.findAll()
    }
}

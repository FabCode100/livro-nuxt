import { Controller, Get, Param, Res, Put, Body, Delete, HttpException, HttpStatus, Post } from '@nestjs/common'
import { BookService } from './book.service'
import { Response } from 'express'

@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    // Listar todos os livros
    @Get()
    getAllBooks() {
        return this.bookService.listarBooks()
    }
    @Post()
    async createBook(@Body('titulo') titulo: string) {
        return this.bookService.criarLivro(titulo)
    }
    // Gerar PDF de um livro
    @Get(':bookId/pdf')
    async gerarPDF(@Param('bookId') bookId: string, @Res() res: Response) {
        try {
            const stream = await this.bookService.gerarPDF(bookId)

            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', `attachment; filename=${bookId}.pdf`)
            stream.pipe(res)
        } catch (error) {
            throw new HttpException('Erro ao gerar PDF', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    // Atualizar título do livro
    @Put(':id')
    async atualizar(@Param('id') id: string, @Body('titulo') titulo: string) {
        const livro = await this.bookService.atualizarLivro(id, titulo)
        if (!livro) {
            throw new HttpException('Livro não encontrado', HttpStatus.NOT_FOUND)
        }
        return livro
    }

    // Deletar livro
    @Delete(':id')
    async deletar(@Param('id') id: string) {
        const resultado = await this.bookService.deletarLivro(id)
        if (!resultado) {
            throw new HttpException('Livro não encontrado', HttpStatus.NOT_FOUND)
        }
        return { message: 'Livro deletado com sucesso' }
    }
}

import {
    Controller,
    Get,
    Param,
    Res,
    Put,
    Body,
    Delete,
    HttpException,
    HttpStatus,
    Post,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { BookService } from './book.service'
import { diskStorage } from 'multer'
import { extname } from 'path'

@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    // Listar todos os livros
    @Get()
    getAllBooks() {
        return this.bookService.listarBooks()
    }

    // Criar livro com imagem
    @Post()
    @UseInterceptors(FileInterceptor('capa', {
        storage: diskStorage({
            destination: './uploads/capas',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
                cb(null, `${uniqueSuffix}${extname(file.originalname)}`)
            }
        })
    }))
    @Post()
    async createBook(
        @Body('titulo') titulo: string,
        @Body('capa') capa?: string
    ) {
        return this.bookService.criarLivro(titulo, capa)
    }


    // Gerar PDF
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
    @Get(':id')
    async getBookById(@Param('id') id: string) {
        const livro = await this.bookService.buscarLivroPorId(id)
        if (!livro) {
            throw new HttpException('Livro não encontrado', HttpStatus.NOT_FOUND)
        }
        return livro
    }

    // Atualizar título
    @Put(':id')
    async atualizar(@Param('id') id: string, @Body('titulo') titulo: string) {
        const livro = await this.bookService.atualizarLivro(id, titulo)
        if (!livro) {
            throw new HttpException('Livro não encontrado', HttpStatus.NOT_FOUND)
        }
        return livro
    }

    // Deletar
    @Delete(':id')
    async deletar(@Param('id') id: string) {
        const resultado = await this.bookService.deletarLivro(id)
        if (!resultado) {
            throw new HttpException('Livro não encontrado', HttpStatus.NOT_FOUND)
        }
        return { message: 'Livro deletado com sucesso' }
    }
}

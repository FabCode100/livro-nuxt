import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ChapterService } from '../chapter/chapter.service'
import { Book } from './book.schema'
import * as PDFDocument from 'pdfkit'
import { PassThrough } from 'stream'

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name) private readonly bookModel: Model<Book>,
        private readonly chapterService: ChapterService
    ) { }

    async listarBooks() {
        return this.bookModel.find().exec()
    }
    async criarLivro(titulo: string, capa?: string) {
        const livro = new this.bookModel({ titulo, capa })
        return livro.save()
    }

    async gerarPDF(bookId: string): Promise<NodeJS.ReadableStream> {
        const capitulos = await this.chapterService.findByLivroId(bookId)
        const doc = new PDFDocument()
        const stream = new PassThrough()
        doc.pipe(stream)

        doc.fontSize(18).text(`Livro: ${bookId}`, { align: 'center' }).moveDown(2)

        capitulos
            .sort((a, b) => a.ordem - b.ordem)
            .forEach((cap: any, idx: number) => {
                doc.addPage().fontSize(16).text(`Capítulo ${idx + 1}`, { underline: true }).moveDown()
                doc.fontSize(12).text(cap.capitulo, { align: 'justify' })
            })

        doc.end()
        return stream
    }
    async buscarLivroPorId(id: string) {
        return await this.bookModel.findById(id) // Ou como acessar seu repositório
    }

    async atualizarLivro(id: string, titulo: string) {
        return this.bookModel.findByIdAndUpdate(id, { titulo }, { new: true }).exec()
    }

    async deletarLivro(id: string) {
        const livro = await this.bookModel.findByIdAndDelete(id).exec()
        if (livro) {
            await this.chapterService.deletarPorLivroId(id)
        }
        return livro
    }
}

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Chapter, ChapterDocument } from './chapter.schema'
import { Book, BookDocument } from '../book/book.schema'
import { GeminiService } from '../ia/gemini.service'

@Injectable()
export class ChapterService {
    constructor(
        @InjectModel(Chapter.name) private chapterModel: Model<ChapterDocument>,
        @InjectModel(Book.name) private readonly bookModel: Model<Book>,
        private readonly geminiService: GeminiService
    ) { }

    async create(data: Partial<Chapter>) {
        const { prompt, bookId: inputBookId } = data

        if (!prompt) {
            throw new Error('Prompt é obrigatório para gerar o capítulo.')
        }

        const resposta = await this.geminiService.gerarTexto(prompt)
        let bookId = inputBookId

        if (!bookId) {
            const count = await this.bookModel.countDocuments()
            const novoLivro = await this.bookModel.create({
                titulo: `Livro Encantado ${count + 1}`,
            }) as unknown as BookDocument
            bookId = novoLivro._id.toString()
        }

        const ordem = await this.chapterModel.countDocuments({ bookId }) + 1

        return this.chapterModel.create({
            prompt,
            capitulo: resposta,
            bookId,
            ordem,
        })
    }

    async findAll() {
        return this.chapterModel.find().sort({ criadoEm: 1 }).exec()
    }

    async findByLivroId(bookId: string) {
        return this.chapterModel.find({ bookId }).sort({ ordem: 1 }).exec()
    }

    async listarLivros() {
        return this.bookModel.find().exec()
    }

    async deletarPorLivroId(bookId: string) {
        return this.chapterModel.deleteMany({ bookId }).exec()
    }
}

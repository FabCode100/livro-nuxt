// src/ia/gemini.service.ts
import { Injectable } from '@nestjs/common'
import { GoogleGenerativeAI } from '@google/generative-ai'

@Injectable()
export class GeminiService {
    private readonly model

    constructor() {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
        this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    }

    async gerarTexto(prompt: string): Promise<string> {
        const result = await this.model.generateContent(
            `Você é um escritor de fantasia. Escreva um capítulo baseado na seguinte ideia: ${prompt}`
        )
        const response = await result.response
        return response.text()
    }
}

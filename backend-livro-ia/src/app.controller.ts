import { Controller, Post, Body } from '@nestjs/common'
import { GeminiService } from './ia/gemini.service'

@Controller()
export class AppController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('gerar')
  async gerarCapitulo(@Body() body: { prompt: string }) {
    const texto = await this.geminiService.gerarTexto(body.prompt)
    return { capitulo: texto }
  }
}

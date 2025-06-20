import { Controller, Post, Body } from '@nestjs/common'
import { GeminiService } from './ia/gemini.service'

@Controller()
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly geminiService: GeminiService) {}

  @Post('gerar')
  async gerarCapitulo(@Body() body: { prompt: string }) {
    const texto = await this.geminiService.gerarTexto(body.prompt)
    return { capitulo: texto }
  }
}

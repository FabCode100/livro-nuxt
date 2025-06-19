import { Controller, Post, Body } from '@nestjs/common';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

@Controller()
export class AppController {
  @Post('gerar')
  async gerarCapitulo(@Body() body: { prompt: string }) {
    const resposta = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Você é um escritor de fantasia. Escreva o primeiro capítulo de um livro baseado na ideia do usuário.' },
        { role: 'user', content: body.prompt },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    return {
      capitulo: resposta.choices[0].message.content,
    };
  }
}

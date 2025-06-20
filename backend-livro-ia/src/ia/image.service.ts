import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  private readonly apiKey: string;

  constructor(private readonly http: HttpService) {
    this.apiKey = process.env.STABILITY_API_KEY!;
  }

  async gerarImagem(prompt: string): Promise<string> {
    const form = new FormData();
    form.append('prompt', prompt);
    form.append('output_format', 'png'); // OK, mas confira docs Stability AI para o correto

    try {
      const response = await firstValueFrom(
        this.http.post(
          'https://api.stability.ai/v2beta/stable-image/generate/core',
          form,
          {
            headers: {
              ...form.getHeaders(),
              Authorization: `Bearer ${this.apiKey}`,
              Accept: 'application/json',
            },
            timeout: 60000,
            responseType: 'arraybuffer', // importante para pegar buffer da imagem
          },
        ),
      );

      // response.data agora é um buffer da imagem PNG
      const bufferImagem = Buffer.from(response.data);

      // gerar nome único para o arquivo, ex:
      const nomeArquivo = `img_${Date.now()}.png`;

      // caminho para salvar localmente, por exemplo: ./uploads/img_12345.png
      const caminhoArquivo = path.resolve(__dirname, '../../uploads', nomeArquivo);

      await fs.promises.writeFile(caminhoArquivo, bufferImagem);

      // montar URL pública para a imagem
      const urlPublica = `http://localhost:3002/uploads/${nomeArquivo}`;

      return urlPublica;
    } catch (err) {
      console.error('Erro ao gerar imagem:', err.response?.data || err.message);
      throw new Error('Falha ao gerar imagem com Stability AI');
    }
  }

}

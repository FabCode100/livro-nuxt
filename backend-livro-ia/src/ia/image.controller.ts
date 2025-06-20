import { Controller, Post, Body } from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('generate')
  async generate(@Body('prompt') prompt: string) {
    const url = await this.imageService.gerarImagem(prompt);
    return { imageUrl: url };
  }
}

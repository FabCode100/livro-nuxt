import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  providers: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {}

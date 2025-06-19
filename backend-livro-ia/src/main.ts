import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Isso é importante!
  await app.listen(3001); // Porta da sua API
}
bootstrap();

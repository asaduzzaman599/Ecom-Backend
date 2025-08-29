import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(/* {
    origin: ['http://localhost:3000', 'http://172.22.16.1:3000/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // if you want to allow cookies
} */);
  await app.listen(5000);
}
bootstrap();

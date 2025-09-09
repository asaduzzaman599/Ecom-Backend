import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(/* {
    origin: ['http://localhost:3000', 'http://172.22.16.1:3000/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // if you want to allow cookies
} */);
 
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 👈 enable DTO transformation
      whitelist: true, // remove extra fields not in DTO
      // forbidNonWhitelisted: true // (optional) throw error if extra fields exist
    }),
  );

  await app.listen(5000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    // origin: ['https://chat-web-psi-indol.vercel.app'],
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  const port = process.env.PORT
  await app.listen(port);
}
bootstrap();

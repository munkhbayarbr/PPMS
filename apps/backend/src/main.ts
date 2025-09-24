import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from '../prisma/prisma.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const cfg = new DocumentBuilder()
    .setTitle('PPMS API')
    .setDescription('Production Process Management System API')
    .setVersion('0.1.0')
    .build();
  const doc = SwaggerModule.createDocument(app, cfg);
  SwaggerModule.setup('api/docs', app, doc);

  const prisma = app.get(PrismaService);
  await prisma.enableShutdownHooks(app);

  await app.listen(process.env.PORT ?? 3001);
  // eslint-disable-next-line no-console
  console.log(`API on http://localhost:${process.env.PORT ?? 3001}/api`);
  console.log(`Docs at /api/docs`);
}
bootstrap();

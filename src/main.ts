import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    // origin:'http://localhost:3001',
    credentials: true,
  });

  const options = new DocumentBuilder().setTitle('Alt Text API').setVersion('1.0').build();

  const document = SwaggerModule.createDocument(app, options);
  // fs.writeFileSync('./api-doc.json', JSON.stringify(document));
  SwaggerModule.setup('docs', app, document);

  // await app.listen(3000);
  await app.listen(80);
}
bootstrap();

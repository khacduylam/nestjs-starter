import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

export async function setup() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  // Enable CORS for all
  app.enableCors({
    origin: '*',
  });

  // Validation Pipe Global
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transform fields in dto(based on @transform) or not
      whitelist: true, // Strip any fields that do not have any decorators or not
    }),
  );

  // Swagger document
  const docUser = configService.get<string>('DOC_USER');
  const docPass = configService.get<string>('DOC_PASS');
  app.use(
    ['/docs', '/docs-json'],
    basicAuth({ challenge: true, users: { [docUser]: docPass } }),
  );

  // Swagger Document Setup
  const config = new DocumentBuilder()
    .setTitle('APIs Document')
    .setDescription('NestJS Starter - Typeorm Postgres APIs Document')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  return app;
}

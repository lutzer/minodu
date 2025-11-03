import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import flash = require('connect-flash');
import helmet from 'helmet';
import express = require('express');
import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
  app.use(cookieParser());
  app.use(compression());
  app.use(flash());

  app.use(
    session({
      secret: 'nest cats',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,
      }
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // swagger
  const options = new DocumentBuilder()
    .setTitle('MINODU BACKEND API')
    .setDescription(
      `This is a comprehensive documentation for MINODU Backend API - Empowering Seamless Integration`,
    )
    .setVersion('1.0')
    .addTag('API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      transform: true,
    },
    customSiteTitle: 'MINODU BACKEND API',
  };
  SwaggerModule.setup('api-docs', app, document, customOptions);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

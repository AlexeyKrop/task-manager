import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
  ];

  const isDevelopment = process.env.NODE_ENV === 'development';

  // app.enableCors({
  //   origin: (origin, callback) => {
  //     if (!origin && isDevelopment) {
  //       return callback(null, true);
  //     }

  //     if (!origin && !isDevelopment) {
  //       return callback(new Error('Origin header is required'));
  //     }

  //     if (allowedOrigins.includes(origin)) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error(`Origin ${origin} not allowed by CORS`));
  //     }
  //   },
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   credentials: true,
  // });
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(process.env.API_URL || 'http://localhost:3000', 'API Server')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/api-docs',
    apiReference({
      spec: {
        content: document,
      },
      theme: 'purple',
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const isDevelopment = configService.get<string>('NODE_ENV') !== 'production';
  const allowedOrigins = configService
    .get<string>('ALLOWED_ORIGINS')
    ?.split(',') || ['http://localhost:5173'];

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Origin:', req.headers.origin || 'no origin (same-origin)');
    console.log('User-Agent:', req.headers['user-agent']);
    next();
  });

  app.enableCors();

  // if (isDevelopment) {
  //   app.enableCors({
  //     origin: true,
  //     credentials: true,
  //   });
  //   console.log('CORS: Development mode - all origins allowed');
  // } else {
  //   app.enableCors({
  //     origin: (origin, callback) => {
  //       if (!origin) {
  //         return callback(null, true);
  //       }

  //       if (allowedOrigins.includes(origin)) {
  //         callback(null, true);
  //       } else {
  //         console.warn(`CORS blocked: ${origin}`);
  //         callback(new Error('Not allowed by CORS'));
  //       }
  //     },
  //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  //     allowedHeaders: ['Content-Type', 'Authorization'],
  //     credentials: true,
  //   });
  //   console.log(
  //     `CORS: Production mode - allowed origins: ${allowedOrigins.join(', ')}`,
  //   );
  // }

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

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory, NestApplication } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger as NestLogger } from '@nestjs/common';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import * as bodyParser from 'body-parser';
import { fastifyHelmet } from '@fastify/helmet';
import { fastifyCors } from '@fastify/cors';
import { I18nService, I18nValidationPipe } from 'nestjs-i18n';

import { AppModule } from './app.module';
import type {
  IApp
} from '@/configs/interface';
import { LanguageFilter } from '@/common/language/language.filter';
import swaggerBootstrap from '@/common/swagger';
import { RedisConnectionsKeeper } from "@/notification/adapters/redis.connections.keeper";
import { RedisIoAdapter } from "@/notification/adapters/redis.adapter";

async function bootstrap() {
  const app: NestFastifyApplication = await NestFactory.create(AppModule, new FastifyAdapter({
    trustProxy: true
  }));
  const configService = app.get(ConfigService);
  const appConfig = configService.get<IApp>('app');

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // app.register(
  //   fastifyHelmet,
  //   { contentSecurityPolicy: false }
  // )

  app.useGlobalPipes(
    new I18nValidationPipe()
  );

  // Validation
  app.useGlobalPipes(new ValidationPipe());


  app.useGlobalFilters(new LanguageFilter(app.get<ConfigService>(ConfigService), app.get<I18nService>(I18nService)));

  //v1
  app.setGlobalPrefix('api/v1');

  // Swagger Api
  swaggerBootstrap(app);

  // Cors
  if (appConfig.corsOrigin) {
    app.enableCors({
      origin: appConfig.corsOrigin,
      credentials: true,
    });
  }
  else {
    app.enableCors({
      origin: true
    });
  }
  const connectionsKeeper = app.get(RedisConnectionsKeeper);
  app.useWebSocketAdapter(new RedisIoAdapter(app, configService, connectionsKeeper));

  await app.listen(process.env.PORT || appConfig.port || 4000, '0.0.0.0');
  return app.getUrl();
}

(async (): Promise<void> => {
  try {
    const url = await bootstrap();
    NestLogger.log(url, 'Bootstrap');
  } catch (error) {
    NestLogger.error(error, 'Bootstrap');
  }
})();


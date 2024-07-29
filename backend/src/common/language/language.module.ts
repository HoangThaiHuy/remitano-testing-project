import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LanguageMiddleware } from './language.middleware';

@Module({})
export class LanguageModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LanguageMiddleware).forRoutes('*');
  }
}

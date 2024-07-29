import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ConfigService } from '@nestjs/config';
import { IApp } from '@/configs/interface'

@Injectable()
export class LanguageMiddleware implements NestMiddleware {

  private readonly appConfig: IApp

  constructor(private configService: ConfigService) {
    this.appConfig = this.configService.get<IApp>('app');
  }

  async use(
    req: FastifyRequest, res: FastifyReply, next: () => void
  ): Promise<void> {
    let language: string = this.appConfig.defaultLanguage;
    const availableLanguages: string[] = this.appConfig.languages;

    const reqLanguage: string = req.headers['x-lang'] as string;
    if (reqLanguage && availableLanguages.includes(reqLanguage)) {
      language = reqLanguage;
    }

    req['__language'] = language;
    req.headers['x-lang'] = language;
    next();
  }
}

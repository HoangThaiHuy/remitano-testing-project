import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Optional,
  InternalServerErrorException,
} from '@nestjs/common';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ConfigService } from '@nestjs/config';
import { IApp } from '@/configs/interface';
import { IErrorException } from './error.interface'

@Catch()
export class LanguageFilter implements ExceptionFilter {

  private readonly appConfig: IApp

  constructor(
    private configService: ConfigService,
    private readonly i18n: I18nService) {
    this.appConfig = this.configService.get<IApp>('app');
  }

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: FastifyReply = ctx.getResponse<FastifyReply>();
    const request: FastifyRequest = ctx.getRequest<FastifyRequest>();
    let language: string = this.appConfig.defaultLanguage;
    const availableLanguages: string[] = this.appConfig.languages;
    const reqLanguage: string = request.headers['x-lang'] as string;
    if (reqLanguage && availableLanguages.includes(reqLanguage)) {
      language = reqLanguage;
    }

    let statusHttp: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let messagePath = `http.${statusHttp}`;
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let data: Record<string, any> = undefined;

    if (exception instanceof HttpException) {

      const responseException = exception.getResponse();
      statusHttp = exception.getStatus();
      messagePath = `http.${statusHttp}`;
      statusCode = exception.getStatus();

      if (this.isErrorException(responseException)) {
        if (responseException.statusCode) {
          statusCode = responseException.statusCode;
        }
        messagePath = responseException.message;
        data = responseException.data;
      }

      const message = this.i18n.translate(messagePath, { lang: language });
      const responseBody = {
        statusCode,
        message,
        data,
      };

      response
        .status(statusHttp)
        .send(responseBody);
    }
    else {
      const error = exception as TypeError
      response
        .status(statusHttp)
        .send({
          statusCode,
          message: error.message,
          data,
        });
    }
    return;
  }

  isErrorException(obj: any): obj is IErrorException {
    return typeof obj === 'object'
      ? 'message' in obj
      : false;
  }

}

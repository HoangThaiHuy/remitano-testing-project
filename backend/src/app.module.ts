import { Module, Logger, OnApplicationBootstrap, BeforeApplicationShutdown } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { I18nModule, HeaderResolver, I18nJsonLoader, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import * as path from 'path';
import IoRedis from 'ioredis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { APP_INTERCEPTOR, APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TransformInterceptor } from '@/common/response/transform.interceptor';
import { WrapInterceptor } from '@/common/response/wrap.interceptor';
import { LanguageFilter } from '@/common/language/language.filter';
import Configuration from '@/configs';
import { LanguageModule } from '@/common/language/language.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { VideoModule } from './modules/video/video.module';
import { SeedingService } from '@/entities/seed';
import type { IApp, IMail, IDatabase } from '@/configs/interface';
import { NotificationGatewayModule } from './notification/notification.gateway.module';
import { NotificationQueue, PubSubChannel } from '@/notification/notification.queue';


@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        quietReqLogger: true,
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            sync: true,
          },
        },
      },
    }),
    ConfigModule.forRoot({ isGlobal: true, load: Configuration }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, './languages'),
        watch: true,
      },
      resolvers: [new HeaderResolver(['x-lang'])]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfig: IDatabase =
          configService.get<IDatabase>('database');
        return {
          type: 'postgres',
          entities: [`${__dirname}/**/*.entity{.ts,.js}`],
          migrations: [`${__dirname}/**/migration/*{.ts,.js}`],
          cli: {
            migrationsDir: `${__dirname}/**/migration`,
          },
          autoLoadEntities: true,
          logging: true,
          synchronize: true,
          migrationsRun: false,
          replication: {
            master: databaseConfig.master,
            slaves: databaseConfig.slaves,
          },
        };
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config: IMail = configService.get<IMail>('mail');
        return {
          transport: {
            host: config.mailHost,
            port: 587,
            secure: false,
            auth: {
              user: config.mailUser,
              pass: config.mailPassword,
            },
          },
          defaults: {
            from: `"no-reply" <${config.mailForm}>`,
          },
          template: {
            dir: process.cwd() + '/static/email-template/',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        }
      }
    }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config: IApp = configService.get<IApp>('app');
        return {
          secretKey: config.recaptchaSecret,
          response: (req) => req.headers.recaptcha || req.body.recaptcha,
          actions: ['signup', 'login', 'register-or-login'],
          score: 0.8,
        };
      },
    }),
    LanguageModule,
    AuthModule,
    VideoModule,
    NotificationGatewayModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: WrapInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: LanguageFilter,
    },
    AppService,
    SeedingService,
    NotificationQueue
  ]
})

export class AppModule implements OnApplicationBootstrap, BeforeApplicationShutdown {
  private sub: IoRedis;

  constructor(
    private readonly seedingService: SeedingService,
    private readonly notificationQueue: NotificationQueue
  ) { }

  async onApplicationBootstrap(): Promise<void> {
    await this.seedingService.seed();
    this.sub = this.notificationQueue.createSubscriber(PubSubChannel.NewVideo);
  }

  beforeApplicationShutdown() {
    this.sub.disconnect();
  }
}

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IApp } from '@/configs/interface'
import { writeFileSync } from 'fs';
import { fastifyBasicAuth } from '@fastify/basic-auth';

export default async function (app: NestFastifyApplication) {
  const configService = app.get(ConfigService);
  const appConfig = configService.get<IApp>('app')
  const docPrefix = '/docs';

  if (appConfig.enableDoc) {
    const documentBuild = new DocumentBuilder()
      .setTitle(appConfig.name)
      .setDescription(appConfig.description)
      .setVersion(appConfig.version)
      .addServer('/')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken'
      )
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'refreshToken'
      )
      .build();

    const document = SwaggerModule.createDocument(app, documentBuild, {
      deepScanRoutes: true
    });


    // app.use(['/docs', '/docs-json'], fastifyBasicAuth({

    //     users: {
    //         [appConfig.docUser]: appConfig.docPassword
    //     },
    // }));

    SwaggerModule.setup(docPrefix, app, document, {
      jsonDocumentUrl: `${docPrefix}/json`,
      yamlDocumentUrl: `${docPrefix}/yaml`,
      explorer: true,
      customSiteTitle: appConfig.name,
      swaggerOptions: {
        docExpansion: 'none',
        persistAuthorization: true,
        displayOperationId: true,
        operationsSorter: 'method',
        tagsSorter: 'alpha',
        tryItOutEnabled: true,
        filter: true,
        deepLinking: true,
      },
    });
  }
}

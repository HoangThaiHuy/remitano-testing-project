import { registerAs } from '@nestjs/config';
import { IApp } from './interface';

export default registerAs(
  'app',
  (): IApp => ({
    port: process.env.PORT ? Number(process.env.PORT) : 4000,
    version: '1.0.0',
    name: 'Remitano testing API',
    description: 'Remitano testing API description',
    rateLimit: process.env.RATE_LIMIT ? Number(process.env.RATE_LIMIT) : 100,
    corsOrigin: process.env.CORS_ORIGIN || '',
    enableDoc: process.env.ENABLE_DOC ? Boolean(process.env.ENABLE_DOC) : true,
    docUser: process.env.DOC_USER || 'user_doc',
    docPassword: process.env.DOC_USER || 'Abc@123456',
    languages: ['en', 'vn'],
    defaultLanguage: 'en',
    recaptchaSecret: process.env.RECAPTCHA_SECRET,
    emailExpireAt: process.env.EMAIL_EXPIRE_AT ? Number(process.env.EMAIL_EXPIRE_AT) : 3600,
  }),
);

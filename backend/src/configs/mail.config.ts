import { registerAs } from '@nestjs/config';

import { IMail } from './interface';

export default registerAs(
  'mail',
  (): IMail => ({
    usingAws: process.env.MAIL_USING_AWS ? Boolean(process.env.MAIL_USING_AWS) : false,
    awsRegion: process.env.MAIL_AWS_REGION,
    awsAccessKeyId: process.env.MAIL_AWS_ACCESS_KEY,
    awsSecretAccessKey: process.env.MAIL_AWS_SECRET_KEY,
    mailHost: process.env.MAIL_HOST,
    mailUser: process.env.MAIL_USER,
    mailPassword: process.env.MAIL_PASSWORD,
    mailForm: process.env.MAIL_FROM,
    sibKey: process.env.SIB,
  })
);

import { registerAs } from '@nestjs/config';

import { IAuth } from './interface';

export default registerAs(
  'auth',
  (): IAuth => ({
    jwtSecretKey: process.env.JWT_SECRET_KEY || '',
    jwtRefreshSecretKey: process.env.JWT_REFRESH_SECRET_KEY || '',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN
      ? parseInt(process.env.JWT_EXPIRES_IN)
      : 86400,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN
      ? parseInt(process.env.JWT_REFRESH_EXPIRES_IN)
      : 86400,
    saltRound: process.env.AUTH_SALT_ROUND
      ? parseInt(process.env.AUTH_SALT_ROUND)
      : 10,
    signOption: {
      issuer: process.env.SIGN_I || 'remitano-api',
      subject: process.env.SIGN_S || 'info@remitano.com',
      audience: process.env.SIGN_A || 'https://www.remitano.com/',
      expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN) : 600,
      algorithm: 'HS256'
    },
    google: {
      id: process.env.OAUTH_GOOGLE_ID,
      secret: process.env.OAUTH_GOOGLE_SECRET,
      redirectUrl: process.env.OAUTH_GOOGLE_REDIRECT_URL
    },
  }),
);

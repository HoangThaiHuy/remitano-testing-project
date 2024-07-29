import { registerAs } from '@nestjs/config';
import { IRedis } from './interface';

export default registerAs(
  'redis',
  (): IRedis => ({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6397,
    db: Number(process.env.REDIS_DB) || 0
  }),
);

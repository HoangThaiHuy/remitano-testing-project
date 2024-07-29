import { createAdapter } from '@socket.io/redis-adapter';
import { ServerOptions } from 'socket.io';
import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { IRedis } from '@/configs/interface';

import { RedisConnectionsKeeper } from './redis.connections.keeper';

export class RedisIoAdapter extends IoAdapter {
  private readonly adapterConstructor: ReturnType<typeof createAdapter>;

  constructor(app: INestApplication, configService: ConfigService, connectionKeeper: RedisConnectionsKeeper) {
    super(app);
    const config: IRedis = configService.get<IRedis>('redis');
    const subClient = connectionKeeper.createConnect(config);
    const pubClient = connectionKeeper.createConnect(config);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): unknown {
    const server = super.createIOServer(port, options);

    server.adapter(this.adapterConstructor);

    return server;
  }
}
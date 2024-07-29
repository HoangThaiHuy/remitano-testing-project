import { Redis } from 'ioredis';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import type { IRedis } from '@/configs/interface';

@Injectable()
export class RedisConnectionsKeeper implements OnModuleDestroy {
  private clients: Redis[] = [];

  async onModuleDestroy(): Promise<void> {
    for (const client of this.clients) {
      await client.quit();
    }
  }

  createConnect(config: IRedis): Redis {
    const client = new Redis({
      host: config.host,
      port: config.port,
      db: config.db
    });
    client.on('error', (err) => {
      console.log(`redis client error ${`${err.message}`}`)
    });
    this.clients.push(client);
    return client;
  }
}
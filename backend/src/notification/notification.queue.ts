import IoRedis from 'ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IRedis } from '@/configs/interface';
import { NotificationGateway } from '@/notification/notification.gateway';


export enum PubSubChannel {
  NewVideo = 'new_video'
}

@Injectable()
export class NotificationQueue extends IoRedis {

  private readonly logger = new Logger(NotificationQueue.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly notificationGateway: NotificationGateway
  ) {
    const redisConfig = configService.get<IRedis>('redis');
    super({
      host: redisConfig?.host || '127.0.0.1',
      port: redisConfig?.port || 6379,
      db: redisConfig?.db || 0
    });
  }

  async publishToChannel<D>(channel: PubSubChannel, payload: any): Promise<void> {
    await super.publish(channel, Buffer.from(JSON.stringify(payload), 'utf8').toString('base64'));
  }

  public createSubscriber(...channels: PubSubChannel[]): IoRedis {
    const sub = this.duplicate({ lazyConnect: true });
    sub.on('message', (channel, message) => {
      let payload: any;

      try {
        payload = JSON.parse(Buffer.from(message, 'base64').toString('utf8'));
      } catch {
        payload = null;
      }

      if (channel == PubSubChannel.NewVideo) {
        this.notificationGateway.newMovie(payload);
      }
    });

    sub.subscribe(...channels);

    return sub;
  }
}


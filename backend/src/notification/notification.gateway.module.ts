import { Module, Global } from '@nestjs/common';
import { NotificationGateway } from "./notification.gateway";
import { RedisConnectionsKeeper } from "./adapters/redis.connections.keeper";
import { NotificationQueue } from "./notification.queue";

@Global()
@Module({
  providers: [NotificationGateway, NotificationQueue, RedisConnectionsKeeper],
  exports: [NotificationGateway, NotificationQueue]
})
export class NotificationGatewayModule { }
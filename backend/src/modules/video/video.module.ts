import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Video, VideoActivity } from '@/entities';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Video, VideoActivity])
  ],
  providers: [VideoService],
  controllers: [VideoController]
})
export class VideoModule {

}

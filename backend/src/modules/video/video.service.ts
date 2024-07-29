import { Injectable, Logger, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Video, VideoActivity, User } from '@/entities';
import { InjectRepository, } from '@nestjs/typeorm'
import { Repository, DataSource, QueryRunner } from 'typeorm'
import { ArrayContains, ArrayOverlap, Raw, In, } from "typeorm"
import YouTube from "youtube-sr";
import * as yts from "yt-search";

import { SearchVideoRequestDto } from './dto'
import { VideoActivityType } from '@/entities/value-object';
import { NotificationQueue, PubSubChannel } from '@/notification/notification.queue';

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);

  constructor(
    @InjectRepository(Video) private videoRepo: Repository<Video>,
    @InjectRepository(VideoActivity) private videoActivityRepo: Repository<VideoActivity>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private dataSource: DataSource,
    private readonly notificationQueue: NotificationQueue
  ) {

  }

  async searchVideo(query: SearchVideoRequestDto): Promise<{ items: Video[], total: number }> {
    try {
      let searchCriteria: any = {};

      if (query.keyword) {
        searchCriteria.title = Raw(alias => `${alias} ILIKE '%${query.keyword}%'`);
      }

      if (query.user_id) {
        searchCriteria.userId = query.user_id;
      }

      const [result, total] = await this.videoRepo.findAndCount({
        relations: {
          user: true
        },
        where: searchCriteria,
        skip: query.offset,
        take: query.limit,
        order: {
          createdAt: 'DESC'
        }
      });

      return { items: result, total };
    }
    catch (err) {
      this.logger.error(`Failed to search video`, err);
    }

    return { items: [], total: 0 };
  }

  async getVideo(videoId: string): Promise<Video | null | undefined> {
    try {
      const result = await this.videoRepo.findOne({
        where: {
          id: videoId
        }
      })

      if (!result) {
        throw new NotFoundException({
          message: 'video.error.NOT_FOUND'
        });
      }

      return result;
    }
    catch (err) {
      this.logger.error(`Cannot get video: ${err}`);
      throw err;
    }

  }

  async shareVideo(url: string, userId: string): Promise<Video | null | undefined> {
    try {
      const yVideo = await this._getVideoByUrl(url);
      if (yVideo) {
        throw new BadRequestException({
          message: 'video.error.VIDEO_EXISTS',
        });
      }

      const user = await this._getUser(userId);
      if (!user) {
        throw new NotFoundException({
          message: 'user.error.NOT_FOUND',
        });
      }

      const yData = await this.getYoutubeMetadata(url);
      console.log('getYoutubeMetadata', yData)
      if (!yData) {
        throw new NotFoundException({
          message: 'video.error.NOT_FOUND_URL'
        });
      }

      const video = await this.videoRepo.save({
        userId: userId,
        url: yData.url,
        title: yData.title,
        thumbnail: yData.thumbnail,
        description: yData.description,
        yId: yData.videoId,
        // likes: yData.ratings.likes,
        // dislikes: yData.ratings.dislikes
      })

      this.notificationQueue.publishToChannel(PubSubChannel.NewVideo, { ...video, email: user.email });
      return video;
    }
    catch (err) {
      this.logger.error(`Error sharing video: ${err}`);
      throw err;
    }
  }

  async likeVideo(videoId: string, userId: string, remove: boolean = false): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await this._checkActivityVideo(videoId, userId);

      const activity = await this.videoActivityRepo.findOne({
        where: {
          videoId: videoId,
          userId: userId,
          type: VideoActivityType.LIKE
        }
      })

      if (!remove) {
        if (!activity) {
          await queryRunner.manager.save(new VideoActivity({
            videoId: videoId,
            userId: userId,
            type: VideoActivityType.LIKE
          }))

          await queryRunner.manager.increment(Video, {
            id: videoId
          }, "likes", 1)

          await this._deleteActivity(videoId, userId, VideoActivityType.DISLIKE, queryRunner);
        }
      }
      else {
        if (activity) {
          await queryRunner.manager.delete(VideoActivity, {
            videoId: videoId,
            userId: userId,
            type: VideoActivityType.LIKE
          });

          await queryRunner.manager.decrement(Video, {
            id: videoId
          }, "likes", 1)
        }
      }

      await queryRunner.commitTransaction();
      return true;
    }
    catch (err) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      this.logger.error(`Error like video: ${err}`);
      throw err;
    }
    finally {
      await queryRunner.release();
    }
  }

  async dislikeVideo(videoId: string, userId: string, remove: boolean = false): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await this._checkActivityVideo(videoId, userId);

      const activity = await this.videoActivityRepo.findOne({
        where: {
          videoId: videoId,
          userId: userId,
          type: VideoActivityType.DISLIKE
        }
      })

      if (!remove) {
        if (!activity) {
          await queryRunner.manager.save(new VideoActivity({
            videoId: videoId,
            userId: userId,
            type: VideoActivityType.DISLIKE
          }))

          await queryRunner.manager.increment(Video, {
            id: videoId
          }, "dislikes", 1)

          await this._deleteActivity(videoId, userId, VideoActivityType.LIKE, queryRunner);
        }
      }
      else {
        if (activity) {
          await queryRunner.manager.delete(VideoActivity, {
            videoId: videoId,
            userId: userId,
            type: VideoActivityType.DISLIKE
          });

          await queryRunner.manager.decrement(Video, {
            id: videoId
          }, "dislikes", 1)
        }
      }

      await queryRunner.commitTransaction();
      return true;
    }
    catch (err) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      this.logger.error(`Error like video: ${err}`);
      throw err;
    }
    finally {
      await queryRunner.release();
    }
  }

  async getYoutubeMetadata(yUrl: string): Promise<any> {
    const url = new URL(yUrl);
    return await yts({ videoId: url.searchParams.get('v') });
  }

  private async _checkActivityVideo(videoId: string, userId: string) {
    const video = await this.videoRepo.findOne({
      where: {
        id: videoId
      }
    })

    if (!video) {
      throw new NotFoundException({
        message: 'video.error.NOT_FOUND'
      });
    }

    const user = await this._getUser(userId);
    if (!user) {
      throw new NotFoundException({
        message: 'user.error.NOT_FOUND',
      });
    }
  }

  private async _deleteActivity(videoId: string, userId: string, type: string, queryRunner: QueryRunner) {
    const activity = await this.videoActivityRepo.findOne({
      where: {
        videoId: videoId,
        userId: userId,
        type: type
      }
    })

    if (activity) {
      await queryRunner.manager.delete(VideoActivity, {
        videoId: videoId,
        userId: userId,
        type: type
      });

      const field = type == VideoActivityType.LIKE ? 'likes' : 'dislikes';

      await queryRunner.manager.decrement(Video, {
        id: videoId
      }, field, 1)
    }
  }

  private async _getVideoByUrl(url: string): Promise<Video> {
    return await this.videoRepo.findOne({
      where: {
        url: url
      }
    })
  }

  private async _getUser(userId: string): Promise<User> {
    return await this.userRepo.findOne({
      where: {
        id: userId
      }
    })
  }

}

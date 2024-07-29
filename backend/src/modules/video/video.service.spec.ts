import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from './video.service';
import { Repository, DataSource, QueryRunner } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm';
import { Video, VideoActivity, User } from '@/entities';
import { ConfigService } from '@nestjs/config';
import { NotificationQueue, PubSubChannel } from '@/notification/notification.queue';
import { NotificationGateway } from '@/notification/notification.gateway';
import { SearchVideoRequestDto } from './dto'



export const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(() => ({
  createQueryRunner: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    startTransaction: jest.fn(),
    release: jest.fn(),
    rollbackTransaction: jest.fn(),
    manager: {
      getRepository: jest.fn().mockImplementation(() => ({
        create: jest.fn(),
        findOne: jest.fn(),
      })),
      save: jest.fn(),
    },
  })),
}),
);

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('VideoService', () => {
  let service: VideoService;
  let videoRepo: Repository<Video>;
  let userRepo: Repository<User>;
  let videoActivityRepo: Repository<VideoActivity>;
  let notificationQueue: NotificationQueue;
  let dataSource: MockType<DataSource>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoService,
        ConfigService,
        NotificationGateway,
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory
        },
        {
          provide: getRepositoryToken(Video),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn()
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn()
          },
        },
        {
          provide: getRepositoryToken(VideoActivity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn()
          }
        },
        {
          provide: NotificationQueue,
          useValue: {
            publishToChannel: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<VideoService>(VideoService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    videoRepo = module.get<Repository<Video>>(getRepositoryToken(Video));
    videoActivityRepo = module.get<Repository<VideoActivity>>(getRepositoryToken(VideoActivity));
    notificationQueue = module.get<NotificationQueue>(NotificationQueue);
    dataSource = module.get(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get youtube metadata', async () => {
    const result = await service.getYoutubeMetadata('https://www.youtube.com/watch?v=9tuZcqTGbhY');
    expect(result).toBeDefined();
    expect(result.videoId).toEqual("9tuZcqTGbhY");

  });

  it('should search video', async () => {
    const repoSpy = jest
      .spyOn(videoRepo, 'findAndCount')
      .mockResolvedValue([[mockVideoEntity], mockTotalVideos]);

    const result = await service.searchVideo(new SearchVideoRequestDto());
    expect(result).toBeDefined();
    expect(result.items).toHaveLength(mockTotalVideos);
    expect(result.total).toEqual(mockTotalVideos);
  });

  it('should get video detail successful', async () => {
    const repoSpy = jest
      .spyOn(videoRepo, 'findOne')
      .mockResolvedValue(mockVideoEntity);

    const result = await service.getVideo(mockVideoEntity.id);
    expect(result).toBeDefined();
    expect(result).toEqual(expect.objectContaining(mockVideoEntity));
    expect(repoSpy).toHaveBeenCalledWith({
      where: {
        id: mockVideoEntity.id
      },
    });
  });

  it('should get video detail fail due to videoId not exists', async () => {
    const repoSpy = jest
      .spyOn(videoRepo, 'findOne')
      .mockResolvedValue(null);

    await expect(service.getVideo(mockVideoEntity.id)).rejects.toThrow("video.error.NOT_FOUND");
    expect(repoSpy).toHaveBeenCalledWith({
      where: {
        id: mockVideoEntity.id
      },
    });
  });

  it('should share video', async () => {
    const repoVideoSpy = jest
      .spyOn(videoRepo, 'findOne')
      .mockResolvedValue(null);
    const repoUserSpy = jest
      .spyOn(userRepo, 'findOne')
      .mockResolvedValue(mockUserEntity);

    jest
      .spyOn(videoRepo, 'save')
      .mockResolvedValue(mockVideoEntity);
    jest
      .spyOn(notificationQueue, 'publishToChannel')
      .mockResolvedValue({} as never);

    const result = await service.shareVideo(mockVideoEntity.url, mockUserEntity.id);
    expect(result).toBeDefined();
    expect(result).toEqual(expect.objectContaining(mockVideoEntity));
    expect(repoVideoSpy).toHaveBeenCalledWith({
      where: {
        url: mockVideoEntity.url
      },
    });
    expect(repoUserSpy).toHaveBeenCalledWith({
      where: {
        id: mockUserEntity.id
      },
    });
  });

  it('should share video fail due to video exists', async () => {
    const repoVideoSpy = jest
      .spyOn(videoRepo, 'findOne')
      .mockResolvedValue(mockVideoEntity);
    const repoUserSpy = jest
      .spyOn(userRepo, 'findOne')
      .mockResolvedValue(mockUserEntity);

    await expect(service.shareVideo(mockVideoEntity.url, mockUserEntity.id)).rejects.toThrow("video.error.VIDEO_EXISTS");

    expect(repoVideoSpy).toHaveBeenCalledWith({
      where: {
        url: mockVideoEntity.url
      },
    });

  });


  it('should share video fail due to user don`t exists', async () => {
    const repoVideoSpy = jest
      .spyOn(videoRepo, 'findOne')
      .mockResolvedValue(null);
    const repoUserSpy = jest
      .spyOn(userRepo, 'findOne')
      .mockResolvedValue(null);

    await expect(service.shareVideo(mockVideoEntity.url, mockUserEntity.id)).rejects.toThrow("user.error.NOT_FOUND");

    expect(repoVideoSpy).toHaveBeenCalledWith({
      where: {
        url: mockVideoEntity.url
      },
    });
    expect(repoUserSpy).toHaveBeenCalledWith({
      where: {
        id: mockUserEntity.id
      },
    });
  });

});

const mockTotalVideos = 1;
const mockVideoEntity: Video = {
  id: 'uuid',
  createdAt: new Date(),
  updatedAt: new Date(),
  yId: '9tuZcqTGbhY',
  url: 'https://www.youtube.com/watch?v=9tuZcqTGbhY',
  title: 'title',
  thumbnail: 'thumbnail',
  description: 'description',
  views: 0,
  likes: 0,
  dislikes: 0,
  userId: 'userId',
  toJSON() {
    return {
    }
  },
  user: null
}


const mockUserEntity: User = {
  id: 'uuid',
  email: 'email',
  userName: 'userName',
  fullName: 'fName',
  status: 'status',
  password: 'password',
  createdAt: new Date(),
  updatedAt: new Date(),
  hashPassword() {
    return 'hashPassword';
  },
  toJSON() {
    return {
    }
  },
};

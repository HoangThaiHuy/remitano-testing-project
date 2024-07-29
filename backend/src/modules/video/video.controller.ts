import {
  Body, Controller, Get, Param, Post, Put, Delete, Query, Request, UseGuards,
  NotFoundException, BadRequestException, InternalServerErrorException, ParseIntPipe, Logger,
  DefaultValuePipe, UseInterceptors
} from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiQuery
} from '@nestjs/swagger';
import { JwtGuard } from '@/common/guard'
import { Paging, ApiBaseResponse, ApiBaseResponseArray, ApiPagingResponse } from '@/common/response/dto';
import { User, Video } from '@/entities';
import { SearchVideoRequestDto, ShareVideoRequestDto } from './dto'
import { VideoService } from './video.service'


@ApiTags('videos')
@Controller('videos')
export class VideoController {


  constructor(private readonly videoService: VideoService) {
  }

  @Get('/')
  @ApiPagingResponse(Video)
  async activity(@Query() query: SearchVideoRequestDto) {
    const result = await this.videoService.searchVideo(query);
    return new Paging(result.items, query.limit, query.offset, query.offset + result.items.length, result.total);
  }

  @Get('/:id')
  @ApiBaseResponse(Video)
  async detail(@Param('id') id: string) {
    return await this.videoService.getVideo(id);
  }

  @Post('/share-video')
  @ApiBaseResponse(Video)
  @UseGuards(JwtGuard)
  @ApiBearerAuth('accessToken')
  async shareVideo(@Request() req, @Body() body: ShareVideoRequestDto) {
    console.log('xxxx', body, req.user);
    return await this.videoService.shareVideo(body.url, req.user.id);
  }

  @Post('/:id/like')
  @ApiBaseResponse(Boolean)
  @UseGuards(JwtGuard)
  @ApiBearerAuth('accessToken')
  async like(@Request() req, @Param('id') id: string, @Query('remove') remove: boolean) {
    return await this.videoService.likeVideo(id, req.user.id, remove);
  }

  @Post('/:id/dislike')
  @ApiBaseResponse(Boolean)
  @UseGuards(JwtGuard)
  @ApiBearerAuth('accessToken')
  async dislike(@Request() req, @Param('id') id: string, @Query('remove') remove: boolean) {
    return await this.videoService.dislikeVideo(id, req.user.id, remove);
  }
}

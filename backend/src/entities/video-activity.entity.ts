import { BeforeInsert, JoinColumn, Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '@/entities/abstract.entity';
import { Expose, Exclude } from 'class-transformer';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { User, Video } from ".";
import { VideoActivityType } from './value-object';

@Entity('video_activities')
export class VideoActivity extends AbstractEntity<VideoActivity> {
  @Column({
    type: 'uuid',
    name: 'user_id',
    nullable: false
  })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: "user_id" })
  public user: User

  @ApiProperty({ name: 'video_id' })
  @Expose({ name: 'video_id' })
  @Column({
    type: 'uuid',
    name: 'video_id',
    nullable: false
  })
  public videoId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: "video_id" })
  public video: Video


  @ApiProperty()
  @Column({
    length: 16,
    name: 'type',
    nullable: false,
    default: VideoActivityType.LIKE,
  })
  public type: string;

}
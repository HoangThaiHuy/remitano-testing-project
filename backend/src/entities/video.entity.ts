import { BeforeInsert, JoinColumn, Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '@/entities/abstract.entity';
import { Expose, Exclude } from 'class-transformer';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { User } from ".";

@Entity('videos')
export class Video extends AbstractEntity<Video> {

  @ApiProperty({ name: 'user_id' })
  @Column({
    type: 'uuid',
    name: 'user_id',
    nullable: false
  })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: "user_id" })
  public user: User

  @ApiProperty({ name: 'y_id' })
  @Expose({ name: 'y_id' })
  @Column({
    length: 256,
    name: 'y_id',
    nullable: false,
    default: null,
    unique: true
  })
  public yId: string;

  @ApiProperty()
  @Column({
    length: 256,
    name: 'url',
    nullable: false,
    default: null,
  })
  public url: string;

  @ApiProperty({ name: 'title' })
  @Expose({ name: 'title' })
  @Column({
    length: 1024,
    name: 'title',
    nullable: true
  })
  public title?: string

  @ApiProperty({ name: 'thumbnail' })
  @Expose({ name: 'thumbnail' })
  @Column({
    length: 256,
    name: 'thumbnail',
    nullable: true
  })
  public thumbnail?: string

  @ApiProperty({ name: 'description' })
  @Expose({ name: 'description' })
  @Column({
    type: 'text',
    name: 'description',
    nullable: true
  })
  public description?: string

  @ApiProperty({ name: 'views' })
  @Expose({ name: 'views' })
  @Column({
    type: 'decimal',
    name: 'views',
    default: 0
  })
  public views: number

  @ApiProperty({ name: 'likes' })
  @Expose({ name: 'likes' })
  @Column({
    type: 'decimal',
    name: 'likes',
    default: 0
  })
  public likes: number

  @ApiProperty({ name: 'dislikes' })
  @Expose({ name: 'dislikes' })
  @Column({
    type: 'decimal',
    name: 'dislikes',
    default: 0
  })
  public dislikes: number

}
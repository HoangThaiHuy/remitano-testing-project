import { BeforeInsert, JoinColumn, JoinTable, Column, Entity, Index, ManyToMany, OneToMany, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { OtpType } from './value-object';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from "./";


@Entity('otps')
export class Otp extends AbstractEntity<Otp> {

  @ApiProperty()
  @Column({
    length: 128,
    name: 'code',
    nullable: false
  })
  public code: string

  @ApiProperty()
  @Column({
    length: 256,
    name: 'secret_key',
    nullable: true
  })
  public secretKey: string

  @ApiProperty()
  @Column({
    name: 'used',
    default: false
  })
  public used: boolean

  @ApiProperty({ name: 'expire_at' })
  @Expose({ name: 'expire_at' })
  @Column({
    type: 'integer',
    name: 'expire_at',
    default: 0
  })
  public expireAt: number

  @ApiProperty({ name: 'type' })
  @Column({
    length: 32,
    name: 'type',
    default: OtpType.REGISTER,
  })
  public type: string

  @Column({
    type: 'uuid',
    name: 'user_id',
    nullable: false
  })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: "user_id" })
  public user: User

}
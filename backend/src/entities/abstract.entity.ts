import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Exclude, Expose, instanceToPlain } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export abstract class AbstractEntity<T> {
  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  public id: string

  @ApiProperty({ name: 'created_at' })
  @Expose({ name: 'created_at' })
  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'created_at'
  })
  public createdAt: Date

  @Expose({ name: 'updated_at' })
  @ApiProperty({ name: 'updated_at' })
  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'updated_at',
  })
  public updatedAt: Date

  toJSON() {
    return instanceToPlain(this)
  }
}

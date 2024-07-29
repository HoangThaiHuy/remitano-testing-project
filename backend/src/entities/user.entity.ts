import { BeforeInsert, Column, Entity, Index, ManyToMany, OneToMany } from 'typeorm';
import { AbstractEntity } from '@/entities/abstract.entity';
import { UserStatus } from './value-object';
import { Expose, Exclude } from 'class-transformer';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { hashPassword } from '@/common/password';

@Entity('users')
export class User extends AbstractEntity<User> {
  @ApiProperty({ name: 'user_name' })
  @Index()
  @Expose({ name: 'user_name' })
  @Column({
    unique: true,
    length: 64,
    name: 'user_name',
    nullable: false,
  })
  public userName!: string;

  @ApiProperty()
  @Index()
  @Column({
    unique: true,
    length: 64,
    name: 'email',
    nullable: false,
  })
  public email!: string;

  @ApiProperty({ name: 'full_name' })
  @Index()
  @Expose({ name: 'full_name' })
  @Column({
    length: 64,
    name: 'full_name',
    nullable: true,
  })
  public fullName!: string;

  @ApiProperty()
  @Column({
    length: 1024,
    name: 'address',
    nullable: true,
  })
  public address?: string;

  @ApiProperty()
  @Column({
    length: 32,
    name: 'city',
    nullable: true,
  })
  public city?: string;

  @ApiProperty()
  @Column({
    length: 32,
    name: 'country',
    nullable: true,
  })
  public country?: string;

  @ApiProperty({ name: 'zip_code' })
  @Expose({ name: 'zip_code' })
  @Column({
    length: 32,
    name: 'zip_code',
    nullable: true,
  })
  public zipCode?: string;

  @ApiProperty()
  @Column({
    length: 32,
    name: 'phone',
    nullable: true,
  })
  public phone?: string;

  @ApiProperty()
  @Column({
    length: 256,
    name: 'image',
    nullable: true,
    default: null,
  })
  public image?: string;

  @ApiProperty()
  @Column({
    length: 32,
    name: 'status',
    nullable: false,
    default: UserStatus.INACTIVATED,
  })
  public status: string;

  @Exclude()
  @Column({
    length: 256,
    name: 'password',
    nullable: true,
  })
  public password?: string;

  @Exclude()
  @Column({
    length: 256,
    name: 'salt',
    nullable: true,
  })
  salt?: string;

  @BeforeInsert()
  hashPassword() {
    if (this.password) {
      this.password = hashPassword(
        this.password,
        parseInt(process.env.AUTH_SALT_ROUND),
      );
    }
  }

}

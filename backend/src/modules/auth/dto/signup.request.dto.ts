import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class SignupDto {
  @ApiProperty({
    title: 'email',
    format: 'string',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    title: 'password',
    format: 'string',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(8)
  @IsStrongPassword()
  password: string;

  @Expose({ name: 'confirm_password' })
  @ApiProperty({
    name: 'confirm_password',
    format: 'string',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(8)
  @IsStrongPassword()
  confirmPassword: string;

  // @ApiProperty({
  //   title: 'user_name',
  //   format: 'string',
  //   required: true,
  // })
  // @IsNotEmpty()
  // @IsString()
  // userName: string;

  // @ApiProperty({
  //   title: 'full_name',
  //   format: 'string',
  //   required: true,
  // })
  // @IsNotEmpty()
  // @IsString()
  // name: string;

  @ApiProperty({
    title: 'recaptcha',
    format: 'string',
    required: false,
  })
  @IsString()
  recaptcha?: string;
}

import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MinLength,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
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
  @MinLength(6)
  password: string;

}

import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class VerifyOtp {
  @ApiProperty({
    title: 'otp_key',
    format: 'string',
    required: true,
  })
  otp_key: string;

  @ApiProperty({
    title: 'otp',
    format: 'string',
    required: true,
  })
  otp: string;
}

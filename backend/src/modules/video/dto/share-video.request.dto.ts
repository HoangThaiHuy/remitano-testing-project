import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MinLength,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShareVideoRequestDto {
  @ApiProperty({
    title: 'url',
    format: 'string',
    required: true,
  })
  @IsString()
  url: string;
}

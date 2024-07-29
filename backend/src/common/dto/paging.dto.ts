import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsOptional,
  Min,
  Max,
  IsNumber,
  IsBoolean,
  IsString,
  IsIn,
  IsArray
} from 'class-validator'
import { Type } from 'class-transformer'


export class PagingDto {

  @ApiProperty({
    title: 'offset',
    required: true,
    description: 'position to get data'
  })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  offset: number = 0;

  @ApiProperty({
    title: 'limit',
    required: true,
    description: 'number records take data'
  })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  limit: number = 10;

}
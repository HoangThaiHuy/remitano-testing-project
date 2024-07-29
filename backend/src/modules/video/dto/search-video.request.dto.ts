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
import { PagingDto } from '@/common/dto'


export class SearchVideoRequestDto extends PagingDto {
  @ApiProperty({
    title: 'keyword',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  keyword?: string

  @ApiProperty({
    title: 'user_id',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  user_id?: string

  @ApiProperty({
    title: 'order_by',
    format: 'string',
    required: false,
    description: `Order by`
  })
  @IsOptional()
  @IsString()
  order_by?: string

  @ApiProperty({
    title: 'order_direction',
    format: 'string',
    required: false,
    description: `Order  direction`
  })
  @IsOptional()
  @IsString()
  order_direction?: string
}

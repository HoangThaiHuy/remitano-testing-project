import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PayloadDto {
  @ApiProperty({
    description: 'User Id',
  })
  @IsNotEmpty()
  readonly id: any;

  @ApiProperty({
    description: 'FullName',
  })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'email',
  })
  @IsNotEmpty()
  readonly email: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example: PayloadDto,
    description: 'Payload data',
  })
  @IsNotEmpty()
  readonly payload: PayloadDto;

  @ApiProperty({
    example: 'xxxxxxxxxx',
    description: 'AccessToken',
  })
  @IsNotEmpty()
  readonly access_token: string;

  @ApiProperty({
    example: 3600,
    description: 'ExpiresIn of AccessToken',
  })
  @IsNotEmpty()
  readonly expires_in: number;
}

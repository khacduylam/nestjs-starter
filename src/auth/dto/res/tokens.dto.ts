import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TokensDto {
  @ApiProperty()
  @Expose()
  accessToken: string;
}

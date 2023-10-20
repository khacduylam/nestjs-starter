import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
} from 'src/shared/constants/pagination.constant';
import { ApiProperty } from '@nestjs/swagger';

export class BasePagingQueryDto {
  @ApiProperty({ required: false, default: DEFAULT_PAGE })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = DEFAULT_PAGE;

  @ApiProperty({ required: false, default: DEFAULT_LIMIT, maximum: MAX_LIMIT })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(MAX_LIMIT)
  @Type(() => Number)
  limit?: number = DEFAULT_LIMIT;
}

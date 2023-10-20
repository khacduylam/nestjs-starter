import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SUCCESS } from '../constants/response-code.constant';

export class BaseObjectDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  createdAt: string;

  @ApiProperty()
  @Expose()
  updatedAt: string;
}

export class BaseResponseDto<DataType = any, MetadataType = any> {
  @ApiProperty()
  @Expose()
  code?: number = SUCCESS.code;

  @ApiProperty()
  @Expose()
  statusCode?: number = HttpStatus.OK;

  @ApiProperty()
  @Expose()
  message?: string = SUCCESS.message;

  @ApiProperty()
  @Expose()
  data?: DataType | DataType[];

  @ApiProperty()
  @Expose()
  metadata?: MetadataType;

  constructor(partial: Partial<BaseResponseDto<DataType, MetadataType>>) {
    Object.assign(this, partial);
  }
}

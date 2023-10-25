import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BaseObjectDto } from 'src/common/dtos/base.dto';

export class TodoItemDto extends BaseObjectDto {
  @ApiProperty()
  @Expose()
  content: string;
}

export class TodoDto extends BaseObjectDto {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  totalItems: number;

  @ApiProperty({ isArray: true, type: TodoItemDto })
  @Expose()
  @Type(() => TodoItemDto)
  items: TodoItemDto[];
}

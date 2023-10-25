import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiHideProperty()
  userID?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateTodoItemDto {
  @ApiHideProperty()
  userID?: number;

  @ApiHideProperty()
  todoID?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}

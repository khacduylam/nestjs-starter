import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEmail, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { BasePagingQueryDto } from 'src/shared/dtos/pagination.dto';
import { UserGender } from 'src/users/users.enum';

export class FindUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class FindUsersDto extends BasePagingQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: UserGender, enumName: 'UserGender', required: false })
  @IsOptional()
  @IsString()
  @IsIn(Object.values(UserGender))
  sex?: string;
}

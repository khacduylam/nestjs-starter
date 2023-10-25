import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { PASSWORD_PATTERN } from 'src/auth/auth.constant';

export class SignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(PASSWORD_PATTERN, {
    message:
      'Password must be at least 8 characters, at least 1 letter and 1 number',
  })
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMobilePhone('vi-VN')
  phone?: string;
}

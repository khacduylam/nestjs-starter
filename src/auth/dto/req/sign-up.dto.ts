import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { PASSWORD_PATTERN } from 'src/shared/constants/auth.constant';
import { UserGender } from 'src/users/users.enum';

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsIn(Object.values(UserGender))
  sex?: string = UserGender.UNSET;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  photoUrl: string;
}

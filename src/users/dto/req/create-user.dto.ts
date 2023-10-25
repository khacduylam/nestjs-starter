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
import { PASSWORD_PATTERN } from 'src/auth/auth.constant';
import { UserGender, UserRole } from 'src/users/users.enum';

export class CreateUserDto {
  @ApiProperty({ enum: UserRole, enumName: 'UserRole' })
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(UserRole))
  role?: string = UserRole.USER;

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
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ enum: UserGender, enumName: 'UserGender', required: false })
  @IsOptional()
  @IsString()
  @IsIn(Object.values(UserGender))
  sex?: string = UserGender.UNSET;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  photoUrl?: string;
}

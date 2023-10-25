import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PASSWORD_PATTERN } from 'src/auth/auth.constant';

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(PASSWORD_PATTERN, {
    message:
      'Password must be at least 8 characters, at least 1 letter and 1 number',
  })
  newPassword: string;
}

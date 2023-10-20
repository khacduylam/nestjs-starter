import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsMobilePhone, IsOptional, IsString } from 'class-validator';
import { UserGender } from 'src/users/users.enum';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMobilePhone('vi-VN')
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ enum: UserGender, enumName: 'UserGender', required: false })
  @IsOptional()
  @IsString()
  @IsIn(Object.values(UserGender))
  sex?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  photoUrl?: string;
}

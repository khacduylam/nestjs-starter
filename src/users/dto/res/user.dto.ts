import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseObjectDto } from 'src/shared/dtos/base.dto';

export class UserDto extends BaseObjectDto {
  @ApiProperty()
  @Expose()
  role: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  fullName: string;

  @ApiProperty()
  @Expose()
  sex: string;

  @ApiProperty()
  @Expose()
  photoUrl: string;
}

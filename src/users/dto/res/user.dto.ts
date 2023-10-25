import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { BaseObjectDto } from 'src/common/dtos/base.dto';

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
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => {
    const firstName = obj['firstName'];
    const lastName = obj['lastName'];
    if (firstName && lastName) {
      return firstName + ' ' + lastName;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    }

    return null;
  })
  fullName: string;

  @ApiProperty()
  @Expose()
  sex: string;

  @ApiProperty()
  @Expose()
  photoUrl: string;
}

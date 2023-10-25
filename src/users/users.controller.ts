import { Body, Controller, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/req/update-user.dto';
import { UserDto } from './dto/res/user.dto';
import { UsersService } from './users.service';
import { BaseObjectDto, BaseResponseDto } from 'src/common/dtos/base.dto';
import { ChangePasswordDto } from './dto/req/change-password.dto';
import { AuthUser } from 'src/common/interfaces';
import { createResponseDto } from 'src/common/utils/response.util';
import { CurrentUser } from 'src/common/decorators/auth.decorator';
import { CrudApi } from 'src/common/decorators/controller.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @CrudApi({
    swagger: {
      summary: 'Get authenticated user info',
      httpCode: HttpStatus.OK,
      successResponseOptions: { type: 'ok', cls: UserDto },
    },
    nest: { method: 'Get', path: '/me' },
  })
  async getMe(@CurrentUser() currentUser: AuthUser) {
    const user = await this.usersService.findOne(currentUser.id);
    return createResponseDto(UserDto, user);
  }

  @CrudApi({
    swagger: {
      summary: 'Update authenticated user info',
      httpCode: HttpStatus.OK,
      successResponseOptions: { type: 'ok', cls: UserDto },
    },
    nest: { method: 'Put', path: '/me' },
  })
  async updateMe(
    @CurrentUser() currentUser: AuthUser,
    @Body() reqDto: UpdateUserDto,
  ) {
    const user = await this.usersService.findOneAndUpdate(
      currentUser.id,
      reqDto,
    );
    return createResponseDto(UserDto, user);
  }

  @CrudApi({
    swagger: {
      summary: `Change authenticated user's password`,
      httpCode: HttpStatus.OK,
      successResponseOptions: { type: 'ok', cls: BaseObjectDto },
      badRequestResponseOptions: {
        type: BaseResponseDto,
        description: 'Bad Request',
      },
    },
    nest: { method: 'Put', path: '/me/change-password' },
  })
  async changePassword(
    @CurrentUser() currentUser: AuthUser,
    @Body() reqDto: ChangePasswordDto,
  ) {
    const user = await this.usersService.findOneAndChangePassword(
      { id: currentUser.id },
      reqDto,
    );
    return createResponseDto(BaseObjectDto, { id: user.id });
  }
}

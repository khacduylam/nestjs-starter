import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/req/update-user.dto';
import { UserDto } from './dto/res/user.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import { BaseObjectDto, BaseResponseDto } from 'src/core/dtos/base.dto';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { createResponseDto } from 'src/common/utils/response.util';
import { ApiCustomOkResponse } from 'src/core/decorators/swagger/custom-api-ok-response.decorator';
import { AuthUser } from 'src/core/entities/auth-user.entity';
import { ChangePasswordDto } from './dto/req/change-password.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get authenticated user info' })
  @ApiCustomOkResponse(UserDto)
  @ApiUnauthorizedResponse({
    type: BaseResponseDto,
    description: 'Unauthoried',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Get('/me')
  async getMe(@CurrentUser() currentUser: AuthUser) {
    const user = await this.usersService.findOneByID(currentUser.id);
    return createResponseDto(UserDto, user);
  }

  @ApiOperation({ summary: 'Update authenticated user info' })
  @ApiCustomOkResponse(UserDto)
  @ApiUnauthorizedResponse({
    type: BaseResponseDto,
    description: 'Unauthoried',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Put('/me')
  async updateMe(
    @CurrentUser() currentUser: User,
    @Body() reqDto: UpdateUserDto,
  ) {
    const user = await this.usersService.findOneByIDAndUpdate(
      currentUser.id,
      reqDto,
    );
    return createResponseDto(UserDto, user);
  }

  @ApiOperation({ summary: `Change authenticated user's password` })
  @ApiCustomOkResponse(BaseObjectDto)
  @ApiBadRequestResponse({
    type: BaseResponseDto,
    description: 'Bad Request',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Put('/me/change-password')
  async changePassword(
    @CurrentUser() currentUser: User,
    @Body() reqDto: ChangePasswordDto,
  ) {
    const user = await this.usersService.findOneByIDAndChangePassword(
      currentUser.id,
      reqDto,
    );
    return createResponseDto(BaseObjectDto, { id: user.id });
  }
}

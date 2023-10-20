import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { ApiCustomOkResponse } from 'src/shared/decorators/swagger/custom-api-ok-response.decorator';
import { BaseResponseDto } from 'src/shared/dtos/base.dto';
import { createResponseDto } from 'src/shared/utils/response.util';
import { UpdateUserDto } from './dto/req/update-user.dto';
import { UserDto } from './dto/res/user.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';

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
  async getMe(@CurrentUser() currentUser: User) {
    return createResponseDto(UserDto, currentUser);
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
}

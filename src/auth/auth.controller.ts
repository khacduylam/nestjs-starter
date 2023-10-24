import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CREATED, SUCCESS } from 'src/core/constants/response-code.constant';
import { Public } from 'src/core/decorators/public.decorator';
import { ApiCustomCreatedResponse } from 'src/core/decorators/swagger/custom-api-created-response.decorator';
import { ApiCustomOkResponse } from 'src/core/decorators/swagger/custom-api-ok-response.decorator';
import { BaseResponseDto } from 'src/core/dtos/base.dto';
import { createResponseDto } from 'src/common/utils/response.util';
import { UserDto } from 'src/users/dto/res/user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/req/sign-in.dto';
import { SignUpDto } from './dto/req/sign-up.dto';
import { TokensDto } from './dto/res/tokens.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up a new account' })
  @ApiBadRequestResponse({
    description: 'Email is already existed',
    type: BaseResponseDto,
  })
  @ApiCustomCreatedResponse(UserDto)
  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('/signup')
  async signup(@Body() reqDto: SignUpDto) {
    const user = await this.authService.signup(reqDto);

    return createResponseDto(UserDto, user, CREATED);
  }

  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiBadRequestResponse({
    description: 'Email or password is incorrect',
    type: BaseResponseDto,
  })
  @ApiCustomOkResponse(TokensDto)
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('/signin')
  async signin(@Body() reqDto: SignInDto) {
    const accessToken = await this.authService.signin(reqDto);

    return createResponseDto(TokensDto, { accessToken }, SUCCESS);
  }
}

import { Controller, Body, HttpStatus } from '@nestjs/common';
import { CREATED, SUCCESS } from 'src/common/constants/response-code.constant';
import { BaseResponseDto } from 'src/common/dtos/base.dto';
import { UserDto } from 'src/users/dto/res/user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/req/sign-in.dto';
import { SignUpDto } from './dto/req/sign-up.dto';
import { TokensDto } from './dto/res/tokens.dto';
import { createResponseDto } from 'src/common/utils/response.util';
import { CrudApi } from 'src/common/decorators/controller.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @CrudApi({
    swagger: {
      summary: 'Sign up a new account',
      httpCode: HttpStatus.CREATED,
      successResponseOptions: { type: 'created', cls: UserDto },
      badRequestResponseOptions: {
        type: BaseResponseDto,
        description: 'Bad Request',
      },
    },
    nest: { method: 'Post', path: '/signup', isPublic: true },
  })
  async signup(@Body() reqDto: SignUpDto) {
    const user = await this.authService.signup(reqDto);

    return createResponseDto(UserDto, user, CREATED);
  }

  @CrudApi({
    swagger: {
      summary: 'Sign in with email and password',
      httpCode: HttpStatus.OK,
      successResponseOptions: { type: 'ok', cls: TokensDto },
      badRequestResponseOptions: {
        type: BaseResponseDto,
        description: 'Bad Request',
      },
    },
    nest: { method: 'Post', path: '/signin', isPublic: true },
  })
  async signin(@Body() reqDto: SignInDto) {
    const accessToken = await this.authService.signin(reqDto);

    return createResponseDto(TokensDto, { accessToken }, SUCCESS);
  }
}

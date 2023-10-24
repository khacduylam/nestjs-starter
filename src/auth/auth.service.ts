import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  USER_EMAIL_EXISTED,
  USER_EMAIL_OR_PASSWORD_IS_INCORRECT,
} from 'src/core/constants/response-code.constant';
import { CreateUserDto } from 'src/users/dto/req/create-user.dto';
import { FindUserDto } from 'src/users/dto/req/find-users.dto';
import { User } from 'src/users/entities/users.entity';
import { UserRole } from 'src/users/users.enum';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './auth.guard';
import { SignInDto } from './dto/req/sign-in.dto';
import { SignUpDto } from './dto/req/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  private async generateToken(user: User) {
    const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN');

    const jwtPayload: JwtPayload = { id: user.id };
    const token = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: jwtExpiresIn,
    });

    return token;
  }

  async signup(reqDto: SignUpDto) {
    // Check if email existed
    const findUserDto: FindUserDto = { email: reqDto.email };
    let user = await this.usersService.findOne(findUserDto);
    if (user) {
      throw new BadRequestException(USER_EMAIL_EXISTED);
    }

    // Save user
    const createUserDto: CreateUserDto = {
      role: UserRole.USER,
      email: reqDto.email,
      password: reqDto.password,
    };
    user = await this.usersService.createOne(createUserDto);

    return user;
  }

  async signin(reqDto: SignInDto) {
    // Check if email existed
    const findUserDto: FindUserDto = { email: reqDto.email };
    let user = await this.usersService.findOne(findUserDto);
    if (!user) {
      throw new BadRequestException(USER_EMAIL_OR_PASSWORD_IS_INCORRECT);
    }

    // Check password
    const matches = await this.usersService.comparePasswords(
      user,
      reqDto.password,
    );
    if (!matches) {
      throw new NotFoundException(USER_EMAIL_OR_PASSWORD_IS_INCORRECT);
    }

    // Generate token
    const accessToken = await this.generateToken(user);

    return accessToken;
  }
}

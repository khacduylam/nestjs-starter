import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';
import {
  INVALID_TOKEN,
  UNAUTHORIZED,
} from 'src/common/constants/response-code.constant';
import { ConfigService } from '@nestjs/config';
import { CustomRequest, JwtPayload } from 'src/common/interfaces';
import { UserRole } from 'src/users/users.enum';
import { IS_PUBLIC_KEY } from '../auth.constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  private extractBearerTokenFromHttpHeaders(request: CustomRequest) {
    const rawToken =
      (request.headers['authorization'] || request.headers['Authorization']) +
      '';
    if (!rawToken) {
      return null;
    }

    const [tokenType, token] = rawToken.split(/\s+/);
    if (tokenType !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<CustomRequest>();

    // Ignore auth if route is public
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());

    if (isPublic) {
      request.isPublic = true;
      return true;
    }

    // Verify and attach auth user to request
    const token = this.extractBearerTokenFromHttpHeaders(request);
    if (!token) {
      throw new UnauthorizedException(INVALID_TOKEN);
    }

    let jwtPayload: JwtPayload = null;
    try {
      const jwtSecretKey = this.configService.get<string>('JWT_SECRET_KEY');
      jwtPayload = this.jwtService.verify<JwtPayload>(token, {
        secret: jwtSecretKey,
      });
    } catch (err) {
      throw new UnauthorizedException(UNAUTHORIZED);
    }
    if (!jwtPayload) {
      throw new UnauthorizedException(UNAUTHORIZED);
    }

    // Get user from db
    const user = await this.usersService.findOne(jwtPayload.id);
    if (!user) {
      throw new UnauthorizedException(UNAUTHORIZED);
    }

    request.user = {
      id: jwtPayload.id,
      role: user.role as UserRole,
      email: user.email,
    };

    return true;
  }
}

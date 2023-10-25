import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { IS_PUBLIC_KEY, ROLES_KEY } from 'src/auth/auth.constant';
import { UserRole } from 'src/users/users.enum';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const AllowedRoles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_KEY, roles);

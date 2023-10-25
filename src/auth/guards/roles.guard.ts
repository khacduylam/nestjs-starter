import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/users/users.enum';
import { ROLES_KEY } from '../auth.constant';
import { CustomRequest } from 'src/common/interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (Array.isArray(allowedRoles) && allowedRoles.length) {
      const { user }: CustomRequest = context.switchToHttp().getRequest();
      if (!user) {
        return false;
      }

      return allowedRoles.some((role) => role === user.role);
    }

    return true;
  }
}

import { Request } from 'express';
import { UserRole } from 'src/users/users.enum';

export interface JwtPayload {
  id: number;
}

export interface AuthUser extends JwtPayload {
  email: string;
  role: UserRole;
}

export interface CustomRequest extends Request {
  user?: AuthUser;
  isPublic?: boolean;
  roles?: UserRole[];
}

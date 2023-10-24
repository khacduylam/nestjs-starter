import { Request } from 'express';
import { AuthUser } from '../entities/auth-user.entity';

export interface CustomRequest extends Request {
  user?: AuthUser;
  isPublic?: boolean;
}

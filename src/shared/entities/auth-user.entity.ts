export class AuthUser {
  id: number;
  role: string;
  email: string;

  constructor(partial: Partial<AuthUser>) {
    Object.assign(this, partial);
  }
}

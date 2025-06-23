import { IUser } from '../../users/interfaces/user.interface';

export interface IAuthPayload {
  sub: string;
  email: string;
}

export interface IAuthResponse {
  access_token: string;
  user: Omit<IUser, 'password'>;
}

export interface IAuthService {
  validateUser(
    email: string,
    password: string,
  ): Promise<Omit<IUser, 'password'> | null>;
  login(email: string, password: string): Promise<IAuthResponse>;
  register(
    userData: Omit<IUser, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<IAuthResponse>;
  generateToken(payload: IAuthPayload): string;
}

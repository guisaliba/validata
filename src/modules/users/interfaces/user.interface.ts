import { UserType } from '../../auth/dto/register.dto';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  type: UserType;
  created_at: Date;
  updated_at: Date;
}

export interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(user: Omit<IUser, 'id' | 'created_at' | 'updated_at'>): Promise<IUser>;
  update(id: string, user: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<void>;
}

export interface IUserService {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(user: Omit<IUser, 'id' | 'created_at' | 'updated_at'>): Promise<IUser>;
  update(id: string, user: Partial<IUser>): Promise<IUser>;
  delete(id: string): Promise<void>;
}

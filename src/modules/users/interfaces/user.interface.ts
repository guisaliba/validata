import { UserType } from '../../auth/dto/register.dto';

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  type: UserType;
  created_at: Date;
  updated_at: Date;
}

export interface IUserRepository {
  findById(id: number): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(user: Omit<IUser, 'id' | 'created_at' | 'updated_at'>): Promise<IUser>;
  update(id: number, user: Partial<IUser>): Promise<IUser | null>;
  delete(id: number): Promise<void>;
}

export interface IUserService {
  findById(id: number): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(user: Omit<IUser, 'id' | 'created_at' | 'updated_at'>): Promise<IUser>;
  update(id: number, user: Partial<IUser>): Promise<IUser>;
  delete(id: number): Promise<void>;
}

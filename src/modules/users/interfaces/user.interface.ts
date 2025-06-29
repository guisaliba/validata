import type { Sale } from 'src/modules/sales/entities/sale.entity';
import { UserType } from '../../auth/dto/register.dto';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  type: UserType;
  created_at: Date;
  updated_at: Date;
  sales?: Sale[];
}

export interface IUserRepository {
  findAll(): Promise<IUser[]>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(user: Omit<IUser, 'id' | 'created_at' | 'updated_at'>): Promise<IUser>;
  update(id: string, user: Partial<IUser>): Promise<IUser | null>;
  save(user: IUser): Promise<IUser>;
  remove(user: IUser): Promise<void>;
}

export interface IUserService {
  findAll(): Promise<IUser[]>;
  findById(id: string): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  create(user: Omit<IUser, 'id' | 'created_at' | 'updated_at'>): Promise<IUser>;
  update(id: string, user: Partial<IUser>): Promise<IUser>;
  delete(id: string): Promise<void>;
}

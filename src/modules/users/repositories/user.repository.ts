import { Injectable } from '@nestjs/common';
import { IUserRepository, IUser } from '../interfaces/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findById(id: number): Promise<IUser | null> {
    return this.repository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.repository.findOneBy({ email });
  }

  async create(
    userData: Omit<IUser, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<IUser> {
    const user = this.repository.create(userData as User);
    return this.repository.save(user);
  }

  async update(id: number, userData: Partial<IUser>): Promise<IUser | null> {
    await this.repository.update(id, userData);

    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

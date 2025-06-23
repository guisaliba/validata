import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { BaseRepository } from 'src/common/base-repository';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import type { IUser, IUserRepository } from '../interfaces/user.interface';

@Injectable({ scope: Scope.REQUEST })
export class UserRepository extends BaseRepository implements IUserRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async findById(id: string): Promise<IUser | null> {
    return this.getRepository(User).findOneBy({ id });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.getRepository(User).findOneBy({ email });
  }

  async create(
    userData: Omit<
      User,
      'id' | 'created_at' | 'updated_at' | 'stocks' | 'sales'
    >,
  ): Promise<User> {
    const userRepo = this.getRepository(User);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const newUser = userRepo.create(userData) as User;

    return userRepo.save(newUser);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const userRepo = this.getRepository(User);
    const userToUpdate = await userRepo.preload({
      id: id,
      ...userData,
    });

    if (!userToUpdate) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return userRepo.save(userToUpdate);
  }

  async delete(id: string) {
    await this.getRepository(User).delete({ id });
  }
}

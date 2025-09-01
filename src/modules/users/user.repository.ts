import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { BaseRepository } from '../../common/base-repository';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import type { IUser, IUserRepository } from './interfaces/user.interface';

@Injectable({ scope: Scope.REQUEST })
export class UserRepository extends BaseRepository implements IUserRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async findAll(): Promise<IUser[]> {
    return this.getRepository(User).find();
  }

  async findById(id: string): Promise<IUser | null> {
    return this.getRepository(User).findOneBy({ id });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.getRepository(User).findOneBy({ email });
  }

  async create(
    userData: Omit<IUser, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<IUser> {
    const userRepo = this.getRepository(User);
    const newUser = userRepo.create(userData);

    return userRepo.save(newUser);
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    const userRepo = this.getRepository(User);
    const userToUpdate = await userRepo.preload({
      id: id,
      ...userData,
    });

    if (!userToUpdate) {
      return null;
    }

    return userRepo.save(userToUpdate);
  }

  async save(user: User): Promise<User> {
    return this.getRepository(User).save(user);
  }

  async remove(user: User): Promise<void> {
    await this.getRepository(User).remove(user);
  }
}

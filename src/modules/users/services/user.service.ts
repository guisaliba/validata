import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { IUserService, IUser } from '../interfaces/user.interface';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found.`);
    }

    return user;
  }

  async findAll(): Promise<IUser[]> {
    const users = await this.userRepository.findAll();

    return users;
  }

  async create(
    userData: Omit<IUser, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<IUser> {
    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new ConflictException(
        `Email ${userData.email} has already been registered`,
      );
    }

    return this.userRepository.create(userData);
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUser> {
    const updatedUser = await this.userRepository.update(id, userData);

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);

    await this.userRepository.remove(user as User);
  }
}

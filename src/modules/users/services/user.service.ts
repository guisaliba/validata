import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { IUserService, IUser } from '../interfaces/user.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: number): Promise<IUser | null> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(
    userData: Omit<IUser, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<IUser> {
    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    return this.userRepository.create(userData);
  }

  async update(id: number, userData: Partial<IUser>): Promise<IUser> {
    const updatedUser = await this.userRepository.update(id, userData);

    if (!updatedUser) throw new NotFoundException('Usuário não encontrado');

    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await this.userRepository.delete(id);
  }
}

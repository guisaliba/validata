import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../user/services/user.service';
import {
  IAuthService,
  IAuthPayload,
  IAuthResponse,
} from '../interfaces/auth.interface';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/modules/user/interfaces/user.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(email: string, password: string): Promise<IAuthResponse> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload: IAuthPayload = { sub: user.id, email: user.email };
    return {
      access_token: this.generateToken(payload),
      user,
    };
  }

  async register(
    userData: Omit<IUser, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<IAuthResponse> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });

    const payload: IAuthPayload = { sub: user.id, email: user.email };
    return {
      access_token: this.generateToken(payload),
      user,
    };
  }

  generateToken(payload: IAuthPayload): string {
    return this.jwtService.sign(payload);
  }
}

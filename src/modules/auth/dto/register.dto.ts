import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export enum UserType {
  ADMIN = 'admin',
  USER = 'user',
}

export class RegisterDto {
  @IsString({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsEnum(UserType, { message: 'Tipo de usuário inválido' })
  type: UserType;
}

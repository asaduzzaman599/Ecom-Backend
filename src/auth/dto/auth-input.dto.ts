import { PartialType } from '@nestjs/mapped-types';
import { User } from '@prisma/client';

export class CreateAuthDto {
  phone: string;
  email: string;
  password: string;
  userId: string;
  role: User['role'];
  requiredPasswordChange?: boolean;
}

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}

export class LoginDto {
  phone: number;
  password: string;
}

export class SignupDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  password: string;
  role: User['role'];
  image?: string;
  requiredPasswordChange?: boolean;
}
export class ResetPasswordDto {
  phone: string;
  oldPassword: string;
  newPassword: string;
}

export class UpdatePasswordDto {
  newPassword: string;
  oldPassword: string;
}

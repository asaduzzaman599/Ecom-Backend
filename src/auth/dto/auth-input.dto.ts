import { PartialType } from '@nestjs/mapped-types';
import { User } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

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
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  password: string;

  role: User['role'];
  image?: string;

  @IsOptional()
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

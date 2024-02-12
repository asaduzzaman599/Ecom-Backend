import { PartialType } from '@nestjs/mapped-types'
import { User } from '@prisma/client';

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
}

export class CreateAdminDto extends PartialType(SignupDto) {
  requiredPasswordChange?: boolean;
}

export class UpdatePasswordDto {
  phone: number;
  newPassword: string;
  oldPassword: string;
}

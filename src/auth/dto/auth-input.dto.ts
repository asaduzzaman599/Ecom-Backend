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

export class CreateAdminDto extends SignupDto {
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

import { User } from '@prisma/client';

export class LoginDto {
  phone: number;
  password: string;
}

export class SignupDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone: number;
  password: string;
  role: User['role'];
  image?: string;
}

export class UpdatePasswordDto {
  phone: number;
  newPassword: string;
  oldPassword: string;
}

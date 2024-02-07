import { User } from '@prisma/client';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  password: string;
  role: User['role'];
  image?: string;
}

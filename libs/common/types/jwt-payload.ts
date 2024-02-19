import { Role } from '@prisma/client';

export type JWTPayload = {
  id: string;
  email: string;
  role: Role;
  phone: string;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
};

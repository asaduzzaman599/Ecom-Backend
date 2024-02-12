import type { User as UserWithPassword } from '@prisma/client';

export type User = Omit<
  UserWithPassword,
  'password' | 'requiredPasswordChange'
>;

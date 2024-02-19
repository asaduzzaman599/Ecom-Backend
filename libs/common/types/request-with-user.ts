import { User } from './User';

export type RequestWithUser = Record<string, unknown> & { user: User };

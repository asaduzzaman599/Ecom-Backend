import { SetMetadata } from '@nestjs/common';

export const Admin_ACCESS_KEY = 'Admin';
export const Admin = () => SetMetadata(Admin_ACCESS_KEY, true);

import { SetMetadata } from '@nestjs/common';

export const CUSTOMER_ACCESS_KEY = 'CUSTOMER';
export const CUSTOMER = () => SetMetadata(CUSTOMER_ACCESS_KEY, true);

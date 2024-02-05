import { SetMetadata } from '@nestjs/common';

export const ALL_ACCESS_KEY = 'ALL';
export const ALL = () => SetMetadata(ALL_ACCESS_KEY, true);

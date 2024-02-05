import { LocalAuthGuard } from 'libs/guards/auth-local.guard';
import { JwtAuthGuard } from 'libs/guards/jwt-auth.guards';

export const GuardProvider = [
  {
    provide: 'APP_GUARD',
    useClass: JwtAuthGuard,
  },
];

import { AdminOnlyGuard } from 'libs/guards/admin-only.guard';
import { AllAccessGuard } from 'libs/guards/all-access.guard';
import { CustomerOnlyGuard } from 'libs/guards/customer-only.guard';
import { JwtAuthGuard } from 'libs/guards/jwt-auth.guards';

export const GuardProvider = [
  {
    provide: 'APP_GUARD',
    useClass: JwtAuthGuard,
  },
  {
    provide: 'APP_GUARD',
    useClass: AdminOnlyGuard,
  },
  {
    provide: 'APP_GUARD',
    useClass: AllAccessGuard,
  },
  {
    provide: 'APP_GUARD',
    useClass: CustomerOnlyGuard,
  },
];

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { CUSTOMER_ACCESS_KEY } from 'libs/decorator/customer_access.decorator';

@Injectable()
export class CustomerOnlyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isCustomer = this.reflector.getAllAndOverride<boolean>(
      CUSTOMER_ACCESS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isCustomer) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return Role.Customer === user.role;
  }
}

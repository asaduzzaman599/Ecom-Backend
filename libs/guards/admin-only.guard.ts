import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Admin_ACCESS_KEY } from 'libs/decorator/admin_access.decorator';

@Injectable()
export class AdminOnlyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isAdmin = this.reflector.getAllAndOverride<boolean>(
      Admin_ACCESS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isAdmin) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return Role.Admin === user?.role;
  }
}

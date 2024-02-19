import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ALL_ACCESS_KEY } from 'libs/decorator/all_access.decorator';

@Injectable()
export class AllAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isAll = this.reflector.getAllAndOverride<boolean>(ALL_ACCESS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isAll) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return !!user?.role;
  }
}

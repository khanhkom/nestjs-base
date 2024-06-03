import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { AppContextProvider } from '../providers/app-context.provider';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly appContextProvider: AppContextProvider,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride(Roles, [context.getHandler(), context.getClass()]);
    if (!roles?.length) {
      return true;
    }

    const appContext = this.appContextProvider.getStore();
    const userRole = appContext?.data.user?.role;

    return roles.some((role) => role === userRole);
  }
}

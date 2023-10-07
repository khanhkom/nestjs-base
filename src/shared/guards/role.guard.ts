import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppContextProvider } from '../providers/app-context.provider';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly appContextProvider: AppContextProvider,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler()) ?? this.reflector.get(Roles, context.getClass());
    if (!roles?.length) {
      return true;
    }

    const appContext = this.appContextProvider.getStore();
    const userRole = appContext?.data.user?.role;

    return roles.some((role) => role === userRole);
  }
}

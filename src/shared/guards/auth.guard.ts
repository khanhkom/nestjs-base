import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AppContextProvider } from '../providers/app-context.provider';
import { AppException } from '../models/app-exception.model';
import { AppErrorCode } from '../models/app-error-code.model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly appContextProvider: AppContextProvider) {}

  canActivate(_context: ExecutionContext): boolean {
    const appContext = this.appContextProvider.getStore();
    if (appContext?.data?.user) {
      return true;
    }

    throw new AppException(AppErrorCode.ERR401000);
  }
}

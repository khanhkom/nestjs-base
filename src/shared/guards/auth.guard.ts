import { CanActivate, Injectable } from '@nestjs/common';
import { AppErrorCode } from '../models/app-error-code.model';
import { AppException } from '../models/app-exception.model';
import { AppContextProvider } from '../providers/app-context.provider';
import { LoggingProvider } from '../providers/logging.provider';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly appContextProvider: AppContextProvider,
    private readonly logger: LoggingProvider,
  ) {
    this.logger.setContext(AuthGuard.name);
  }

  canActivate(): boolean {
    const appContext = this.appContextProvider.getStore();
    if (appContext?.data.user) {
      return true;
    }

    throw new AppException(AppErrorCode.ERR401000);
  }
}

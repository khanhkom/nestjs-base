import { Global, Module } from '@nestjs/common';
import { AppConfigProvider } from './providers/app-config.provider';
import { AppContextProvider } from './providers/app-context.provider';
import { JwtProvider } from './providers/jwt.provider';
import { LoggingProvider } from './providers/logging.provider';
import { SqlLoggingProvider } from './providers/sql-logger.provider';
import { TranslationProvider } from './providers/translation.provider';

@Global()
@Module({
  providers: [
    AppContextProvider,
    LoggingProvider,
    SqlLoggingProvider,
    JwtProvider,
    TranslationProvider,
    AppConfigProvider,
  ],
  exports: [
    AppContextProvider,
    LoggingProvider,
    SqlLoggingProvider,
    JwtProvider,
    TranslationProvider,
    AppConfigProvider,
  ],
})
export class SharedModule {}

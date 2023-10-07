import { Global, Module } from '@nestjs/common';
import { AppContextProvider } from './providers/app-context.provider';
import { LoggerProvider } from './providers/logger.provider';
import { SqlLoggerProvider } from './providers/sql-logger.provider';
import { JwtProvider } from './providers/jwt.provider';

@Global()
@Module({
  providers: [AppContextProvider, LoggerProvider, SqlLoggerProvider, JwtProvider],
  exports: [AppContextProvider, LoggerProvider, SqlLoggerProvider, JwtProvider],
})
export class SharedModule {}

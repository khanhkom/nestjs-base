import { Logger } from 'typeorm';
import { LoggerProvider } from './logger.provider';
import { Injectable } from '@nestjs/common';
import { AppContextProvider } from './app-context.provider';

@Injectable()
export class SqlLoggerProvider extends LoggerProvider implements Logger {
  constructor(protected readonly contextProvider: AppContextProvider) {
    super(contextProvider);
    this.setContext(SqlLoggerProvider.name);
  }

  logQuery(query: string, parameters?: unknown[] | undefined): void {
    this.info('Query:', query, parameters);
  }

  logQueryError(error: string | Error, query: string, parameters?: unknown[] | undefined): void {
    this.normalError('Query Error:', query, parameters);
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[] | undefined): void {
    this.warn('Query Slow:', time, query, parameters);
  }

  logSchemaBuild(message: string): void {
    this.info('Schema Build:', message);
  }

  logMigration(message: string): void {
    this.info('Migration:', message);
  }

  log(level: 'log' | 'info' | 'warn', message: unknown): void {
    switch (level) {
      case 'log':
      case 'info':
        // this.info('Log:', message);
        break;
      case 'warn':
        this.warn('Warn:', message);
      default:
        break;
    }
  }
}

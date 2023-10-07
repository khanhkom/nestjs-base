import { ConsoleLogger as DefaultLogger, Injectable, Scope } from '@nestjs/common';
import { AppContextProvider } from './app-context.provider';
import { SENSITIVE_FIELDS } from '../constants/app.constants';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerProvider {
  private loggerInstance: DefaultLogger;

  constructor(protected readonly contextProvider: AppContextProvider) {
    this.loggerInstance = new DefaultLogger(LoggerProvider.name);
  }

  private static MASK_REGEX = new RegExp(
    SENSITIVE_FIELDS.map((field) => `(?<${field}>"${field}":".*?")`).join('|'),
    'gmi',
  );

  private static buildMaskReplacer(): (...args: unknown[]) => string {
    return (...args: unknown[]): string => {
      const namedGroups = args.pop() as object;
      const [key] = Object.entries(namedGroups).find(([, value]) => value !== undefined) as [string, unknown];
      return `"${key}":"[MASKED]"`;
    };
  }

  private static transformArgs(optionalArgs: unknown[]): string[] {
    return optionalArgs.map((arg) => {
      if (arg instanceof Error) {
        return arg.stack ?? `${arg.name}: ${arg.message}`;
      }

      if (typeof arg === 'string') {
        const needToMask = LoggerProvider.MASK_REGEX.test(arg);
        if (!needToMask) {
          return arg;
        }

        return arg.replace(LoggerProvider.MASK_REGEX, LoggerProvider.buildMaskReplacer());
      }

      if (typeof arg === 'object') {
        const str = JSON.stringify(arg);
        const needToMask = LoggerProvider.MASK_REGEX.test(str);
        if (!needToMask) {
          return str;
        }

        return str.replace(LoggerProvider.MASK_REGEX, LoggerProvider.buildMaskReplacer());
      }

      return JSON.stringify(arg);
    });
  }

  private joinArgsWithAppContext(optionalArgs: unknown[]): string {
    const appContext = this.contextProvider.getStore();
    const executionIdAppended = appContext?.executionId ? `[${appContext?.executionId}] ` : '';

    return executionIdAppended + LoggerProvider.transformArgs(optionalArgs).join(' ');
  }

  public setContext(context: string): void {
    this.loggerInstance.setContext(context);
  }

  /**
   * Use when logging information of request, response, result, step,...
   * Use normalError if logging error instead of
   */
  info(...optionalArgs: unknown[]): void {
    this.loggerInstance.log(this.joinArgsWithAppContext(optionalArgs));
  }

  /**
   * Use then logging steps of process
   * Use normalError if logging error instead of
   */
  debug(...optionalArgs: unknown[]): void {
    this.loggerInstance.debug(this.joinArgsWithAppContext(optionalArgs));
  }

  /**
   * Use when logging warning.
   */
  warn(...optionalArgs: unknown[]): void {
    optionalArgs.unshift('WARNING:');
    this.loggerInstance.warn(this.joinArgsWithAppContext(optionalArgs));
  }

  /**
   * Use when logging normal errors.
   * Use unhandledError if the error is unhandled instead of.
   */
  normalError(...optionalArgs: unknown[]): void {
    optionalArgs.unshift('NORMAL ERROR:');
    this.loggerInstance.error(this.joinArgsWithAppContext(optionalArgs));
  }

  /**
   * Only use when logging unhandled errors.
   * Use normalError if the error is normal instead of.
   */
  unhandledError(...optionalArgs: unknown[]): void {
    optionalArgs.unshift('UNHANDLED ERROR:');
    this.loggerInstance.error(this.joinArgsWithAppContext(optionalArgs));
  }
}

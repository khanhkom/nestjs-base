import { ConsoleLogger as DefaultLogger, Injectable, Scope } from '@nestjs/common';
import { SENSITIVE_REPLACEMENTS } from '../constants/app.constants';
import { AppContextProvider } from './app-context.provider';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggingProvider {
  private static SENSITIVE_REPLACEMENTS = SENSITIVE_REPLACEMENTS;
  private static CONTEXT_LENGTH = 20;

  private loggerInstance: DefaultLogger;

  constructor(protected readonly contextProvider: AppContextProvider) {
    this.loggerInstance = new DefaultLogger(LoggingProvider.name);
  }

  private static transformArgs(optionalArgs: unknown[]): string[] {
    return optionalArgs.map((arg) => {
      if (arg instanceof Error) {
        return arg.stack ?? `${arg.name}: ${arg.message}`;
      }

      if (typeof arg === 'string') {
        return LoggingProvider.SENSITIVE_REPLACEMENTS.reduce(
          (replacedStr, replacement) => replacedStr.replace(replacement.REGEX, replacement.REPLACER),
          arg,
        );
      }

      if (typeof arg === 'object') {
        const str = JSON.stringify(arg);
        return LoggingProvider.SENSITIVE_REPLACEMENTS.reduce(
          (replacedStr, replacement) => replacedStr.replace(replacement.REGEX, replacement.REPLACER),
          str,
        );
      }

      return JSON.stringify(arg);
    });
  }

  private joinArgsWithAppContext(optionalArgs: unknown[]): string {
    const appContext = this.contextProvider.getStore();
    const executionIdAppended = appContext?.executionId ? `[${appContext?.executionId}] ` : '';

    return executionIdAppended + LoggingProvider.transformArgs(optionalArgs).join(' ');
  }

  public setContext(context: string): void {
    if (context.length < LoggingProvider.CONTEXT_LENGTH) {
      const transformedContext = context.padEnd(LoggingProvider.CONTEXT_LENGTH, '+');
      this.loggerInstance.setContext(transformedContext);
      return;
    }
    const transformedContext = context.replace(/^(?<start>.{10}).*(?<end>.{7})$/, (...args: unknown[]) => {
      const groups = args.pop() as { start: string; end: string };
      return `${groups.start}...${groups.end}`;
    });
    this.loggerInstance.setContext(transformedContext);
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

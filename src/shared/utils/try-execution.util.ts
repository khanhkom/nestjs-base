import { AppErrorCode } from '../models/app-error-code.model';
import { AppException } from '../models/app-exception.model';
import { LoggerProvider } from '../providers/logger.provider';

class Execution<T> {
  private runnable: () => Promise<T>;
  private noOfRetries: number;
  private _silent: boolean;
  private _logger?: LoggerProvider;
  private message?: string;

  private constructor(runnable: () => Promise<T>) {
    this.runnable = runnable;
    this.noOfRetries = 0;
    this._silent = false;
  }

  static of<T>(runnable: () => Promise<T>): Execution<T> {
    return new Execution<T>(runnable);
  }

  logger(logger: LoggerProvider): Execution<T> {
    this._logger = logger;
    return this;
  }

  silent(): Execution<T> {
    this._silent = true;
    return this;
  }

  retry(noOfRetries: number, message = ''): Execution<T> {
    this.noOfRetries = noOfRetries;
    this.message = message;
    return this;
  }

  async execute(): Promise<T | undefined> {
    for (let i = 0; i <= this.noOfRetries; i++) {
      try {
        return await this.runnable();
      } catch (error) {
        if (i > 0) {
          this._logger?.normalError(`Error when retrying ${i} times`, error);
        } else {
          this._logger?.normalError('Error when execute', error);
        }
      }
    }

    if (this._silent) {
      return undefined;
    }

    this._logger?.unhandledError('Failed to execute', this.message);
    throw new AppException(AppErrorCode.ERR500001);
  }
}

export class TryExecution<T> {
  private constructor() {
    // do nothing
  }

  public static init<T>(): TryExecution<T> {
    return new TryExecution();
  }

  public try(runnable: () => Promise<T>): Execution<T> {
    return Execution.of(runnable);
  }
}

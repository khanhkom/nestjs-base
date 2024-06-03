import { AppErrorCode } from './app-error-code.model';

export class AppException extends Error {
  constructor(
    public readonly appErrorCode: AppErrorCode,
    public readonly params?: Record<string, unknown>,
  ) {
    const message = [appErrorCode.code, params]
      .filter((v) => !!v)
      .map((v) => (typeof v === 'object' ? JSON.stringify(v) : v))
      .join(' ');
    super(message);
  }

  get name(): string {
    return AppException.name;
  }
}

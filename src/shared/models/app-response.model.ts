import { ResponseStatus } from '../enums/response-status.enum';
import { AppErrorCode } from './app-error-code.model';

class AppResponse {
  constructor(public readonly status: ResponseStatus) {}
}

export class AppSuccessResponse<Data> extends AppResponse {
  constructor(public readonly data: Data) {
    super(ResponseStatus.SUCCESS);
  }
}

export class AppErrorResponse extends AppResponse {
  public readonly code: string;
  public readonly message: string | string[];

  constructor(errorCode: AppErrorCode);
  constructor(errorCode: AppErrorCode, message?: string | string[]);
  constructor(errorCode: AppErrorCode, message?: string | string[]) {
    super(ResponseStatus.ERROR);
    this.code = errorCode.code;
    this.message = message ?? errorCode.message;
  }
}

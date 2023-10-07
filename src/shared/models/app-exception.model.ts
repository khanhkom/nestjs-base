import { HttpException } from '@nestjs/common';
import { AppErrorCode } from './app-error-code.model';
import { AppErrorResponse } from './app-response.model';

export class AppException extends HttpException {
  constructor(errorCode: AppErrorCode) {
    super(new AppErrorResponse(errorCode), errorCode.httpStatus);
  }
}

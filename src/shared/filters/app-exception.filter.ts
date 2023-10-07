import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { AppErrorCode } from '../models/app-error-code.model';
import { AppException } from '../models/app-exception.model';
import { AppErrorResponse } from '../models/app-response.model';
import { LoggerProvider } from '../providers/logger.provider';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerProvider) {
    this.logger.setContext(AppExceptionFilter.name);
  }

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof AppException) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse() as { message: string | string[] };
      const badRequestResponse = new AppErrorResponse(AppErrorCode.ERR400000, exceptionResponse.message);
      response.status(exception.getStatus()).json(badRequestResponse);
      return;
    }

    if (exception instanceof NotFoundException) {
      response.status(exception.getStatus()).json(new AppErrorResponse(AppErrorCode.ERR404000));
      return;
    }

    if (exception instanceof ForbiddenException) {
      response.status(exception.getStatus()).json(new AppErrorResponse(AppErrorCode.ERR403000));
      return;
    }

    this.logger.unhandledError(exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new AppErrorResponse(AppErrorCode.ERR500000));
  }
}

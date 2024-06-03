import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { AppErrorCode } from '../models/app-error-code.model';
import { AppException } from '../models/app-exception.model';
import { AppContextProvider } from '../providers/app-context.provider';
import { LoggingProvider } from '../providers/logging.provider';
import { TranslationProvider } from '../providers/translation.provider';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly appContextProvider: AppContextProvider,
    private readonly logger: LoggingProvider,
    private readonly translator: TranslationProvider,
  ) {
    this.logger.setContext(AppExceptionFilter.name);
  }

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const appContext = this.appContextProvider.getStore();
    const response = ctx.getResponse<Response>();

    this.logger.normalError(exception);
    this.logger.info(
      'Report RequestId:',
      appContext?.executionId,
      'Total Duration:',
      `${Date.now() - (appContext?.startAt ?? Date.now())} ms`,
    );

    if (exception instanceof AppException) {
      const { appErrorCode, params } = exception;
      const { code, httpStatus } = appErrorCode;
      const message = this.translator.error(code, params);
      response.status(httpStatus).json({ code, message });
      return;
    }

    if (exception instanceof BadRequestException) {
      const { httpStatus, code } = AppErrorCode.ERR400000;
      const { message: exeptionMessage } = exception.getResponse() as { message: string | string[] };
      const message = exeptionMessage ?? this.translator.error(code);
      response.status(httpStatus).json({ code, message });
      return;
    }

    if (exception instanceof ForbiddenException) {
      const { httpStatus, code } = AppErrorCode.ERR403000;
      const message = this.translator.error(code);
      response.status(httpStatus).json({ code, message });
      return;
    }

    if (exception instanceof NotFoundException) {
      const { httpStatus, code } = AppErrorCode.ERR404000;
      const message = this.translator.error(code);
      response.status(httpStatus).json({ code, message });
      return;
    }

    const { httpStatus, code } = AppErrorCode.ERR500000;
    const message = this.translator.error(code);
    response.status(httpStatus).json({ code, message });
  }
}

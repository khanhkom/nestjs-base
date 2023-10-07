import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, catchError, finalize, map, throwError } from 'rxjs';
import { AppSuccessResponse } from '../models/app-response.model';
import { LoggerProvider } from '../providers/logger.provider';

@Injectable()
export class AppInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerProvider) {
    this.logger.setContext(AppInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
    if (context.getType() == 'http') {
      const request = context.switchToHttp().getRequest<Request>();
      this.logger.info('Start:', request.method, request.path);
      this.logger.info('Request:', {
        query: request.query,
        params: request.params,
        body: request.body,
        headers: request.headers,
      });

      const startTime = Date.now();

      return next.handle().pipe(
        map((data) => {
          this.logger.info('Result:', data);
          return new AppSuccessResponse(data);
        }),
        catchError((error) => {
          this.logger.normalError(error);
          return throwError(() => error);
        }),
        finalize(() => {
          this.logger.info('End:', request.method, request.path, `in ${Date.now() - startTime} ms`);
        }),
      );
    }

    return next.handle();
  }
}

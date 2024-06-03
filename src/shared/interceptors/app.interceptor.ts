import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AppContextProvider } from '../providers/app-context.provider';
import { LoggingProvider } from '../providers/logging.provider';

@Injectable()
export class AppInterceptor implements NestInterceptor {
  constructor(
    private readonly contextProvider: AppContextProvider,
    private readonly logger: LoggingProvider,
  ) {
    this.logger.setContext(AppInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
    const appContext = this.contextProvider.getStore();
    const startTime = Date.now();

    if (context.getType() == 'http') {
      const request = context.switchToHttp().getRequest<Request>();
      this.logger.info('Begin:', request.method, request.path);

      return next.handle().pipe(
        map((data) => {
          const endTime = Date.now();

          this.logger.info('Result:', data);
          this.logger.info('End:', request.method, request.path, 'Duration:', `${endTime - startTime} ms`);
          this.logger.info(
            'Report RequestId:',
            appContext?.executionId,
            'Total Duration:',
            `${endTime - (appContext?.startAt ?? startTime)} ms`,
          );

          return data;
        }),
        catchError((error) => {
          const endTime = Date.now();

          this.logger.info('End:', request.method, request.path, 'Duration:', `${endTime - startTime} ms`);

          return throwError(() => error);
        }),
      );
    }

    return next.handle();
  }
}

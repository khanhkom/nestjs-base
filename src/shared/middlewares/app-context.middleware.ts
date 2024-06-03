import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { AppContext } from '../models/app-context.model';
import { AppContextProvider } from '../providers/app-context.provider';
import { JwtProvider } from '../providers/jwt.provider';
import { LoggingProvider } from '../providers/logging.provider';

@Injectable()
export class AppContextMiddleware implements NestMiddleware {
  constructor(
    private readonly appContextProvider: AppContextProvider,
    private readonly jwtProvider: JwtProvider,
    private readonly logger: LoggingProvider,
  ) {
    this.logger.setContext(AppContextMiddleware.name);
  }

  async use(request: Request, response: Response, next: NextFunction): Promise<void> {
    const context = new AppContext(randomUUID());

    await this.appContextProvider.run(context, async () => {
      // Logging request start
      const { method, baseUrl, ips, query, params, body, headers } = request;
      this.logger.info('Start RequestId:', context.executionId);
      this.logger.info('Request:', { method, baseUrl, ips, query, params, body, headers });

      // Check authentication
      const authorization = request.header('authorization');
      if (authorization) {
        const token = authorization.split(' ')[1];
        const authenticatedUser = await this.jwtProvider.verifyAuth(token);
        context.data.user = authenticatedUser;
      }

      next();
    });
  }
}

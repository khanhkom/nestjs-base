import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AppContext } from '../models/app-context.model';
import { randomUUID } from 'crypto';
import { AppContextProvider } from '../providers/app-context.provider';
import { JwtProvider } from '../providers/jwt.provider';

@Injectable()
export class AppContextMiddleware implements NestMiddleware {
  constructor(
    private readonly contextProvider: AppContextProvider,
    private readonly jwtProvider: JwtProvider,
  ) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const context = new AppContext(randomUUID());

    // Check authentication
    const authorization = req.header('authorization');
    if (authorization) {
      const token = authorization.split(' ')[1];
      const authenticatedUser = await this.jwtProvider.verifyAuth(token);
      context.data.user = authenticatedUser;
    }

    this.contextProvider.run(context, () => next());
  }
}

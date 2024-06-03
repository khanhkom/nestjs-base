import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthenticatedUser } from '../models/authenticated-user.model';
import { TryExecution } from '../utils/try-execution.util';
import { AppConfigProvider } from './app-config.provider';

@Injectable()
export class JwtProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigProvider: AppConfigProvider,
  ) {}

  async signAuth(authenticatedUser: AuthenticatedUser): Promise<string> {
    // Json web token module requires payload to be plain
    const payload = instanceToPlain(authenticatedUser);
    // Sign authentication
    return this.jwtService.signAsync(payload, {
      secret: this.appConfigProvider.config.jwt.secret,
      expiresIn: this.appConfigProvider.config.jwt.ttl,
    });
  }

  async verifyAuth(token: string, ignoreExpiration = false): Promise<AuthenticatedUser | undefined> {
    return await TryExecution.init()
      .try(async () => {
        // Try to parse payload
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.appConfigProvider.config.jwt.secret,
          ignoreExpiration,
        });
        // Try to convert to AuthenticatedUser model
        const user = plainToInstance(AuthenticatedUser, payload, { excludeExtraneousValues: true });
        const errors = await validate(user);
        return !errors.length ? user : undefined;
      })
      .silent()
      .execute();
  }

  async signRefreshAuth(authenticatedUser: AuthenticatedUser): Promise<string> {
    // Json web token module requires payload to be plain
    const payload = instanceToPlain(authenticatedUser);
    // Sign authentication
    return this.jwtService.signAsync(payload, {
      secret: this.appConfigProvider.config.jwt.refreshJwtSecret,
      expiresIn: this.appConfigProvider.config.jwt.refreshJwtTtl,
    });
  }

  async verifyRefreshAuth(token: string): Promise<AuthenticatedUser | undefined> {
    return await TryExecution.init()
      .try(async () => {
        // Try to parse payload
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.appConfigProvider.config.jwt.refreshJwtSecret,
        });
        // Try to convert to AuthenticatedUser model
        const user = plainToInstance(AuthenticatedUser, payload, { excludeExtraneousValues: true });
        const errors = await validate(user);
        return !errors.length ? user : undefined;
      })
      .silent()
      .execute();
  }
}

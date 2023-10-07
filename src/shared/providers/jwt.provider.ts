import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUser } from '../models/authenticated-user.model';
import { TryExecution } from '../utils/try-execution.util';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../models/environment.model';
import { validate } from 'class-validator';

@Injectable()
export class JwtProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async signAuth(authenticatedUser: AuthenticatedUser): Promise<string> {
    // Json web token module requires payload to be plain
    const payload = instanceToPlain(authenticatedUser);
    // Sign authentication
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_TTL'),
    });
  }

  async verifyAuth(token: string, ignoreExpiration = false): Promise<AuthenticatedUser | undefined> {
    return await TryExecution.init<AuthenticatedUser | undefined>()
      .try(async () => {
        // Try to parse payload
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('JWT_SECRET'),
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
      secret: this.configService.get('REFRESH_JWT_SECRET'),
      expiresIn: this.configService.get('REFRESH_JWT_TTL'),
    });
  }

  async verifyRefreshAuth(token: string): Promise<AuthenticatedUser | undefined> {
    return await TryExecution.init<AuthenticatedUser | undefined>()
      .try(async () => {
        // Try to parse payload
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('REFRESH_JWT_SECRET'),
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

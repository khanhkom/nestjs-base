import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../models/app-config.model';
import { EnvironmentType, EnvironmentVariables } from '../models/environment.model';

@Injectable()
export class AppConfigProvider {
  public readonly config: AppConfig;

  constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {
    this.config = this.buildAppConfig();
  }

  private buildAppConfig(): AppConfig {
    return {
      nodeEnv: this.configService.get('NODE_ENV'),
      isDevelopment: this.configService.get('NODE_ENV') === EnvironmentType.Development,
      isStaging: this.configService.get('NODE_ENV') === EnvironmentType.Staging,
      isProduction: this.configService.get('NODE_ENV') === EnvironmentType.Production,
      server: {
        port: this.configService.get('APP_PORT'),
        apiPrefix: this.configService.get('API_PREFIX') ?? '',
      },
      db: {
        name: this.configService.get('DB_DATABASE'),
        host: this.configService.get('DB_HOST'),
        port: this.configService.get('DB_PORT'),
        username: this.configService.get('DB_USERNAME'),
        password: this.configService.get('DB_PASSWORD'),
      },
      jwt: {
        secret: this.configService.get('JWT_SECRET'),
        ttl: this.configService.get('JWT_TTL'),
        refreshJwtSecret: this.configService.get('REFRESH_JWT_SECRET'),
        refreshJwtTtl: this.configService.get('REFRESH_JWT_TTL'),
      },
    };
  }
}

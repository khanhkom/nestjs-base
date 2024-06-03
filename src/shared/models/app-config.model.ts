import { EnvironmentType } from './environment.model';

export interface AppConfig {
  nodeEnv: EnvironmentType;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
  server: {
    port: number;
    apiPrefix: string;
  };
  db: {
    name: string;
    host: string;
    port: number;
    username: string;
    password: string;
  };
  jwt: {
    secret: string;
    ttl: number;
    refreshJwtSecret: string;
    refreshJwtTtl: number;
  };
}

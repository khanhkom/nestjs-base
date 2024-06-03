import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum EnvironmentType {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

export class EnvironmentVariables {
  @IsEnum(EnvironmentType)
  NODE_ENV!: EnvironmentType;

  @IsNumber()
  APP_PORT!: number;

  @IsOptional()
  @IsString()
  API_PREFIX?: string;

  @IsString()
  DB_HOST!: string;

  @IsNumber()
  DB_PORT!: number;

  @IsString()
  DB_USERNAME!: string;

  @IsString()
  DB_PASSWORD!: string;

  @IsString()
  DB_DATABASE!: string;

  @IsString()
  JWT_SECRET!: string;

  @IsNumber()
  JWT_TTL!: number;

  @IsString()
  REFRESH_JWT_SECRET!: string;

  @IsNumber()
  REFRESH_JWT_TTL!: number;
}

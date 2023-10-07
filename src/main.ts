import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { EnvironmentVariables } from './shared/models/environment.model';
import helmet from 'helmet';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  const configService = app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);
  await app.listen(configService.get('APP_PORT'));
}

void bootstrap();

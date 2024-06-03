import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { setupSwagger } from './setupSwagger';
import { AppConfigProvider } from './shared/providers/app-config.provider';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const appConfigProvider = app.get(AppConfigProvider);
  const { apiPrefix, port } = appConfigProvider.config.server;

  app.setGlobalPrefix(apiPrefix);
  app.use(helmet());

  // Setup swagger
  setupSwagger(app);

  await app.listen(port);
}

void bootstrap();

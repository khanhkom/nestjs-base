import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = <T>(app: INestApplication<T>): void => {
  const config = new DocumentBuilder()
    .setTitle('NestJS source base')
    .setDescription('The NestJS source base')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, { useGlobalPrefix: true });
};

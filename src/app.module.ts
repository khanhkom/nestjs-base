import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { AppContextMiddleware } from './shared/middlewares/app-context.middleware';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE, Reflector } from '@nestjs/core';
import { AppInterceptor } from './shared/interceptors/app.interceptor';
import { AppExceptionFilter } from './shared/filters/app-exception.filter';
import { EnvironmentVariables } from './shared/models/environment.model';
import { AuthModule } from './auth/auth.module';
import { SqlLoggerProvider } from './shared/providers/sql-logger.provider';
import { JwtModule } from '@nestjs/jwt';
import { configValidator } from './shared/utils/validator.util';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, validate: configValidator }),
    SharedModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService, SqlLoggerProvider],
      useFactory: (configService: ConfigService<EnvironmentVariables, true>, sqlLoggerProvider: SqlLoggerProvider) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
        logger: sqlLoggerProvider,
      }),
    }),
    JwtModule.register({ global: true }),
    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      inject: [Reflector],
      useFactory: (reflector: Reflector): ClassSerializerInterceptor => {
        return new ClassSerializerInterceptor(reflector, {
          enableCircularCheck: true,
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      },
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: { enableCircularCheck: true, enableImplicitConversion: true },
      }),
    },
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppContextMiddleware).forRoutes('*');
  }
}

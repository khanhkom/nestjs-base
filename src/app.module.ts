import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE, Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AppExceptionFilter } from './shared/filters/app-exception.filter';
import { AppInterceptor } from './shared/interceptors/app.interceptor';
import { AppContextMiddleware } from './shared/middlewares/app-context.middleware';
import { AppConfigProvider } from './shared/providers/app-config.provider';
import { SqlLoggingProvider } from './shared/providers/sql-logger.provider';
import { SharedModule } from './shared/shared.module';
import { configValidator } from './shared/utils/validator.util';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, validate: configValidator }),
    SharedModule,
    TypeOrmModule.forRootAsync({
      inject: [AppConfigProvider, SqlLoggingProvider],
      useFactory: (appConfigProvider: AppConfigProvider, sqlLogger: SqlLoggingProvider) => ({
        type: 'postgres',
        host: appConfigProvider.config.db.host,
        port: appConfigProvider.config.db.port,
        username: appConfigProvider.config.db.username,
        password: appConfigProvider.config.db.password,
        database: appConfigProvider.config.db.name,
        entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
        logger: sqlLogger,
      }),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [new HeaderResolver(['x-lang'])],
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

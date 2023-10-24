import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './core/logger/logger.module';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { RequestLoggingMiddleware } from './core/middlewares/request-logging.middleware';
import { EnvSchema } from './env.schema';

@Module({
  imports: [
    /**
     * @Note: configService.get<boolean|number>('<ENV>')
     * Use validationSchema to validate and ensure <ENV>s are converted to <boolean|number> type.
     * If not, <ENV> got 'string' as type.
     *
     */
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: EnvSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: ['dist/**/*.entity.{ts,js}'],
        synchronize: configService.get<boolean>('DB_SYNC'),
        retryAttempts: 3,
        logging: configService.get<boolean>('DB_LOG'),
      }),
    }),
    LoggerModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}

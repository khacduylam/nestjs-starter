import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { RequestLoggingMiddleware } from './common/middlewares/request-logging.middleware';
import { EnvSchema } from './env.schema';
import { TodosModule } from './todos/todos.module';
import { LoggingModule } from './logging/logging.module';

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
    LoggingModule,
    UsersModule,
    AuthModule,
    TodosModule,
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

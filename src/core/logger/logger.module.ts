import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LOGGER_PROVIDER_TOKEN, createLoggerProvider } from './logger.provider';

@Global()
@Module({
  imports: [],
  providers: [
    {
      inject: [ConfigService],
      provide: LOGGER_PROVIDER_TOKEN,
      useFactory: (configService: ConfigService) => {
        const debug = configService.get<string>('NODE_ENV') === 'dev';
        const service = configService.get<string>('SERVICE_NAME', 'APP');
        const maxLogFiles = configService.get<string>('MAX_LOG_FILES', '30d');

        return createLoggerProvider({ debug, service, maxLogFiles });
      },
    },
  ],
  exports: [LOGGER_PROVIDER_TOKEN],
})
export class LoggerModule {}

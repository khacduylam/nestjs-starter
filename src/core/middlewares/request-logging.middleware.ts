import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { LOGGER_PROVIDER_TOKEN } from '../logger/logger.provider';
import { CustomRequest } from '../interfaces/misc.interface';
import { NextFunction, Response } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(
    @Inject(LOGGER_PROVIDER_TOKEN)
    private readonly loggerService: LoggerService,
  ) {}

  use(req: CustomRequest, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const statusCode = res.statusCode;
      const reqInfo = {
        statusCode,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString(),
      };
      if ((statusCode + '').startsWith('2')) {
        this.loggerService.log('Request Info', reqInfo);
      } else {
        this.loggerService.error('Request Error', reqInfo);
      }
    });

    next();
  }
}

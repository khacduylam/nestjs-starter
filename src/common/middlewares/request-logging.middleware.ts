import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LOGGER_PROVIDER_TOKEN } from 'src/logging/logging.constant';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(
    @Inject(LOGGER_PROVIDER_TOKEN)
    private readonly loggerService: LoggerService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
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

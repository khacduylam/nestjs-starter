import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  LoggerService,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { UNKNOWN_ERROR } from '../constants/response-code.constant';
import { BaseResponseDto } from '../dtos/base.dto';
import { LOGGER_PROVIDER_TOKEN } from '../logger/logger.provider';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(LOGGER_PROVIDER_TOKEN)
    private readonly loggerService: LoggerService,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let exceptionData = new BaseResponseDto({ ...UNKNOWN_ERROR });
    let exceptionStatus = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      exceptionData.message = exceptionResponse;
    } else {
      Object.assign(exceptionData, exceptionResponse);
      exceptionStatus = exceptionData.statusCode;

      const expMessage = exceptionResponse['message'];
      exceptionData.message = Array.isArray(expMessage)
        ? expMessage[0]
        : expMessage;
    }

    this.loggerService.error(exceptionData.message, exception.stack);

    response.status(exceptionStatus).json(exceptionData);
  }
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { UNKNOWN_ERROR } from '../constants/response-code.constant';
import { BaseResponseDto } from '../dtos/base.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
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
    }

    response.status(exceptionStatus).json(exceptionData);
  }
}

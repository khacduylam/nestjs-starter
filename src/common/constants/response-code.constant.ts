import { HttpStatus } from '@nestjs/common';
import { BaseResponseDto } from '../dtos/base.dto';

// Commons [1000 ~ 1099]
export const SUCCESS: BaseResponseDto = {
  code: 1000,
  statusCode: HttpStatus.OK,
  message: 'SUCCESS',
};
export const CREATED: BaseResponseDto = {
  code: 1001,
  statusCode: HttpStatus.CREATED,
  message: 'CREATED',
};
export const INVALID_INPUT: BaseResponseDto = {
  code: 1002,
  statusCode: HttpStatus.BAD_REQUEST,
  message: 'INVALID_INPUT',
};
export const UNAUTHORIZED: BaseResponseDto = {
  code: 1003,
  statusCode: HttpStatus.UNAUTHORIZED,
  message: 'UNAUTHORIZED',
};
export const INVALID_TOKEN: BaseResponseDto = {
  code: 1004,
  statusCode: HttpStatus.UNAUTHORIZED,
  message: 'INVALID_TOKEN',
};
export const ACCESS_DENIED: BaseResponseDto = {
  code: 1005,
  statusCode: HttpStatus.UNAUTHORIZED,
  message: 'ACCESS_DENIED',
};
export const NOT_FOUND: BaseResponseDto = {
  code: 1006,
  statusCode: HttpStatus.NOT_FOUND,
  message: 'NOT_FOUND',
};
export const TIMEOUT: BaseResponseDto = {
  code: 1007,
  statusCode: HttpStatus.REQUEST_TIMEOUT,
  message: 'TIMEOUT',
};
export const UNKNOWN_ERROR: BaseResponseDto = {
  code: 1008,
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  message: 'UNKNOWN_ERROR',
};

// User & Auth [1100 ~ 1199]
export const USER_EMAIL_OR_PASSWORD_IS_INCORRECT: BaseResponseDto = {
  code: 1100,
  statusCode: HttpStatus.BAD_REQUEST,
  message: 'USER_EMAIL_OR_PASSWORD_IS_INCORRECT',
};
export const USER_EMAIL_EXISTED: BaseResponseDto = {
  code: 1101,
  statusCode: HttpStatus.BAD_REQUEST,
  message: 'USER_EMAIL_EXISTED',
};
export const USER_PASSWORD_IS_INCORRECT: BaseResponseDto = {
  code: 1102,
  statusCode: HttpStatus.BAD_REQUEST,
  message: 'USER_PASSWORD_IS_INCORRECT',
};

// Todo [1200 ~ 1299]

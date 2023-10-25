import {
  CanActivate,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Put,
  Type,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiOperationOptions,
  ApiResponseOptions,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiCustomCreatedResponse } from './swagger/custom-api-created-response.decorator';
import { ApiCustomOkResponse } from './swagger/custom-api-ok-response.decorator';
import { ApiPaginationResponse } from './swagger/custom-api-pagination-response.decorator';
import { AllowedRoles, Public } from './auth.decorator';
import { UserRole } from 'src/users/users.enum';
import { BaseResponseDto } from '../dtos/base.dto';

// Swagger
export type SuccessResponseType = 'created' | 'ok' | 'pagination';
export interface SuccessResponseOptions {
  type: SuccessResponseType;
  cls: Type<any>;
}
export interface SwaggerCrudOptions extends ApiOperationOptions {
  httpCode?: number;
  unauthoriedResponseOptions?: ApiResponseOptions;
  badRequestResponseOptions?: ApiResponseOptions;
  notFoundResponseOptions?: ApiResponseOptions;
  successResponseOptions?: SuccessResponseOptions;
}

// Nest
type NestCrudMethodType = 'Post' | 'Get' | 'Put' | 'Patch' | 'Delete';
export interface NestCrudOptions {
  method: NestCrudMethodType;
  path?: string;
  isPublic?: boolean;
  allowedRoles?: UserRole[];
  guards?: CanActivate[] | Function[];
}

function getMethodDecorator(method: NestCrudMethodType, path?: string) {
  switch (method) {
    case 'Get':
      return Get(path);
    case 'Post':
      return Post(path);
    case 'Put':
      return Put(path);
    case 'Patch':
      return Patch(path);
    case 'Delete':
      return Delete(path);
    default:
      return Get(path);
  }
}

export interface CrudApiParams {
  swagger?: SwaggerCrudOptions;
  nest: NestCrudOptions;
}

export function CrudApi(
  params: CrudApiParams,
  ...otherDecorators: MethodDecorator[]
) {
  const decorators: any[] = [...otherDecorators];

  // Nest
  const { method, path, isPublic, allowedRoles, guards } = params.nest;
  decorators.push(getMethodDecorator(method, path));
  if (isPublic) {
    decorators.push(Public());
  } else {
    decorators.push(
      ApiUnauthorizedResponse({
        type: BaseResponseDto,
        description: 'Unauthoried',
      }),
    );
  }
  if (allowedRoles) {
    decorators.push(AllowedRoles(...allowedRoles));
  }
  if (guards) {
    decorators.push(UseGuards(...guards));
  }

  // Swagger
  if (params?.swagger) {
    const swaggerOptions = params.swagger;
    const {
      httpCode,
      unauthoriedResponseOptions,
      badRequestResponseOptions,
      notFoundResponseOptions,
      successResponseOptions,
      ...apiOperationOptions
    } = swaggerOptions;
    decorators.push(...[ApiOperation(apiOperationOptions), ApiBearerAuth()]);

    if (httpCode) {
      decorators.push(HttpCode(httpCode));
    }
    if (successResponseOptions) {
      const { type, cls } = successResponseOptions;
      if (type === 'created') {
        decorators.push(ApiCustomCreatedResponse(cls));
      } else if (type === 'ok') {
        decorators.push(ApiCustomOkResponse(cls));
      } else {
        decorators.push(ApiPaginationResponse(cls));
      }
    }
    if (unauthoriedResponseOptions) {
      decorators.push(ApiUnauthorizedResponse(unauthoriedResponseOptions));
    }
    if (notFoundResponseOptions) {
      decorators.push(ApiNotFoundResponse(notFoundResponseOptions));
    }
    if (badRequestResponseOptions) {
      decorators.push(ApiBadRequestResponse(badRequestResponseOptions));
    }
  }

  return applyDecorators(...decorators);
}

import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { BaseResponseDto } from 'src/shared/dtos/base.dto';

export const ApiCustomCreatedResponse = <TModel extends Type<any>>(
  model: TModel,
  metadata?: any,
) => {
  return applyDecorators(
    ApiExtraModels(BaseResponseDto),
    ApiExtraModels(model),
    ApiCreatedResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
              metadata,
            },
          },
        ],
      },
    }),
  );
};

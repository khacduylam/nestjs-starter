import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dtos/base.dto';

export const ApiCustomOkResponse = <TModel extends Type<any>>(
  model: TModel,
  metadata?: any,
) => {
  return applyDecorators(
    ApiExtraModels(BaseResponseDto),
    ApiExtraModels(model),
    ApiOkResponse({
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

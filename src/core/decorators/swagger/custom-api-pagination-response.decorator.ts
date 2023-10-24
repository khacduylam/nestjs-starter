import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/core/dtos/base.dto';

export const ApiPaginationResponse = <TModel extends Type<any>>(
  model: TModel,
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
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              metadata: {
                properties: {
                  itemCount: { type: 'boolean' },
                  totalItems: { type: 'number' },
                  itemsPerPage: { type: 'number' },
                  totalPages: { type: 'number' },
                  currentPage: { type: 'number' },
                },
              },
            },
          },
        ],
      },
    }),
  );
};

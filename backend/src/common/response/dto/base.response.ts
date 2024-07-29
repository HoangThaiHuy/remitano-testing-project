import { Type, applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';

export class BaseResponse<T> {
  constructor(data: T) {
    this.data = data;
  }
  @ApiProperty()
  data: T
}


export const ApiBaseResponse = <TModel extends Type<unknown>>(
  model: TModel
) => {
  return applyDecorators(
    ApiExtraModels(ApiBaseResponse, model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    })
  );
};

export const ApiBaseResponseArray = <TModel extends Type<unknown>>(
  model: TModel
) =>
  applyDecorators(
    ApiExtraModels(ApiBaseResponse, model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
import { Type, applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { BaseResponse } from './base.response'

export class Paging<T> {
  constructor(items: T[], limit: Number, offset: Number, nextOffset: Number, total: Number) {
    this.items = items;
    this.limit = limit;
    this.offset = offset;
    this.nextOffset = nextOffset;
    this.total = total;
  }

  @ApiProperty()
  items: T[]

  @ApiProperty()
  limit: Number

  @ApiProperty()
  offset: Number

  @ApiProperty({ name: 'next_offset' })
  @Expose({ name: 'next_offset' })
  nextOffset: Number

  @ApiProperty()
  total: Number
}

export class PagingResponse<T> extends BaseResponse<Paging<T>> {
  constructor(items: T[], limit: Number, offset: Number, nextOffset: Number, total: Number) {
    super(new Paging<T>(items, limit, offset, nextOffset, total));
  }
}

export const ApiPagingResponse = <TModel extends Type<unknown>>(
  model: TModel
) =>
  applyDecorators(
    ApiExtraModels(ApiPagingResponse, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiPagingResponse) },
          {
            properties: {
              data: {
                type: 'object',
                properties: {
                  limit: {
                    type: 'number',
                    example: 10,
                  },
                  offset: {
                    type: 'number',
                    example: 0,
                  },
                  next_offset: {
                    type: 'number',
                    example: 20,
                  },
                  total: {
                    type: 'number',
                    example: 100,
                  },
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                }
              },
            },
          },
        ],
      },
    }),
  );
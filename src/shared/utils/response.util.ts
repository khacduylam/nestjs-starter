import { ClassConstructor, plainToInstance } from 'class-transformer';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { BaseResponseDto } from '../dtos/base.dto';

export function mapObject<T, V>(cls: ClassConstructor<T>, obj: V) {
  return plainToInstance(cls, obj, { excludeExtraneousValues: true });
}

export function mapObjects<T, V>(cls: ClassConstructor<T>, objs: V[]) {
  return objs.map((obj) => mapObject(cls, obj));
}

export function createResponseDto<T, V>(
  cls: ClassConstructor<T>,
  obj: V | V[],
  responseMeta?: Partial<BaseResponseDto>,
) {
  const data = Array.isArray(obj) ? mapObjects(cls, obj) : mapObject(cls, obj);
  return new BaseResponseDto({ data, ...responseMeta });
}

export function createPaginationResponse<T, V>(
  cls: ClassConstructor<T>,
  result: Pagination<V, IPaginationMeta>,
  responseMeta?: Partial<BaseResponseDto>,
) {
  const data = mapObjects(cls, result.items);

  return new BaseResponseDto({ data, metadata: result.meta, ...responseMeta });
}

export function formatPaginationResult<T>(
  result: Pagination<T, IPaginationMeta>,
) {
  const response = new BaseResponseDto({
    data: result.items,
    metadata: result.meta,
  });

  return response;
}

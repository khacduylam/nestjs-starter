import { SelectQueryBuilder } from 'typeorm';

export interface RelationOptions {
  field: string;
  alias: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationMetadata {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginationResult<EntityType> {
  meta: PaginationMetadata;
  items: EntityType[];
}

export function buildPaginationResult<EntityType>(
  items: EntityType[],
  options: PaginationOptions,
  total: number,
) {
  const { limit, page } = options;
  const totalPages = Math.ceil(total / options.limit);
  const result: PaginationResult<EntityType> = {
    meta: {
      totalItems: total,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
    },
    items,
  };

  return result;
}

export async function paginate<EntityType>(
  queryBuilder: SelectQueryBuilder<EntityType>,
  options: PaginationOptions,
) {
  const takeNum = options.limit;
  const skipNum = (options.page - 1) * takeNum;
  const countBuilder = queryBuilder.clone();

  const [total, items] = await Promise.all([
    countBuilder.getCount(),
    queryBuilder.skip(skipNum).take(takeNum).getMany(),
  ]);

  return buildPaginationResult(items, options, total);
}

import { Repository } from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { NOT_FOUND, UNKNOWN_ERROR } from '../constants/response-code.constant';
import { RelationOptions, paginate } from '../utils/pagination.util';

export abstract class BaseService<EntityType extends BaseEntity> {
  constructor(private readonly repo: Repository<EntityType>) {}

  async findOne(id: number): Promise<EntityType>;
  async findOne(queryDto: object): Promise<EntityType>;
  async findOne(queryDto: unknown) {
    let query: any = {};
    if (typeof queryDto === 'number') {
      query = { id: queryDto, isDeleted: false };
    } else if (typeof queryDto === 'object') {
      query = { ...queryDto, isDeleted: false };
    } else {
      throw new InternalServerErrorException(UNKNOWN_ERROR);
    }

    return await this.repo.findOneBy(query);
  }

  async findExistedOne(id: number): Promise<EntityType>;
  async findExistedOne(queryDto: object): Promise<EntityType>;
  async findExistedOne(queryDto: unknown) {
    let query: any = {};
    if (typeof queryDto === 'number') {
      query = { id: queryDto, isDeleted: false };
    } else if (typeof queryDto === 'object') {
      query = { ...queryDto, isDeleted: false };
    } else {
      throw new InternalServerErrorException(UNKNOWN_ERROR);
    }

    const entity = await this.repo.findOneBy(query);
    if (!entity) {
      throw new NotFoundException(NOT_FOUND);
    }

    return entity;
  }

  async create(createDto: object) {
    const data: any = createDto;
    const entity = this.repo.create();
    Object.assign(entity, data);
    await this.repo.save(entity);

    return entity;
  }

  async findOneAndUpdate(id: number, updateDto: object): Promise<EntityType>;
  async findOneAndUpdate(
    queryDto: object,
    updateDto: object,
  ): Promise<EntityType>;
  async findOneAndUpdate(queryDto: unknown, updateDto: object) {
    let query: any = {};
    if (typeof queryDto === 'number') {
      query = { id: queryDto, isDeleted: false };
    } else if (typeof queryDto === 'object') {
      query = { ...queryDto, isDeleted: false };
    } else {
      throw new InternalServerErrorException(UNKNOWN_ERROR);
    }

    const entity = await this.findExistedOne(query);

    Object.assign(entity, updateDto);
    await this.repo.save(entity);

    return entity;
  }

  async update(id: number, updateDto: object): Promise<EntityType>;
  async update(queryDto: object, updateDto: object): Promise<EntityType>;
  async update(queryDto: unknown, updateDto: object) {
    let query: any = {};
    if (typeof queryDto === 'number') {
      query = { id: queryDto, isDeleted: false };
    } else if (typeof queryDto === 'object') {
      query = { ...queryDto, isDeleted: false };
    } else {
      throw new InternalServerErrorException(UNKNOWN_ERROR);
    }

    const entity = await this.findOne(query);
    if (!entity) {
      return null;
    }

    Object.assign(entity, updateDto);
    await this.repo.save(entity);

    return entity;
  }

  async findOneAndDelete(id: number, permanent?: boolean): Promise<number>;
  async findOneAndDelete(
    queryDto: object,
    permanent?: boolean,
  ): Promise<number>;
  async findOneAndDelete(queryDto: unknown, permanent: boolean = false) {
    let query: any = {};
    if (typeof queryDto === 'number') {
      query = { id: queryDto, isDeleted: false };
    } else if (typeof queryDto === 'object') {
      query = { ...queryDto, isDeleted: false };
    } else {
      throw new InternalServerErrorException(UNKNOWN_ERROR);
    }
    const entity = await this.findExistedOne(query);

    if (permanent) {
      await this.repo.delete(entity.id);
    } else {
      const data: any = { isDeleted: true };
      await this.repo.update(entity.id, data);
    }

    return entity.id;
  }

  async delete(id: number, permanent?: boolean): Promise<number>;
  async delete(queryDto: object, permanent?: boolean): Promise<number>;
  async delete(queryDto: unknown, permanent: boolean = false) {
    let query: any = {};
    if (typeof queryDto === 'number') {
      query = { id: queryDto, isDeleted: false };
    } else if (typeof queryDto === 'object') {
      query = { ...queryDto, isDeleted: false };
    } else {
      throw new InternalServerErrorException(UNKNOWN_ERROR);
    }
    const entity = await this.findOne(query);
    if (!entity) {
      return 0;
    }

    if (permanent) {
      await this.repo.delete(entity.id);
    } else {
      const data: any = { isDeleted: true };
      await this.repo.update(entity.id, data);
    }

    return entity.id;
  }

  async findAndPaginate(
    queryDto: Record<any, any>,
    relations?: RelationOptions[],
  ) {
    const { page, limit, ...query } = queryDto;
    const queryBuilder = this.repo.createQueryBuilder('qb');
    queryBuilder.where({ ...query, isDeleted: false });
    if (relations) {
      relations.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`qb.${relation.field}`, relation.alias);
      });
    }

    const result = await paginate<EntityType>(queryBuilder, {
      page,
      limit,
    });

    return result;
  }
}

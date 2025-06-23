import { Request } from 'express';
import { DataSource, EntityManager, Repository, ObjectLiteral } from 'typeorm';
import { ENTITY_MANAGER_KEY } from './transaction.interceptor';

export class BaseRepository {
  constructor(
    private dataSource: DataSource,
    private request: Request,
  ) {}

  protected getRepository<T extends ObjectLiteral>(
    entityCls: new () => T,
  ): Repository<T> {
    const entityManager: EntityManager =
      (this.request[ENTITY_MANAGER_KEY] as EntityManager | undefined) ??
      this.dataSource.manager;
    return entityManager.getRepository(entityCls);
  }
}

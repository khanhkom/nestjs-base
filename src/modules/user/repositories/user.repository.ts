import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';
import { PaginationResponse } from '../../../shared/models/pagination.response';
import { GetUserResponse } from '../models/get-user.response';
import { GetUsersQuery } from '../models/get-users.query';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(protected dataSource: DataSource) {
    super(UserEntity, dataSource.manager);
  }

  public async findByQuery(query: GetUsersQuery): Promise<PaginationResponse<GetUserResponse>> {
    const qb = this.createQueryBuilder('u').limit(query.limit).offset(query.offset);

    if (query.username) {
      qb.andWhere('LOWER(u.username) LIKE LOWER(:username)', {
        username: `%${query.username}%`,
      });
    }

    if (query.name) {
      qb.andWhere('(LOWER(u.firstName) LIKE LOWER(:name) OR LOWER(u.lastName) LIKE LOWER(:name))', {
        name: `%${query.name}%`,
      });
    }

    const [users, total] = await qb.getManyAndCount();

    return { items: plainToInstance(GetUserResponse, users), total };
  }
}

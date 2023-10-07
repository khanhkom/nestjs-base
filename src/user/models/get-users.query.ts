import { IsOptional, IsString } from 'class-validator';
import { PaginationQuery } from '../../shared/models/pagination.query';

export class GetUsersQuery extends PaginationQuery {
  @IsOptional()
  @IsString()
  username!: string;

  @IsOptional()
  @IsString()
  name!: string;
}

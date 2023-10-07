import { IsNumber } from 'class-validator';
import { PAGE_SIZE_DEFAULT } from '../constants/app.constants';
import { Type } from 'class-transformer';

export class PaginationQuery {
  @IsNumber()
  @Type(() => Number)
  page = 1;

  @IsNumber()
  @Type(() => Number)
  size = PAGE_SIZE_DEFAULT;

  get limit(): number {
    return this.size;
  }

  get offset(): number {
    return (this.page - 1) * this.size;
  }
}

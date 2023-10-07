import { Expose } from 'class-transformer';

export class PaginationResponse<T> {
  @Expose()
  items!: T[];

  @Expose()
  total!: number;
}

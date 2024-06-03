import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PaginationResponse<T> {
  @Expose()
  items!: T[];

  @Expose()
  total!: number;
}

export function PaginationResponseApiType(ItemClass: Type): Type {
  class PaginationResponse {
    @ApiProperty({ type: [ItemClass] })
    items!: (typeof ItemClass)[];

    @ApiProperty()
    total!: number;
  }
  return PaginationResponse;
}

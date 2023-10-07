import { Expose } from 'class-transformer';

export class GetUserResponse {
  @Expose()
  username!: string;

  @Expose()
  firstName!: string;

  @Expose()
  lastName!: string;

  @Expose()
  dateOfBirth!: Date;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}

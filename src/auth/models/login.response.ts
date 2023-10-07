import { Expose } from 'class-transformer';

export class LoginResponse {
  @Expose()
  token!: string;

  @Expose()
  refreshToken!: string;
}

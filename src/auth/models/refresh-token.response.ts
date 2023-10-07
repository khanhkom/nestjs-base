import { Expose } from 'class-transformer';

export class RefreshTokenResponse {
  @Expose()
  token!: string;

  @Expose()
  refreshToken!: string;
}

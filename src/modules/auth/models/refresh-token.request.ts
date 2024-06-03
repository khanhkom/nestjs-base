import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenRequest {
  @IsNotEmpty()
  @IsString()
  token!: string;

  @IsNotEmpty()
  @IsString()
  refreshToken!: string;
}

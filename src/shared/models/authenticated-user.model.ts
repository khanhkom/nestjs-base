import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../enums/role.enum';
import { Expose } from 'class-transformer';

export class AuthenticatedUser {
  @Expose()
  @IsNotEmpty()
  @IsString()
  username!: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @Expose()
  @IsNotEmpty()
  @IsEnum(Role)
  role!: Role;
}

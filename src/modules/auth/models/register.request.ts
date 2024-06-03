import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class RegisterRequest {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsNotEmpty()
  @IsDate()
  dateOfBirth!: Date;
}

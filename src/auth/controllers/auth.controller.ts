import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterRequest } from '../models/register.request';
import { LoginRequest } from '../models/login.request';
import { LoginResponse } from '../models/login.response';
import { RefreshTokenRequest } from '../models/refresh-token.request';
import { RefreshTokenResponse } from '../models/refresh-token.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() request: RegisterRequest): Promise<void> {
    await this.authService.register(request);
  }

  @Post('login')
  async login(@Body() request: LoginRequest): Promise<LoginResponse> {
    return await this.authService.login(request);
  }

  @Post('refresh-token')
  async refreshToken(@Body() request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return await this.authService.refreshToken(request);
  }
}

import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../user/repositories/user.repository';
import { RegisterRequest } from '../models/register.request';
import { AppException } from '../../shared/models/app-exception.model';
import { AppErrorCode } from '../../shared/models/app-error-code.model';
import { LoginRequest } from '../models/login.request';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { LoginResponse } from '../models/login.response';
import { AuthenticatedUser } from '../../shared/models/authenticated-user.model';
import { Role } from '../../shared/enums/role.enum';
import { JwtProvider } from '../../shared/providers/jwt.provider';
import { RefreshTokenRequest } from '../models/refresh-token.request';
import { RefreshTokenResponse } from '../models/refresh-token.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtProvider: JwtProvider,
  ) {}

  async register(request: RegisterRequest): Promise<void> {
    const existedUsername = await this.userRepository.findOneBy({ username: request.username });
    if (existedUsername) {
      throw new AppException(AppErrorCode.ERR409001);
    }

    const hashedPassword = await bcrypt.hash(request.password, 10);

    const userEntity = this.userRepository.create({
      username: request.username,
      password: hashedPassword,
      firstName: request.firstName,
      lastName: request.lastName,
      dateOfBirth: request.dateOfBirth,
      role: Role.USER,
    });
    await this.userRepository.save(userEntity);
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findOneBy({ username: request.username });
    if (!user) {
      throw new AppException(AppErrorCode.ERR401000);
    }

    const comparedPassword = await bcrypt.compare(request.password, user.password);
    if (!comparedPassword) {
      throw new AppException(AppErrorCode.ERR401000);
    }

    const payload: AuthenticatedUser = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    const jwtToken = await this.jwtProvider.signAuth(payload);
    const jwtRefreshToken = await this.jwtProvider.signRefreshAuth(payload);

    return plainToInstance(LoginResponse, { token: jwtToken, refreshToken: jwtRefreshToken });
  }

  async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const user = await this.jwtProvider.verifyAuth(request.token, true);
    if (!user) {
      throw new AppException(AppErrorCode.ERR401000);
    }
    const userWithinRefreshToken = await this.jwtProvider.verifyRefreshAuth(request.refreshToken);
    if (!userWithinRefreshToken) {
      throw new AppException(AppErrorCode.ERR401000);
    }
    if (user.username !== userWithinRefreshToken.username) {
      throw new AppException(AppErrorCode.ERR401000);
    }

    const jwtToken = await this.jwtProvider.signAuth(user);
    const jwtRefreshToken = await this.jwtProvider.signRefreshAuth(user);

    return plainToInstance(RefreshTokenResponse, { token: jwtToken, refreshToken: jwtRefreshToken });
  }
}

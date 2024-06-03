import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Auth } from '../../../shared/decorators/auth.decorator';
import { Role } from '../../../shared/enums/role.enum';
import { PaginationResponse, PaginationResponseApiType } from '../../../shared/models/pagination.response';
import { GetUserResponse } from '../models/get-user.response';
import { GetUsersQuery } from '../models/get-users.query';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth(Role.USER)
  @ApiResponse({ type: PaginationResponseApiType(GetUserResponse) })
  async getUsers(@Query() query: GetUsersQuery): Promise<PaginationResponse<GetUserResponse>> {
    return await this.userService.getUsers(query);
  }
}

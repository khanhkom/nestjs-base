import { Controller, Get, Query } from '@nestjs/common';
import { PaginationResponse } from '../../shared/models/pagination.response';
import { GetUserResponse } from '../models/get-user.response';
import { GetUsersQuery } from '../models/get-users.query';
import { UserService } from '../services/user.service';
import { Auth } from '../../shared/decorators/auth.decorator';
import { Role } from '../../shared/enums/role.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth(Role.USER)
  async getUsers(@Query() query: GetUsersQuery): Promise<PaginationResponse<GetUserResponse>> {
    return this.userService.getUsers(query);
  }
}

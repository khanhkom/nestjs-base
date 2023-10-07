import { PaginationResponse } from '../../shared/models/pagination.response';
import { UserRepository } from '../repositories/user.repository';
import { GetUsersQuery } from '../models/get-users.query';
import { GetUserResponse } from '../models/get-user.response';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(query: GetUsersQuery): Promise<PaginationResponse<GetUserResponse>> {
    return await this.userRepository.findByQuery(query);
  }
}

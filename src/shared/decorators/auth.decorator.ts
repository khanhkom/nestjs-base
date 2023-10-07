import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from './roles.decorator';

export function Auth(...roles: Role[]): ClassDecorator & MethodDecorator & PropertyDecorator {
  return applyDecorators(SetMetadata(Roles.KEY, roles), UseGuards(AuthGuard, RoleGuard));
}

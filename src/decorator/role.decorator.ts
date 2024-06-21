/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/enum/role.enum';
export const role_key = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(role_key, roles);

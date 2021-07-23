import { SetMetadata } from '@nestjs/common';

export const userLevel = {
  ADMIN: 100,
  GHOST: 0,
  MEMBER: 10,
} as const;

type userLevel = typeof userLevel[keyof typeof userLevel];

export const ROLES_KEY = 'UserLevel';
export const Roles = (...roles: userLevel[]) => SetMetadata(ROLES_KEY, roles);

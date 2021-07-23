import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY, userLevel } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const level = this.reflector.get<typeof userLevel[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!level) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const roleCheck = level.indexOf(user.user_level);
    if (roleCheck !== -1) {
      return true;
    } else {
      return false;
    }
  }
}

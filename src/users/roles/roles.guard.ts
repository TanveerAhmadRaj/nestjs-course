import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {Observable} from 'rxjs';
import {Role} from './role.enum';
import {ROLES_KEY} from '../decorators/roles.decorator';
import {Request} from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requireRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRoles) return true;
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as {roles?: Role[]};
    return requireRoles.some((role) => user.roles?.includes(role));
  }
}

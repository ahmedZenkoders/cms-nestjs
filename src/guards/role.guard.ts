import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { role_key } from 'src/decorator/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log("Inside role guard")
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(role_key, [context.getHandler(),context.getClass()]);
    const request = context.switchToHttp().getRequest();
    console.log('Rr:',requiredRoles);
    console.log('requested role:',request.user?.role)
    if (!requiredRoles ) {
      return true; 
    }
    const userRole=request.user?.role
    if(userRole && requiredRoles.includes(userRole)){
      return true;
    }
    throw new UnauthorizedException("Not allowed")
  }
}

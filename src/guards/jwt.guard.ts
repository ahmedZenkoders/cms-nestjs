/* eslint-disable prettier/prettier */
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { jwtConstant } from 'src/auth/constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      console.log('Inside jwt guard');
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];

      console.log(token);

      if (!token) {
        throw new UnauthorizedException('Token not found');
      }

      const payload = this.jwtService.verify(token, {
        secret: jwtConstant.secret,
      });
      console.log(payload);
      request.user = payload;
      console.log(request.user);

      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error.message);
    }
  }
}

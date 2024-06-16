import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { DomainService } from 'src/domain/domain.service';

@Injectable()
export class EmailDomainGuard implements CanActivate {
  constructor(private readonly domainService: DomainService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const email = request.body.email;

    if (email) {
      const domain = email.split('@')[1];
      return await this.domainService.isDomainAllowed(domain);
    }

    return false;
  }
}

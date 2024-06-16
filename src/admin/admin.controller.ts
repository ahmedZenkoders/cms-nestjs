import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { DomainService } from 'src/domain/domain.service';
import { CreateDomainDto } from 'src/domain/dto/createDomain.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly domainService: DomainService) {}

  @Post('add-domain')
  async addDomain(@Body() createdomaindto:CreateDomainDto) {
    
    const domain=await this.domainService.addAllowedDomain(createdomaindto);
    HttpCode(HttpStatus.CREATED);
    return domain;
  }
  @Post('remove-domain')
  async removeDomain(@Body() createdomaindto:CreateDomainDto) {
    const domain=await this.domainService.removeAllowedDomain(createdomaindto);
    HttpCode(HttpStatus.OK);
    return domain;
  }

}

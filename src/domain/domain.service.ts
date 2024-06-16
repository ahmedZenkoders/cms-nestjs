import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from './entities/domain';
import { CreateDomainDto } from './dto/createDomain.dto';

@Injectable()
export class DomainService {
  constructor(
    @InjectRepository(Domain)
    private domainRepository: Repository<Domain>,
  ) {}

  async getAllowedDomains(): Promise<string[]> {
    const domains = await this.domainRepository.find();
    return domains.map(domain => domain.name);
  }

  async addAllowedDomain(createdomaindto:CreateDomainDto) {
      const existingDomain = await this.domainRepository.findOne({ where: { name: createdomaindto.name } });
      if (existingDomain) {
        throw new BadRequestException(`Domain ${createdomaindto.name} already exists`);
      }
  
      const domain = await this.domainRepository.create({ name: createdomaindto.name });
      await this.domainRepository.save(domain);
      return { message: `Domain created: ${createdomaindto.name}` };
    }

  async removeAllowedDomain(createdomaindto:CreateDomainDto){
    const existingDomain=await this.domainRepository.findOne({where:{name:createdomaindto.name}});
    if(!existingDomain){
        throw new BadRequestException(`${createdomaindto.name} didn't exist `);
    }
    await this.domainRepository.delete(createdomaindto);
    return {message: `${createdomaindto.name} domain is deleted`}
  }

  async isDomainAllowed(createdomaindto:CreateDomainDto){
    const domain = await this.domainRepository.findOne({ where: { name: createdomaindto.name } });
    return !!domain;
  }
}

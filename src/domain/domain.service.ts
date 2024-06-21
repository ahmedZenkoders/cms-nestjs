/* eslint-disable prettier/prettier */
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

  async getAllowedDomains() {
    const domains = await this.domainRepository.find();
    return domains.map((domain) => domain.name);
  }

  async addAllowedDomain(createdomaindto: CreateDomainDto) {
    const existingDomain = await this.domainRepository.findOne({
      where: { name: createdomaindto.name },
    });
    if (existingDomain) {
      throw new BadRequestException(
        `Domain ${createdomaindto.name} already exists`,
      );
    }

    const domain = await this.domainRepository.create({
      name: createdomaindto.name,
    });
    await this.domainRepository.save(domain);
    return { message: `${createdomaindto.name} domain is created: ` };
  }

  async removeAllowedDomain(createdomaindto: CreateDomainDto) {
    const existingDomain = await this.domainRepository.findOne({
      where: { name: createdomaindto.name },
    });
    if (!existingDomain) {
      throw new BadRequestException(`${createdomaindto.name} didn't exist `);
    }
    await this.domainRepository.delete(createdomaindto);
    return { message: `${createdomaindto.name} domain is deleted` };
  }

  async isDomainAllowed(email) {
    const domain = email.split('@')[1];
    const allowedDomain = await this.domainRepository.findOne({
      where: { name: domain },
    });
    if (!allowedDomain) {
      throw new BadRequestException(`${domain} not exist.Enter valid domain`);
    }
    return allowedDomain;
  }
}

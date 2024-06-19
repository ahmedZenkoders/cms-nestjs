import { Module } from '@nestjs/common';
import { DomainController } from './domain.controller';
import { DomainService } from './domain.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from './entities/domain';
@Module({
  imports:[TypeOrmModule.forFeature([Domain])],
  controllers: [DomainController],
  providers: [DomainService]
})
export class DomainModule {}

/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DomainService } from 'src/domain/domain.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from 'src/domain/entities/domain';
@Module({
  imports:[TypeOrmModule.forFeature([Domain])],
  providers: [AdminService,DomainService],
  controllers: [AdminController]
})
export class AdminModule {}

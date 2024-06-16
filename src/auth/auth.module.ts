/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Admin } from 'src/admin/entities/admin';
import { DomainService } from 'src/domain/domain.service';
import { Domain } from 'src/domain/entities/domain';

@Module({
  imports:[TypeOrmModule.forFeature([Student,Teacher,Admin,Domain]),
],
  providers: [AuthService,DomainService],
  controllers: [AuthController]
})
export class AuthModule {}

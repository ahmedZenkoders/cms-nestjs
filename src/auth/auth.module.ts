import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../students/entities/student';
import { Teacher } from '../teachers/entities/teacher';
import { Admin } from '../admin/entities/admin';
import { Domain } from 'src/domain/entities/domain';
import { DomainService } from 'src/domain/domain.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Teacher, Admin,Domain]),
    PassportModule,
    JwtModule.register({
      secret: "mysecretkey",
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, DomainService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

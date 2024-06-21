/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../students/entities/student';
import { Teacher } from '../teachers/entities/teacher';
import { Admin } from '../admin/entities/admin';
import { Domain } from 'src/domain/entities/domain';
import { DomainService } from 'src/domain/domain.service';
import { jwtConstant } from './constants';
import { UploadService } from 'src/upload/upload.service';
import { Otp } from 'src/otp/entities/otp';
import { OtpService } from 'src/otp/otp.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Teacher, Admin, Domain, Otp]),
    JwtModule.register({
      secret: jwtConstant.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, DomainService, UploadService, OtpService, MailService],
  controllers: [AuthController],
})
export class AuthModule {}

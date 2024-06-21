import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { Otp } from './entities/otp';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { Admin } from 'src/admin/entities/admin';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Otp, Admin, Student, Teacher])],
  providers: [OtpService, MailService, JwtService],
  controllers: [OtpController],
})
export class OtpModule {}

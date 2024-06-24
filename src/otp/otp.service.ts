import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { Otp } from './entities/otp';
import { GenerateOtpDto } from './dto/generateOtp.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Admin } from 'src/admin/entities/admin';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private otprepository: Repository<Otp>,
    @InjectRepository(Student)
    private studentrepository: Repository<Student>,
    @InjectRepository(Teacher)
    private teacherrepository: Repository<Teacher>,
    @InjectRepository(Admin)
    private adminrepository: Repository<Admin>,
    private jwtservice: JwtService,
    private mailService: MailService,
  ) {}

  async generateOtp(generateOtpDto: GenerateOtpDto) {
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log(otp);
    const expiresAt = new Date(Date.now() + 5 * 60000);
    await this.otprepository.save({
      email: generateOtpDto.email,
      otp,
      expires_at: expiresAt,
    });
    await this.mailService.sendOtpEmail(generateOtpDto.email, otp);
    return { message: 'otp sent to email' };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto, entityType: string) {
    console.log(verifyOtpDto.email);
    const otpEntry = await this.otprepository.findOneBy({
      email: verifyOtpDto.email,
      otp: verifyOtpDto.otp,
    });
    console.log('Otp', otpEntry);
    if (!otpEntry) {
      throw new BadRequestException('Invalid OTP');
    }
    if (otpEntry.expires_at < new Date()) {
      await this.otprepository.delete(otpEntry.id);
      throw new BadRequestException('OTP expired');
    }
    let user;
    switch (entityType) {
      case 'student':
        await this.studentrepository.update(
          { email: verifyOtpDto.email },
          { is_verified: true },
        );
        user = await this.studentrepository.findOne({
          where: { email: verifyOtpDto.email },
        });
        break;
      case 'teacher':
        await this.teacherrepository.update(
          { email: verifyOtpDto.email },
          { is_verified: true },
        );
        user = await this.teacherrepository.findOne({
          where: { email: verifyOtpDto.email },
        });
        console.log('User:', user);
        break;
      case 'admin':
        await this.adminrepository.update(
          { email: verifyOtpDto.email },
          { is_verified: true },
        );
        user = await this.adminrepository.findOne({
          where: { email: verifyOtpDto.email },
        });
        break;
      default:
        throw new BadRequestException('Invalid entity type');
    }

    await this.otprepository.delete(otpEntry.id);
    const payload = { email: user.email, role: entityType };
    const token = this.jwtservice.sign(payload);
    return { data: user, token };
  }
}

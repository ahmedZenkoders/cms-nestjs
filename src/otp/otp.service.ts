import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { Otp } from './entities/otp';
import { GenerateOtpDto } from './dto/generateOtp.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';

@Injectable()
export class OtpService {
    constructor(
        @InjectRepository(Otp)
        private otpRepository: Repository<Otp>,
        private mailService: MailService,
    ) {}

    async generateOtp(generateotpdto: GenerateOtpDto): Promise<void> {
        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 5 * 60000); 
        await this.otpRepository.save({ email: generateotpdto.email, otp:otp, expires_at: expiresAt });
        await this.mailService.sendOtpEmail(generateotpdto.email, otp);
    }

    async verifyOtp(verifyotpdto:VerifyOtpDto): Promise<boolean> {
        const otpEntry = await this.otpRepository.findOne({ where: { email: verifyotpdto.email, otp:verifyotpdto.otp } });
        if (!otpEntry ) {
            throw new BadRequestException("enter valid otp")
        }
        if( otpEntry.expires_at < new Date()){
            throw new BadRequestException("otp expired")
        }
        await this.otpRepository.delete({ email: verifyotpdto.email, otp:verifyotpdto.otp });
        return true;
    }
}

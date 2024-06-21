import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER, 
                pass: process.env.SMTP_PASS, 
            },
        });
    }

    async sendOtpEmail(email: string, otp: string): Promise<void> {
        const mailOptions = {
            from: '"Course Management System" <no-reply@cms.com>', 
            to: email, 
            subject: 'Your OTP Code', 
            text: `Your OTP code is ${otp}`, 
            html: `<p>Your OTP code is <b>${otp}</b></p>`, 
        };
        await this.transporter.sendMail(mailOptions);
    }
}

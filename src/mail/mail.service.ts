/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      auth: {
        user: 'ahmed.zenkoders@gmail.com',
        pass: 'hayq qglt xnea slgt',
      },
    });
  }

  async sendOtpEmail(email: string, otp: string) {
    const mailOptions = {
      from: 'ahmed.zenkoders@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
      html: `<p>Your OTP code is <b>${otp}.Please dont share it with anyone.</b></p>`,
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendAppointmentEmail(email: string, appointment: any) {
    console.log(appointment);
    const mailOptions = {
      from: 'ahmed.zenkoders@gmail.com',
      to: email,
      subject: 'Appointment Scheduled',
      text: `Your appointment with TEACHER has been scheduled on ${appointment.appointment_date}.`,
      html: `<p>Your appointment with <b>Teacher</b> on <b>${appointment.appointment_date}</b> has been scheduled.</p>`,
    };
    await this.transporter.sendMail(mailOptions);
  }
}

/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Appointment } from 'src/appointments/entities/appointment';

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

  async sendAppointmentEmail(appointment: Appointment, status: string) {
    const studentEmail = appointment.student_id.email;
    const teacherName = appointment.teacher_id.username; 
    const appointmentDate = appointment.appointment_date; 
    console.log(studentEmail, status, teacherName);
    const mailOptions = {
        from: 'ahmed.zenkoders@gmail.com',
        to: studentEmail,
        subject: 'Appointment Status Update',
        text: `Your appointment with ${teacherName} has been ${status.toLowerCase()} on ${appointmentDate}.`,
        html: `<p>Your appointment with <b>${teacherName}</b> on <b>${appointmentDate}</b> has been <b>${status.toLowerCase()}</b>.</p>`,
    };
    await this.transporter.sendMail(mailOptions);
}

}

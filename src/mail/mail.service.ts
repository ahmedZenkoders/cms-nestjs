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

  async sendAppointmentEmail(email:string, status: string) {
    // console.log("Appointment:", appointment);
    // const studentEmail = appointment.student_id?.email;
    // const teacherName = appointment.teacher_id?.username;
    // const appointmentDate = appointment?.appointment_date;
    // console.log(studentEmail);
    // console.log(teacherName);
    // console.log(appointmentDate);
    console.log("Email from appointment service",email)

    // if (!studentEmail || !teacherName) {
    //   throw new Error('Student email or teacher name is undefined.');
    // }

    const mailOptions = {
      from: 'ahmed.zenkoders@gmail.com',
      to: email,
      subject: 'Appointment Status Update',
      text: `Your appointment with  has been on `,
      html: `<p>Your appointment with <b></b> on <b></b> has been <b>${status.toLowerCase()}</b>.</p>`,
    };

    await this.transporter.sendMail(mailOptions);
}

}

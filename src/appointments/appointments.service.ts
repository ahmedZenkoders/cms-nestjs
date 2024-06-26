/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Appointment } from './entities/appointment';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { AppointmentStatus } from 'src/enum/appointment.enum';
import { MailService } from 'src/mail/mail.service';
import { AcceptRejectDto } from './dto/acceptReject.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    private readonly mailService: MailService,
  ) {}

  async createAppointment(createAppointmentDto: CreateAppointmentDto) {
    const student = await this.studentRepository.findOne({
      where: { email: createAppointmentDto.student_id },
    });
    if (!student) {
      throw new NotFoundException("Student doesn't exist");
    }
    const teacher = await this.teacherRepository.findOne({
      where: { email: createAppointmentDto.teacher_id },
    });
    if (!teacher) {
      throw new NotFoundException("Teacher doesn't exist");
    }

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      created_at: new Date(),
      student_id: student,
      teacher_id: teacher,
    });
    this.appointmentRepository.save(appointment);

    return {
      message: 'Appointment Created Successfully',
      data: appointment,
    };
  }
  async getAllAppointments() {
    const appointments = await this.appointmentRepository.find();
    if (!appointments || appointments.length === 0) {
      throw new NotFoundException('No appointments found');
    }
    return appointments;
  }

  async getAppointmentsByTeacher(email: string) {
    const teacher = await this.teacherRepository.findOne({ where: { email } });
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    const appointments = await this.appointmentRepository.find({
      where: { teacher_id: teacher },
    });

    if (!appointments) {
      throw new NotFoundException('No appointments found for this teacher');
    }

    return appointments;
  }

  async getAppointmentsByStudent(email: string) {
    const student = await this.studentRepository.findOne({ where: { email } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    const appointments = await this.appointmentRepository.find({
      where: { student_id: student },
    });

    if (!appointments) {
      throw new NotFoundException('No appointments found for this teacher');
    }

    return appointments;
  }

  async ApproveRejectAppointment(id: number, acceptRejectDto: AcceptRejectDto) {
    const appointment = await this.appointmentRepository.findOneBy({ id });
    const student = await this.studentRepository.findOne({
      where: { email: acceptRejectDto.email },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment Not Found');
    }

    if (
      acceptRejectDto.status === 'Approved' &&
      (appointment.status === 'Pending' || appointment.status === 'Rejected')
    ) {
      appointment.status = AppointmentStatus.Approved;
      await this.mailService.sendAppointmentEmail(student.email, appointment);
    }
    if (
      acceptRejectDto.status === 'Rejected' &&
      appointment.status === 'Pending'
    ) {
      appointment.status = AppointmentStatus.Rejected;
    }
    this.appointmentRepository.save(appointment);
    return { appointment };
  }
}

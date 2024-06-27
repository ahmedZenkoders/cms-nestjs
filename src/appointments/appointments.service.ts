/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    ) { }

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
        const requestedAppointment = await this.appointmentRepository.findOne({
            where: {
                student_id: student,
                teacher_id: teacher,
                appointment_date: createAppointmentDto.appointment_date,
                start_time: createAppointmentDto.start_time,
                end_time: createAppointmentDto.end_time,
            },
        });
        if (new Date(createAppointmentDto.appointment_date) < new Date()) {
            throw new BadRequestException('Invalid Date ');
        }
        const startTime = new Date(`${createAppointmentDto.appointment_date}T${createAppointmentDto.start_time}`);
        const endTime = new Date(`${createAppointmentDto.appointment_date}T${createAppointmentDto.end_time}`);

        if (startTime >= endTime) {
            throw new BadRequestException('Start time must be before end time');
        }
        if (requestedAppointment) {
            throw new BadRequestException(
                "Can't request the same slot that you have already requested",
            );
        }
        const appointment = this.appointmentRepository.create({
            ...createAppointmentDto,
            created_at: new Date(),
            status: AppointmentStatus.Pending,
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
            const appointment = await this.appointmentRepository.findOne({ where: { id } });
            if (!appointment) {
                throw new NotFoundException('Appointment Not Found');
            }

            const student = await this.studentRepository.findOne({ where: { email: acceptRejectDto.email } });
            if (!student) {
                throw new NotFoundException('Student not found');
            }

            const teacher = await this.teacherRepository.findOne({ where: { email: appointment.teacher_id.email } });
            if (!teacher) {
                throw new NotFoundException('Teacher not found');
            }

            if (acceptRejectDto.status === 'Approved' && appointment.status === 'Approved') {
                throw new BadRequestException("Appointment Already Approved")
            }
            if (acceptRejectDto.status === 'Rejected' && appointment.status === 'Rejected') {
                throw new BadRequestException("Appointment Already Rejected")
            }
            if (acceptRejectDto.status === 'Approved' && appointment.status === 'Pending') {
                appointment.status = AppointmentStatus.Approved;
                const sameAppointments = await this.appointmentRepository.find({
                    where: {
                        teacher_id: teacher,
                        appointment_date: appointment.appointment_date,
                        start_time: appointment.start_time,
                        end_time: appointment.end_time,
                        status: AppointmentStatus.Pending,
                    },
                });
            
               if(!sameAppointments || sameAppointments.length>=1){
                for (const sameAppointment of sameAppointments) {
                    sameAppointment.status = AppointmentStatus.Rejected;
                    await this.appointmentRepository.save(sameAppointment);
                    await this.mailService.sendAppointmentEmail( sameAppointment,'Rejected');
                }
               }
            }
            else if (
                acceptRejectDto.status === 'Rejected' &&
                appointment.status === 'Pending'
            ) {
                appointment.status = AppointmentStatus.Rejected;
            }
            this.appointmentRepository.save(appointment);
            await this.mailService.sendAppointmentEmail(appointment, acceptRejectDto.status);
            return { appointment };
        }
}


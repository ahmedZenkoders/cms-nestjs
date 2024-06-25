import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Appointment } from './entities/appointment';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Slot } from 'src/slots/entities/slots';
import { AppointmentStatus } from 'src/enum/appointment.enum';
import { UpdateAppointmentDto } from './dto/updateAppointment.dto';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,
        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
        @InjectRepository(Teacher)
        private teacherRepository: Repository<Teacher>,
        @InjectRepository(Slot)
        private slotRepository: Repository<Slot>,
    ) { }

    async createAppointment(createAppointmentDto: CreateAppointmentDto) {
        const student = await this.studentRepository.findOne({ where: { email: createAppointmentDto.student_id } });
        if (!student) {
            throw new NotFoundException("Student doesn't exist");
        }
        const teacher = await this.teacherRepository.findOne({ where: { email: createAppointmentDto.teacher_id } });
        if (!teacher) {
            throw new NotFoundException("Teacher doesn't exist");
        }
        const slot = await this.slotRepository.findOne({ where: { id: createAppointmentDto.slot_id } });
        if (!slot) {
            throw new NotFoundException("Slot doesn't exist");
        }

        const existingAppointment = await this.appointmentRepository.findOne({ where: { slot_id: slot } });
        if (existingAppointment) {
            throw new ConflictException("Appointment already existed");
        }
        const appointment = this.appointmentRepository.create({
            student_id: student,
            teacher_id: teacher,
            slot_id: slot,
            appointment_date: createAppointmentDto.appointment_date,
            status: AppointmentStatus.Booked,
            created_at: new Date()
        });
        this.appointmentRepository.save(appointment);
        return {
            message: "Appointment Created Successfully",
            data: appointment
        }
    }
    async getAllAppointments() {
        const appointments = await this.appointmentRepository.find();
        if (!appointments || appointments.length === 0) {
            throw new NotFoundException('No appointments found');
        }
        return appointments;
    }

    async getAppointmentById(id: number) {
        const appointment = await this.appointmentRepository.findOneBy({id});
        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }
        return appointment;
    }

    async updateAppointment(id: number, updateAppointmentDto: UpdateAppointmentDto){

        const appointment = await this.getAppointmentById(id);
        Object.assign(appointment,updateAppointmentDto);
        return this.appointmentRepository.save(appointment);
    }

    async deleteAppointment(id: number){
        const appointment = await this.getAppointmentById(id);
        await this.appointmentRepository.delete(appointment.id);
        return {message:"Appointment Deleted Successfully"}
    }

    async getAppointmentsByTeacher(email: string) {
        const teacher = await this.teacherRepository.findOne({ where: { email } });
        if (!teacher) {
            throw new NotFoundException('Teacher not found');
        }
        const appointments = await this.appointmentRepository.find({
            where: { teacher_id: teacher },
            relations: ['student', 'slot'],
        });

        if (!appointments) {
            throw new NotFoundException('No appointments found for this teacher');
        }

        return appointments;
    }
}

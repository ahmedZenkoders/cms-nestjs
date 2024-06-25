/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { Student } from 'src/students/entities/student';

import { AppointmentStatus } from 'src/enum/appointment.enum';
import { Teacher } from 'src/teachers/entities/teacher';
import { Slot } from 'src/slots/entities/slots';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.Pending,
  })
  status: AppointmentStatus;

  @Column()
  appointment_date: Date;

  @Column()
  created_at: Date;

  @ManyToOne(() => Student, (student) => student.appointments)
  @JoinColumn({ name: 'student_id' })
  student_id: Student;

  @ManyToOne(() => Teacher, (teacher) => teacher.appointment)
  @JoinColumn({ name: 'teacher_id' })
  teacher_id: Teacher;

  @OneToOne(() => Slot)
  @JoinColumn({ name: 'slot_id' })
  slot_id: Slot;
}

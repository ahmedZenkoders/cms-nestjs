/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Student } from 'src/students/entities/student';
import { AppointmentStatus } from 'src/enum/appointment.enum';
import { Teacher } from 'src/teachers/entities/teacher';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  appointment_date: Date;

  @Column({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.Pending,
  })
  status: AppointmentStatus;

  @ManyToOne(() => Student, (student) => student.appointments)
  @JoinColumn({ name: 'student_id' })
  student_id: Student;

  @ManyToOne(() => Teacher, (teacher) => teacher.appointment)
  @JoinColumn({ name: 'teacher_id' })
  teacher_id: Teacher;
}

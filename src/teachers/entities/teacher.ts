/* eslint-disable prettier/prettier */
import { Appointment } from 'src/appointments/entities/appointment';
import { Course } from 'src/courses/entities/course';
import { Slot } from 'src/slots/entities/slots';

import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'teachers' })
export class Teacher {
  @PrimaryColumn()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column()
  contact: string;

  @Column()
  age: number;

  @Column({ nullable: true })
  img: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @Column({ default: 'false' })
  is_suspended: boolean;

  @Column({ default: 'false' })
  is_verified: boolean;

  @Column({ default: 'teacher' })
  role: string;

  @OneToMany(() => Course, (course) => course.teacher_id)
  courses: Course;

  @OneToMany(() => Slot, (slot) => slot.teacher_id)
  slots: Slot;

  @OneToMany(() => Appointment, (appointment) => appointment.teacher_id)
  appointment: Appointment;
}

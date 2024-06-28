/* eslint-disable prettier/prettier */

import { Appointment } from 'src/appointments/entities/appointment';
import { Enrolment } from 'src/enrolment/entities/enrolment';
import { Message } from 'src/messages/entities/message';
import { Teacher } from 'src/teachers/entities/teacher';
import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity({ name: 'students' })
export class Student {
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

  @Column({ default: 'student' })
  role: string;

  @OneToMany(() => Enrolment, (enrolment) => enrolment.course_code)
  enrolments: Enrolment;

  @OneToMany(() => Appointment, (appointment) => appointment.student_id)
  appointments: Appointment;

  @ManyToOne(() => Teacher, (teacher) => teacher.courses)
  teacher_id: Teacher;

  @OneToMany(() => Message, (messages) => messages.senderStudent)
  sentMessages: Message;

  @OneToMany(() => Message, (messages) => messages.receiverStudent)
  receiveMessages: Message;
}

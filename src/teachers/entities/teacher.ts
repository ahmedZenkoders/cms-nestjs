/* eslint-disable prettier/prettier */
import { Appointment } from 'src/appointments/entities/appointment';
import { Chat } from 'src/chat/entities/chat';
import { Course } from 'src/courses/entities/course';
import { Message } from 'src/messages/entities/message';
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

  @OneToMany(()=>Message,(messages)=>messages.senderTeacher)
  sentMessages:Message;

  @OneToMany(()=>Message,(messages)=>messages.receiverTeacher)
  receiveMessages:Message;

  @OneToMany(()=> Chat,(chat)=> chat.teacher_id)
  chat_id:Chat
}

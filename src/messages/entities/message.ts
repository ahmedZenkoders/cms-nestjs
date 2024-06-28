/* eslint-disable prettier/prettier */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Chat } from 'src/chat/entities/chat';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Student, (student) => student.sentMessages, {
    nullable: true,
  })
  @JoinColumn({ name: 'sender_student_id' })
  senderStudent: Student;

  @ManyToOne(() => Teacher, (teacher) => teacher.sentMessages, {
    nullable: true,
  })
  @JoinColumn({ name: 'sender_teacher_id' })
  senderTeacher: Teacher;

  @ManyToOne(() => Student, (student) => student.receiveMessages, {
    nullable: true,
  })
  @JoinColumn({ name: 'receiver_student_id' })
  receiverStudent: Student;

  @ManyToOne(() => Teacher, (teacher) => teacher.receiveMessages, {
    nullable: true,
  })
  @JoinColumn({ name: 'receiver_teacher_id' })
  receiverTeacher: Teacher;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  @JoinColumn({ name: 'chat_id' })
  chat_id: Chat;
}

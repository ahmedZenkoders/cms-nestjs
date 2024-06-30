/* eslint-disable prettier/prettier */
import { Message } from 'src/messages/entities/message';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  Column
} from 'typeorm';

@Entity({ name: 'chats' })
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Student,student=>student.chat_id, { nullable: true })
  student_id: Student;

  @ManyToOne(() => Teacher,teacher=>teacher.chat_id, { nullable: true })
  teacher_id: Teacher;


  @OneToMany(() => Message, (message) => message.chat_id)
  message_id: Message;
}



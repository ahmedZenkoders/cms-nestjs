/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/createChat.dto';
import { Chat } from './entities/chat';
import { Student } from '../students/entities/student';
import { Teacher } from '../teachers/entities/teacher';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async createChat(createChatDto: CreateChatDto) {
    const student = await this.studentRepository.findOneBy({
      email: createChatDto.studentId,
    });
    if (!student) {
      throw new NotFoundException(
        `Student with ID ${createChatDto.studentId} not found`,
      );
    }

    const teacher = await this.teacherRepository.findOneBy({
      email: createChatDto.teacherId,
    });
    if (!teacher) {
      throw new NotFoundException(
        `Teacher with ID ${createChatDto.teacherId} not found`,
      );
    }

    const existingChat = await this.chatRepository.findOne({
      where: {
        student_id: student,
        teacher_id: teacher,
      },
    });

    if (existingChat) {
      throw new ConflictException(
        `Chat already exists between Student ${student.email} and Teacher ${teacher.email}`,
      );
    }

    const newChat = this.chatRepository.create({
      student_id: student,
      teacher_id: teacher,
      createdAt: new Date(Date.now()),
    });
    return this.chatRepository.save(newChat);
  }
}

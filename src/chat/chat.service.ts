/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat';
import { Message } from 'src/messages/entities/message';
import { CreateMessageDto } from 'src/messages/dto/createMessage.dto';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createChat(createMessageDto: CreateMessageDto) {
    console.log(createMessageDto);
    let sender, receiver;

    if (createMessageDto.senderType === 'student') {
      sender = await this.studentRepository.findOne({
        where: { email: createMessageDto.senderEmail },
      });
      if (!sender) {
        throw new BadRequestException('Sender student not found.');
      }
    } else {
      sender = await this.teacherRepository.findOne({
        where: { email: createMessageDto.senderEmail },
      });
      if (!sender) {
        throw new BadRequestException('Sender teacher not found.');
      }
    }

    if (createMessageDto.receiverType === 'student') {
      receiver = await this.studentRepository.findOne({
        where: { email: createMessageDto.receiverEmail },
      });
      if (!receiver) {
        throw new BadRequestException('Receiver student not found.');
      }
    } else {
      receiver = await this.teacherRepository.findOne({
        where: { email: createMessageDto.receiverEmail },
      });
      if (!receiver) {
        throw new BadRequestException('Receiver teacher not found.');
      }
    }

    const message = await this.messageRepository.create({
      ...createMessageDto,
    });

    return this.chatRepository.save();
  }
}

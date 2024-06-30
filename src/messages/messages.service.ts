import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/createMessage.dto';
import { Message } from './entities/message';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Chat } from 'src/chat/entities/chat';
import { ChatGateway } from 'src/chat/chat.gateway';

@Injectable()
export class MessageService {
constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    
) { }

 async createMessage(createMessageDto: CreateMessageDto) {

    let sender: Student | Teacher;
    let receiver: Student | Teacher;

    if (createMessageDto.senderStudentId) {
        sender = await this.studentRepository.findOneBy({ email: createMessageDto.senderStudentId });
        if (!sender) {
            throw new NotFoundException(`Sender student with email ${createMessageDto.senderStudentId} not found`);
        }
    } else if (createMessageDto.senderTeacherId) {
        sender = await this.teacherRepository.findOneBy({ email: createMessageDto.senderTeacherId });
        if (!sender) {
            throw new NotFoundException(`Sender teacher with email ${createMessageDto.senderTeacherId} not found`);
        }
    }

    if (createMessageDto.receiverStudentId) {
        receiver = await this.studentRepository.findOneBy({ email: createMessageDto.receiverStudentId });
        if (!receiver) {
            throw new NotFoundException(`Receiver student with email ${createMessageDto.receiverStudentId} not found`);
        }
    } else if (createMessageDto.receiverTeacherId) {
        receiver = await this.teacherRepository.findOneBy({ email: createMessageDto.receiverTeacherId });
        if (!receiver) {
            throw new NotFoundException(`Receiver teacher with email ${createMessageDto.receiverTeacherId} not found`);
        }
    }
    const chat = await this.chatRepository.findOneBy({ id: createMessageDto.chatId });
    if (!chat) {
        throw new NotFoundException(`Chat with id ${createMessageDto.chatId} not found`);
    }

    const message = this.messageRepository.create({
        content: createMessageDto.content,
        createdAt: new Date(Date.now()),
        senderStudent: sender instanceof Student ? sender : null,
        senderTeacher: sender instanceof Teacher ? sender : null,
        receiverStudent: receiver instanceof Student ? receiver : null,
        receiverTeacher: receiver instanceof Teacher ? receiver : null,
        chat_id: chat,
        });

    await this.messageRepository.save(message);
    
    return message;

    }
}
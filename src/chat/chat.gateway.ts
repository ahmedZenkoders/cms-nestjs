/* eslint-disable prettier/prettier */
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessageService } from 'src/messages/messages.service';
import { CreateMessageDto } from '../messages/dto/createMessage.dto';
import { JoinChatDto } from './dto/joinUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Chat } from './entities/chat';
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private messageService: MessageService,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() joinChatDto: JoinChatDto,
  ) {
    const chat_id = joinChatDto.chatId.toString();
    console.log(typeof chat_id);
    let user;
    try {
      user = await this.studentRepository.findOneBy({
        email: joinChatDto.userId,
      });
      if (!user) {
        user = await this.teacherRepository.findOneBy({
          email: joinChatDto.userId,
        });
      }
      if (!user) {
        throw new NotFoundException('User Not found');
      }

      const existingChat = await this.chatRepository.findOneBy({
        id: joinChatDto.chatId,
      });
      if (!existingChat) {
        throw new BadRequestException(`Chat Not Found`);
      }

      client.join(chat_id);
      console.log(`Client ${client.id} joined chat ${joinChatDto.chatId}`);
      client
        .to(chat_id)
        .emit(
          'newMessage',
          `message: User ${joinChatDto.userId} joined the chat `,
        );
    } catch (error) {
      console.error(
        `Error joining chat ${joinChatDto.chatId}: ${error.message}`,
      );
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    try {
      const stringChatId = createMessageDto.chatId.toString();
      const message = await this.messageService.createMessage(createMessageDto);
      console.log(message);
      client.to(stringChatId).emit('newMessage', message.content);

      console.log(message);
    } catch (error) {
      console.error(`Error sending message: ${error.message}`);
    }
  }
}

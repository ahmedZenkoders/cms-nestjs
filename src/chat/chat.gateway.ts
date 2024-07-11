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

import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { Chat } from './entities/chat';
import { JwtService } from '@nestjs/jwt';
import { jwtConstant } from 'src/auth/constants';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/createChat.dto';
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
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
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
    @MessageBody() createChatDto: CreateChatDto,
  ) {
    const userToken = client.handshake.headers.authorization.split(
      ' ',
    )[1] as string;

    const user = await this.jwtService.verify(userToken, {
      secret: jwtConstant.secret,
    });
    console.log(user);
    const requestedEmail = user.email;
    if (
      requestedEmail === createChatDto.studentId ||
      requestedEmail === createChatDto.teacherId
    ) {
      const chatId = await this.chatService.createChat(createChatDto);
      console.log(chatId);

      const canJoin = await this.chatService.canUserJoinChat(
        chatId,
        requestedEmail,
      );

      if (canJoin) {
        client.join(chatId.toString());
        const socketId = client.id;
        console.log(`${socketId} has joined room ${chatId}`);
      }
    }
    throw new UnauthorizedException('You are not authorized to join this chat');
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

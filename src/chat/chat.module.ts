/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatsController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Message } from 'src/messages/entities/message';
import { MessageService } from 'src/messages/messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Student, Teacher,Message])],
  providers: [ChatService,MessageService,ChatGateway],
  controllers: [ChatsController],
})
export class ChatModule {}

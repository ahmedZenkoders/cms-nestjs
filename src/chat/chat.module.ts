/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatsController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Student, Teacher])],
  providers: [ChatService, ChatGateway],
  controllers: [ChatsController],
})
export class ChatModule {}

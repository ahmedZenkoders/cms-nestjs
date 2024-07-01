/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessageService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from 'src/teachers/entities/teacher';
import { Chat } from 'src/chat/entities/chat';
import { Student } from 'src/students/entities/student';
import { Message } from './entities/message';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Teacher, Chat, Student])],
  controllers: [MessagesController],
  providers: [MessageService],
})
export class MessagesModule {}

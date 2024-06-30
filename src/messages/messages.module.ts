import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessageService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from 'src/teachers/entities/teacher';
import { Chat } from 'src/chat/entities/chat';
import { Student } from 'src/students/entities/student';
import { Message } from './entities/message';
import { ChatGateway } from 'src/chat/chat.gateway';
import { ChatService } from 'src/chat/chat.service';

@Module({
  imports:[TypeOrmModule.forFeature([Message,Teacher,Chat,Student])],
  controllers: [MessagesController],
  providers: [MessageService,ChatGateway]
})
export class MessagesModule {}

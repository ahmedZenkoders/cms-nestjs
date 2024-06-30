/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/createChat.dto';
import { ChatGateway } from './chat.gateway';

@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatsGateway: ChatGateway,
  ) {}

  
}

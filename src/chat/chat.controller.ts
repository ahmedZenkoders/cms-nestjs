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

  @Post('/chat')
  async createChatMessage(@Body() createChatDto: CreateChatDto) {
    const newMessage = await this.chatService.createChat(createChatDto);
    this.chatsGateway.server.emit('onMessage', {
      msg: 'New message',
      content: newMessage,
    });
    return newMessage;
  }
}

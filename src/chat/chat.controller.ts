/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/createChat.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/createChat')
  async CreateChat(@Body() createChatDto: CreateChatDto) {
    return await this.chatService.createChat(createChatDto);
  }
}

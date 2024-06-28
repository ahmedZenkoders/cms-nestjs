/* eslint-disable prettier/prettier */
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from 'src/messages/dto/createMessage.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    this.server = server;
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('connected');
    });
  }

  @SubscribeMessage('newMessage')
  async onNewMessage(@MessageBody() createMeesageDto: CreateMessageDto) {
    const newMessage = await this.chatService.createChat(createMeesageDto);
    this.server.emit('onMessage', {
      msg: 'New message',
      content: newMessage,
    });
  }
}

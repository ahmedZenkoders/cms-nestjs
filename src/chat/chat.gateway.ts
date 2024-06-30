import { WebSocketGateway, WebSocketServer, OnGatewayInit, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageService } from 'src/messages/messages.service';
import { CreateMessageDto } from '../messages/dto/createMessage.dto'; 

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  constructor(
    private readonly messageService: MessageService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  @SubscribeMessage('newMessage')
  async handleNewMessage(client: any, createMessageDto: CreateMessageDto){
    try {
      const message = await this.messageService.createMessage(createMessageDto);
      this.server.emit('newMessage', message); 
    } catch (error) {
      console.error('Error creating message:', error.message);
      throw error; 
    }
  }
}

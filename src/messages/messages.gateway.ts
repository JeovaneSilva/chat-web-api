import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() payload: { content: string; senderId: number; conversationId: number }) {
 
    const newMessage = await this.messagesService.createMessage(payload);

    this.server.emit('message', newMessage);

    return newMessage;
  }
}

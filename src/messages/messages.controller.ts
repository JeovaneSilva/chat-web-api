import { Controller, Get, Post, Body, Query, NotFoundException } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // Endpoint para criar uma nova mensagem
  @Post('create')
  async createMessage(
    @Body() createMessageDto: { content: string; senderId: number; conversationId: number },
  ) {
    return this.messagesService.createMessage(createMessageDto);
  }

  // Endpoint para buscar mensagens de uma conversa específica
  @Get('conversation')
  async getMessagesByConversation(@Query('conversationId') conversationId: string) {
    const conversationIdNumber = parseInt(conversationId, 10);
    if (isNaN(conversationIdNumber)) {
      throw new NotFoundException('ID da conversa inválido');
    }

    const messages = await this.messagesService.getMessagesByConversationId(conversationIdNumber);
    if (!messages.length) {
      throw new NotFoundException('Nenhuma mensagem encontrada para esta conversa');
    }
    return messages;
  }
}

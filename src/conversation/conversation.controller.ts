import { Controller, Get, Post, Body, Query, Param, NotFoundException } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  // Endpoint para criar uma conversa
  @Post('create')
  async createConversation(
    @Body('user1Id') user1Id: number,
    @Body('user2Id') user2Id: number,
  ) {
    return this.conversationService.createConversation(user1Id, user2Id);
  }

  // Endpoint para buscar todas as conversas
  @Get()
  findAll() {
    return this.conversationService.findAll();
  }

  // Endpoint para buscar conversas de um usuário específico
  @Get('user')
  async getConversationsByUser(@Query('userId') userId: number) {
    const conversations = await this.conversationService.getConversationsByUserId(userId);
    if (!conversations.length) {
      throw new NotFoundException('Nenhuma conversa encontrada para este usuário');
    }
    return conversations;
  }

  // Endpoint para buscar uma conversa específica
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationService.findOne(+id);
  }
}
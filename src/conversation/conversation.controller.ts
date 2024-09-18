import { Controller, Get, Post, Body, Query, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async createConversation(
    @Body('user1Id') user1Id: number,
    @Body('user2Id') user2Id: number,
  ) {
    return this.conversationService.createConversation(user1Id, user2Id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.conversationService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async getConversationsByUser(@Query('userId') userId: number) {
    const conversations = await this.conversationService.getConversationsByUserId(userId);
    if (!conversations.length) {
      throw new NotFoundException('Nenhuma conversa encontrada para este usuário');
    }
    return conversations;
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationService.findOne(+id);
  }
}
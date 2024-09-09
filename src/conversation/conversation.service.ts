import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  // Cria uma nova conversa entre dois usuários
  async createConversation(user1Id: number, user2Id: number) {
    return this.prisma.conversation.create({
      data: {
        user1: { connect: { id: user1Id } },
        user2: { connect: { id: user2Id } },
      },
    });
  }

  // Buscar todas as conversas com detalhes dos usuários e mensagens
  findAll() {
    return this.prisma.conversation.findMany({
      include: {
        user1: true,
        user2: true,
        messages: true,
      },
    });
  }

  async getConversationsByUserId(userId: number) {
    const parsedUserId = Number(userId); // Converter para número, se necessário
    return this.prisma.conversation.findMany({
      where: {
        OR: [
          { user1Id: parsedUserId },
          { user2Id: parsedUserId },
        ],
      },
      include: {
        user1: true,
        user2: true,
      },
    });
  }

  // Buscar uma conversa específica pelo ID
  findOne(id: number) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        user1: true,
        user2: true,
        messages: true,
      },
    });
  }

  update(id: number) {
    // Implementação da lógica de atualização se necessário
  }

  remove(id: number) {
    // Implementação da lógica de remoção se necessário
  }
}
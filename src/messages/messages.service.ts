import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  // Criar uma nova mensagem
  async createMessage(createMessageDto: {
    content: string;
    senderId: number;
    conversationId: number;
  }) {
    return this.prisma.message.create({
      data: createMessageDto,
    });
  }

  // Buscar mensagens de uma conversa específica
  async getMessagesByConversationId(conversationId: number) {
    return this.prisma.message.findMany({
      where: { conversationId },
      include: { sender: true },
    });
  }

  update(id: number) {
    // Implementação da lógica de atualização se necessário
  }

  remove(id: number) {
    // Implementação da lógica de remoção se necessário
  }
}

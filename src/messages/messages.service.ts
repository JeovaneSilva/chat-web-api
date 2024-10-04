import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async createMessage(createMessageDto: {
    content: string;
    senderId: number;
    conversationId: number;
  }) {
    return this.prisma.message.create({
      data: createMessageDto,
    });
  }

  async getMessagesByConversationId(conversationId: number) {
    return this.prisma.message.findMany({
      where: { conversationId },
      include: { sender: true },
    });
  }
}

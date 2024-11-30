import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateMessageDto } from './dto/update-message.dto';

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
      include: { user: true },
    });
  }

  async updateMessage(id: number, UpdateMessageDto: {
    content: string;
  }) {
    return await this.prisma.message.update({
      where: { id },
      data: UpdateMessageDto,
    });
  }
}

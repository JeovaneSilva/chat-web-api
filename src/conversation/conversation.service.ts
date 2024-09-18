import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async createConversation(user1Id: number, user2Id: number) {
    return this.prisma.conversation.create({
      data: {
        user1: { connect: { id: user1Id } },
        user2: { connect: { id: user2Id } },
      },
    });
  }

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
    const parsedUserId = Number(userId);
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
    
  }

  remove(id: number) {
    
  }
}
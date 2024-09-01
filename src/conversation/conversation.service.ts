import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  create(createConversationDto: CreateConversationDto) {
    return this.prisma.conversation.create({ data: createConversationDto });
  }

  findAll() {
    return this.prisma.conversation.findMany({
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                id:true,
                name: true,
                email: true,
              },
            },
            createdAt: true,
          },
          orderBy: {
            createdAt: 'asc'
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.conversation.findUnique({
      where: {id},
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                id:true,
                name: true,
                email: true,
              },
            },
            createdAt: true,
          },
          orderBy: {
            createdAt: 'asc'
          },
        },
      },
    });
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}

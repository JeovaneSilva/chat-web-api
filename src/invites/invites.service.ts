import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InviteStatus } from '@prisma/client';

@Injectable()
export class InvitesService {
  constructor(private prisma: PrismaService) {}

  // Enviar um convite de amizade
  async sendInvite(senderId: number, receiverId: number) {
    return this.prisma.invite.create({
      data: {
        senderId,
        receiverId,
        status: InviteStatus.PENDING,
      },
    });
  }

  // Aceitar um convite de amizade
  async acceptInvite(inviteId: number) {
    return this.prisma.invite.update({
      where: { id: inviteId },
      data: { status: InviteStatus.ACCEPTED },
    });
  }

  // Recusar um convite de amizade
  async declineInvite(inviteId: number) {
    return this.prisma.invite.update({
      where: { id: inviteId },
      data: { status: InviteStatus.DECLINED },
    });
  }

  // Listar convites recebidos por um usuário
  async getReceivedInvites(userId: number) {
    return this.prisma.invite.findMany({
      where: { receiverId: userId, status: InviteStatus.PENDING },
      include: {
        sender: true, // Para incluir detalhes do remetente
      },
    });
  }

  // Listar convites enviados por um usuário
  async getSentInvites(userId: number) {
    return this.prisma.invite.findMany({
      where: { senderId: userId },
      include: {
        receiver: true, // Para incluir detalhes do destinatário
      },
    });
  }
}

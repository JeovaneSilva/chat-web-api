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
  async acceptInvite(inviteId: string) {
    return this.prisma.invite.update({
      where: { id: Number(inviteId) },
      data: { status: InviteStatus.ACCEPTED },
    });
  }

  // Recusar um convite de amizade
  async declineInvite(inviteId: string) {
    return this.prisma.invite.update({
      where: { id: Number(inviteId) },
      data: { status: InviteStatus.DECLINED },
    });
  }
  // Obter tanto os convites enviados quanto os recebidos por um usuário
  async getInvites(userId: number) {
    const sentInvites = await this.prisma.invite.findMany({
      where: { senderId: userId },
      include: {
        receiver: true, // Inclui detalhes do destinatário
      },
    });

    const receivedInvites = await this.prisma.invite.findMany({
      where: { receiverId: userId },
      include: {
        sender: true, // Inclui detalhes do remetente
      },
    });

    return {
      sentInvites,
      receivedInvites,
    };
  }
  
}

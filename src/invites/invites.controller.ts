import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @UseGuards(AuthGuard)
  @Post('send')
  async sendInvite(
    @Body('senderId') senderId: number,
    @Body('receiverId') receiverId: number,
  ) {
    return this.invitesService.sendInvite(senderId, receiverId);
  }

  // Rota para aceitar um convite de amizade
  @UseGuards(AuthGuard)
  @Post('accept/:id')
  async acceptInvite(@Param('id') inviteId: number) {
    return this.invitesService.acceptInvite(inviteId);
  }

  // Rota para recusar um convite de amizade
  @UseGuards(AuthGuard)
  @Post('decline/:id')
  async declineInvite(@Param('id') inviteId: number) {
    return this.invitesService.declineInvite(inviteId);
  }

  // Rota para listar convites recebidos
  @UseGuards(AuthGuard)
  @Get('received/:userId')
  async getReceivedInvites(@Param('userId') userId: number) {
    return this.invitesService.getReceivedInvites(userId);
  }

  // Rota para listar convites enviados
  @UseGuards(AuthGuard)
  @Get('sent/:userId')
  async getSentInvites(@Param('userId') userId: number) {
    return this.invitesService.getSentInvites(userId);
  }
}

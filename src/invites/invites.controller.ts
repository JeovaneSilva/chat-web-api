// invites.controller.ts

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

  @UseGuards(AuthGuard)
  @Post('accept/:id')
  async acceptInvite(@Param('id') inviteId: string) {
    return this.invitesService.acceptInvite(inviteId);
  }

  @UseGuards(AuthGuard)
  @Post('decline/:id')
  async declineInvite(@Param('id') inviteId: string) {
    return this.invitesService.declineInvite(inviteId);
  }

  // Rota para listar convites enviados e recebidos
  @UseGuards(AuthGuard)
  @Get('all/:userId')
  async getInvites(@Param('userId') userId: string) {
    return this.invitesService.getInvites(Number(userId));
  }
}

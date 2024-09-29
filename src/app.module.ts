import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { InvitesModule } from './invites/invites.module';

@Module({
  imports: [UsersModule, PrismaModule, ConversationModule, MessagesModule, AuthModule, InvitesModule]
})
export class AppModule {}

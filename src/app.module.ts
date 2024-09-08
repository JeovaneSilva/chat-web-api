import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { AppGateway } from './app/app.gateway';

@Module({
  imports: [UsersModule, PrismaModule, ConversationModule, MessagesModule, AuthModule],
  providers: [ AppGateway]
})
export class AppModule {}

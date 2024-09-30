import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { InvitesModule } from './invites/invites.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Pasta onde as imagens estão
      serveRoot: '/uploads', // Rota base para acessar os arquivos
    }),
    UsersModule,
    PrismaModule,
    ConversationModule,
    MessagesModule,
    AuthModule,
    InvitesModule,
  ],
})
export class AppModule {}

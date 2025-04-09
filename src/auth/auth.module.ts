import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    JwtModule.register({
      global: true, // Define o módulo como global
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard], // Registra o AuthGuard
  exports: [AuthService, JwtModule, AuthGuard], // Exporta o AuthGuard para outros módulos
})
export class AuthModule {}

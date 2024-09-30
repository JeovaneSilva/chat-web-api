import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
      ) {}

  async signIn(params: AuthDto): Promise<{ access_token: string }>{

    const user = await this.prisma.user.findUnique({
        where: { email: params.email },
      });

    if (!user) throw new NotFoundException('User not found');

    const passwordMatch = await bcrypt.compare(params.password, user.password);

    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, username: user.name, email: user.email, foto: user.profilePicture};

    return {
        access_token: await this.jwtService.signAsync(payload),
      };
  }
}
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async generateAccessToken(userId: number, userName: string, fotoPerfil: string) {
    const payload = {
      sub: userId,
      username: userName,
      foto: fotoPerfil,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: '15m', // apenas access token
    });

    return { access_token: accessToken };
  }

  async signIn(params: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: params.email },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    const passwordMatch = await bcrypt.compare(params.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Credenciais inválidas');

    return this.generateAccessToken(user.id, user.name, user.profilePicture);
  }

  async solicitarRedefinicaoSenha(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const token = this.jwtService.sign({ email: user.email });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const link = `http://localhost:3000/Redefinir-senha/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Redefinição de Senha',
      text: `Para redefinir sua senha, clique no link: ${link}`,
    };

    await transporter.sendMail(mailOptions);
    return { message: 'Link de redefinição enviado para o seu e-mail' };
  }

  async redefinirSenha(token: string, novaSenha: string) {
    try {
      const decoded = this.jwtService.verify(token) as { email: string };
      const user = await this.prisma.user.findUnique({
        where: { email: decoded.email },
      });
      const senhaHash = await bcrypt.hash(novaSenha, 10);

      if (!user) throw new NotFoundException('Usuário não encontrado');

      await this.prisma.user.update({
        where: { email: user.email },
        data: { password: senhaHash },
      });

      return { message: `Senha redefinida com sucesso!` };
    } catch (error) {
      throw new BadRequestException('Token inválido ou expirado');
    }
  }
}

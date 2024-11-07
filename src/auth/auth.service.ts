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

  async signIn(params: AuthDto): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: params.email },
    });

    if (!user) throw new NotFoundException('User not found');

    const passwordMatch = await bcrypt.compare(params.password, user.password);

    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: user.id,
      username: user.name,
      email: user.email,
      foto: user.profilePicture,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // Método para solicitar redefinição de senha
  async solicitarRedefinicaoSenha(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    // Criação do token com expiração
    const token = this.jwtService.sign({ email: user.email });

    // Configuração do Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // ou outro provedor de e-mail
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Configuração do e-mail
    const link = `http://localhost:3000/Redefinir-senha/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Redefinição de Senha',
      text: `Para redefinir sua senha, clique no link: ${link}`,
    };

    // Envio do e-mail
    await transporter.sendMail(mailOptions);
    return { message: 'Link de redefinição enviado para o seu e-mail' };
  }

  // Método para redefinir senha
  async redefinirSenha(token: string, novaSenha: string) {
    try {
      const decoded = this.jwtService.verify(token) as { email: string };
      const user = await this.prisma.user.findUnique({
        where: { email: decoded.email },
      });
      const senhaHash = await bcrypt.hash(novaSenha, 10);

      if (!user) throw new NotFoundException('Usuário não encontrado');

      // Atualizar a senha
      await this.prisma.user.update({
        where: { email: user.email },
        data: { password: senhaHash }, // Adicione hash para segurança
      });
      return { message: `Senha redefinida com sucesso!` };
    } catch (error) {
      throw new BadRequestException('Token inválido ou expirado');
    }
  }
}

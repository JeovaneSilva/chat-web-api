import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() body: AuthDto) {
    return this.authService.signIn(body);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.sub;
  }

  @Post('recuperar-senha')
  async solicitarRedefinicao(@Body('email') email: string) {
    return this.authService.solicitarRedefinicaoSenha(email);
  }

  @Post('redifinirsenha/:token')
  async redefinirSenha(
    @Param('token') token: string,
    @Body('novaSenha') novaSenha: string,
  ) {
    
    return this.authService.redefinirSenha(token, novaSenha);
  }
}
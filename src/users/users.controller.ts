import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as sharp from 'sharp';
import { supabase } from './supabase-client'; // Cliente do Supabase

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: multer.memoryStorage(), // Armazena o arquivo na memória
    }),
  )
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      try {
        // Redimensiona a imagem usando Sharp
        const resizedImageBuffer = await sharp(file.buffer)
          .resize(200, 200, { fit: sharp.fit.cover })
          .toBuffer();

        // Gera um nome único para o arquivo
        const uniqueFileName = `${Date.now()}-${file.originalname}`;

        // Faz o upload para o Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-pictures') // Bucket do Supabase
          .upload(uniqueFileName, resizedImageBuffer, {
            contentType: file.mimetype, // Define o tipo MIME
          });

        if (uploadError) {
          throw new Error(
            `Erro ao fazer upload para o Supabase: ${uploadError.message}`,
          );
        }

        // Gera a URL pública da imagem
        const { publicUrl } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(uniqueFileName).data;

        // Salva os dados do usuário com a URL da imagem no banco
        return this.usersService.create({
          ...createUserDto,
          profilePicture: publicUrl, // Salva a URL pública no banco
        });
      } catch (err) {
        throw new Error(`Erro ao processar imagem: ${err.message}`);
      }
    }

    // Caso nenhum arquivo seja enviado
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.getUserById(+id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // Rota para atualizar a foto de perfil
  @UseGuards(AuthGuard)
  @Patch('updateProfilePicture')
  @UseInterceptors(
    FileInterceptor('profilePicture', { storage: multer.memoryStorage() }),
  )
  async updateProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) {
      throw new Error('Nenhum arquivo enviado.');
    }

    const userId = req.user.userId; // Obtém o ID do usuário autenticado do token
    return this.usersService.updateProfilePicture(userId, file);
  }
}

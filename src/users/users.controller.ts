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
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as sharp from 'sharp'; // Importa a biblioteca Sharp
import * as fs from 'fs'; // Importa o módulo de filesystem do Node.js para deletar arquivos

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './temp', // Salva a imagem temporariamente em /temp
        filename: (req, file, cb) => {
          // Gerando nome único para o arquivo
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const tempFilePath = file.path; // Caminho do arquivo temporário
      const outputFilePath = `./uploads/profile_pictures/${file.filename}`; // Caminho do arquivo final

      // Redimensiona a imagem para 200x200 pixels e corta para manter o aspecto quadrado
      await sharp(tempFilePath)
        .resize(200, 200, {
          fit: sharp.fit.cover, // Mantém a imagem centralizada e quadrada
        })
        .toFile(outputFilePath); // Salva a imagem redimensionada no destino final

      // Deleta o arquivo temporário após o processamento
      fs.unlinkSync(tempFilePath);

      return this.usersService.create({
        ...createUserDto,
        profilePicture: file.filename, // Salva o nome do arquivo redimensionado
      });
    }

    // Caso não tenha arquivo de imagem, cria o usuário sem profilePicture
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: number) {
    const user = await this.usersService.getUserById(id);
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
}

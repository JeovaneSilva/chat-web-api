import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as sharp from 'sharp';
import { supabase } from './supabase-client'; // Supabase client import

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const hashPassword = await bcrypt.hash(data.password, 10);

    // Salvando o caminho da foto de perfil (profilePicture)
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashPassword,
        profilePicture: data.profilePicture,
      }, // profilePicture adicionado
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  // Atualiza a foto de perfil no Supabase e no banco de dados
  async updateProfilePicture(userId: number, file: Express.Multer.File) {
    if (!file) {
      throw new Error('Nenhum arquivo de imagem enviado.');
    }

    // Gera um nome único para o arquivo
    const uniqueFileName = `${Date.now()}-${file.originalname}`;

    // Redimensiona a imagem usando Sharp
    const resizedImageBuffer = await sharp(file.buffer)
      .resize(200, 200, { fit: sharp.fit.cover })
      .toBuffer();

    // Faz o upload da imagem para o bucket do Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-pictures') // Nome do bucket
      .upload(uniqueFileName, resizedImageBuffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      throw new Error(`Erro ao fazer upload para o Supabase: ${uploadError.message}`);
    }

    // Obtém a URL pública do arquivo no Supabase
    const { publicUrl } = supabase.storage.from('profile-pictures').getPublicUrl(uniqueFileName).data;

    // Atualiza o caminho da foto de perfil no banco de dados
    return this.prisma.user.update({
      where: { id: userId },
      data: { profilePicture: publicUrl },
    });
  }
}

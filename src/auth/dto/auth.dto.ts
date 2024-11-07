import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
    @IsEmail({}, { message: "Formato de email inválido" })
    @IsNotEmpty({ message: "O email não pode ser vazio" })
    email: string;

    @IsString({ message: "A senha deve ser uma string" })
    @IsNotEmpty({ message: "A senha não pode ser vazia" })
    @MinLength(4, { message: "A senha deve ter pelo menos 4 caracteres" })
    password: string
}

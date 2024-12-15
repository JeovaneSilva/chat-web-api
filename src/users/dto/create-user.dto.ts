import { IsAlpha, IsAlphanumeric, IsEmail, IsNotEmpty, IsOptional, IsString, Length, MinLength } from "class-validator"


export class CreateUserDto {
    @IsEmail({},{message:"Formato de email invalido"})
    @IsNotEmpty({message:"Email não pode ser vazio"})
    email: string;

    @IsString({message:"Nome deve ser uma string"})
    @IsNotEmpty({message: "Nome não pode ser vazio"})
    @MinLength(3,{message:"Nome deve ter no mínimo 3 caracteres"})
    name: string;

    @IsAlphanumeric()
    @IsNotEmpty({message: "Senha não pode ser vazio"})
    @MinLength(6,{message:"Senha deve ter no mínimo 6 caracteres"})
    password: string;
    
    isOnline: boolean

    @IsString()
    @IsOptional()
    profilePicture?: string;
        

}


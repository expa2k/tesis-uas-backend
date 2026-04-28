import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { user_rol } from '@prisma/client';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(user_rol)
  rol: user_rol;
}

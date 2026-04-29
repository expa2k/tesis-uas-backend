import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { propuesta_tipo } from '@prisma/client';

export class CreatePropuestaDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsEnum(propuesta_tipo)
  @IsNotEmpty()
  tipo: propuesta_tipo;

  @IsOptional()
  tecnologias?: any;

  @IsInt()
  @IsNotEmpty()
  creador_id: number;
}

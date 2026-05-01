import { IsInt, IsOptional, IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { postulacion_estado } from '@prisma/client';

export class CreatePostulacionDto {
  @IsInt()
  @IsNotEmpty()
  propuesta_id: number;

  @IsInt()
  @IsNotEmpty()
  usuario_id: number;

  @IsString()
  @IsOptional()
  mensaje?: string;

  @IsEnum(postulacion_estado)
  @IsOptional()
  estado?: postulacion_estado;
}

import { IsNotEmpty, IsOptional, IsString, IsInt, IsEnum } from 'class-validator';
import { etapa_proyecto, proyecto_estado_tipo } from '@prisma/client';

export class CreateProyectoDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsEnum(etapa_proyecto)
  @IsNotEmpty()
  etapa: etapa_proyecto;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsOptional()
  @IsEnum(proyecto_estado_tipo)
  estado_tipo?: proyecto_estado_tipo;

  @IsOptional()
  @IsInt()
  id_director?: number;

  @IsOptional()
  @IsInt()
  id_codirector?: number;
}
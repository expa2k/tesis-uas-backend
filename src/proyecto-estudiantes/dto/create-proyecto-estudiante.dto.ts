import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProyectoEstudianteDto {
  @IsInt()
  @IsNotEmpty()
  id_proyecto: number;

  @IsInt()
  @IsNotEmpty()
  id_estudiante: number;

  @IsOptional()
  @IsString()
  rol_en_proyecto?: string;
}
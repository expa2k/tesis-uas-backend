import { PartialType } from '@nestjs/mapped-types';
import { CreateProyectoDto } from './create-proyecto.dto';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { proyecto_estado_tipo } from '@prisma/client';

export class UpdateProyectoDto extends PartialType(CreateProyectoDto) {
  @IsOptional()
  @IsEnum(proyecto_estado_tipo)
  estado_tipo?: proyecto_estado_tipo;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progreso?: number;
}

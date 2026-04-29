import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateProyectoDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  etapa: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsOptional()
  @IsInt()
  director_id?: number;

  @IsOptional()
  @IsInt()
  codirector_id?: number;
}

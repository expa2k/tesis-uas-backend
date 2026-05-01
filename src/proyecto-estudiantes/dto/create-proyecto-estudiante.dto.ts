import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateProyectoEstudianteDto {
  @IsInt()
  @IsNotEmpty()
  proyecto_id: number;

  @IsInt()
  @IsNotEmpty()
  estudiante_id: number;
}

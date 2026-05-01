import { PartialType } from '@nestjs/mapped-types';
import { CreateProyectoEstudianteDto } from './create-proyecto-estudiante.dto';

export class UpdateProyectoEstudianteDto extends PartialType(CreateProyectoEstudianteDto) {}

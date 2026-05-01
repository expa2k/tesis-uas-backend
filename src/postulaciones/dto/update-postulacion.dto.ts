import { PartialType } from '@nestjs/mapped-types';
import { CreatePostulacionDto } from './create-postulacion.dto';

export class UpdatePostulacionDto extends PartialType(CreatePostulacionDto) {}

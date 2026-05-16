import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePostulacionDto {
  @IsInt()
  id_propuesta: number;

  @IsString()
  @IsOptional()
  mensaje?: string;
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropuestaDto } from './dto/create-propuesta.dto';
import { UpdatePropuestaDto } from './dto/update-propuesta.dto';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { propuestas } from '@prisma/client';

@Injectable()
export class PropuestasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPropuestaDto: CreatePropuestaDto): Promise<propuestas> {
    return this.prisma.propuestas.create({
      data: createPropuestaDto,
    });
  }

  async findAll(): Promise<propuestas[]> {
    return this.prisma.propuestas.findMany();
  }

  async findOne(id: number): Promise<propuestas> {
    const propuesta = await this.prisma.propuestas.findUnique({
      where: { id },
    });
    if (!propuesta) {
      throw new NotFoundException(`Propuesta con id ${id} no encontrada`);
    }
    return propuesta;
  }

  async update(id: number, updatePropuestaDto: UpdatePropuestaDto): Promise<propuestas> {
    await this.findOne(id); // Verifica si existe
    return this.prisma.propuestas.update({
      where: { id },
      data: {
        ...updatePropuestaDto,
        updated_at: new Date(),
      },
    });
  }

  async remove(id: number): Promise<propuestas> {
    await this.findOne(id); // Verifica si existe
    return this.prisma.propuestas.delete({
      where: { id },
    });
  }
}

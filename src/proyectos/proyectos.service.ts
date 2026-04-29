import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { proyectos } from '@prisma/client';

@Injectable()
export class ProyectosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProyectoDto: CreateProyectoDto): Promise<proyectos> {
    return this.prisma.proyectos.create({
      data: createProyectoDto,
    });
  }

  async findAll(): Promise<proyectos[]> {
    return this.prisma.proyectos.findMany();
  }

  async findOne(id: number): Promise<proyectos> {
    const proyecto = await this.prisma.proyectos.findUnique({
      where: { id },
    });
    if (!proyecto) {
      throw new NotFoundException(`Proyecto con id ${id} no encontrado`);
    }
    return proyecto;
  }

  async update(id: number, updateProyectoDto: UpdateProyectoDto): Promise<proyectos> {
    await this.findOne(id); // Verifica si existe
    return this.prisma.proyectos.update({
      where: { id },
      data: {
        ...updateProyectoDto,
        ultima_actualizacion: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async remove(id: number): Promise<proyectos> {
    await this.findOne(id); // Verifica si existe
    return this.prisma.proyectos.delete({
      where: { id },
    });
  }
}

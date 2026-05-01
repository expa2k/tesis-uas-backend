import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProyectoEstudianteDto } from './dto/create-proyecto-estudiante.dto';
import { PrismaService } from '../prisma/prisma/prisma.service';

@Injectable()
export class ProyectoEstudiantesService {
  constructor(private prisma: PrismaService) {}

  async create(createProyectoEstudianteDto: CreateProyectoEstudianteDto) {
    return this.prisma.proyecto_estudiantes.create({
      data: createProyectoEstudianteDto,
    });
  }

  async findAll() {
    return this.prisma.proyecto_estudiantes.findMany({
      include: {
        proyectos: true,
        users: {
          select: { id: true, nombre: true, email: true, rol: true }
        }
      }
    });
  }

  async findByProyecto(proyecto_id: number) {
    return this.prisma.proyecto_estudiantes.findMany({
      where: { proyecto_id },
      include: {
        users: {
          select: { id: true, nombre: true, email: true, rol: true }
        }
      }
    });
  }

  async remove(proyecto_id: number, estudiante_id: number) {
    const record = await this.prisma.proyecto_estudiantes.findUnique({
      where: {
        proyecto_id_estudiante_id: {
          proyecto_id,
          estudiante_id,
        }
      }
    });

    if (!record) {
      throw new NotFoundException(`Relación no encontrada`);
    }

    return this.prisma.proyecto_estudiantes.delete({
      where: {
        proyecto_id_estudiante_id: {
          proyecto_id,
          estudiante_id,
        }
      }
    });
  }
}

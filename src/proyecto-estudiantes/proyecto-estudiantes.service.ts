import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProyectoEstudianteDto } from './dto/create-proyecto-estudiante.dto';
import { PrismaService } from '../prisma/prisma/prisma.service';

@Injectable()
export class ProyectoEstudiantesService {
  constructor(private prisma: PrismaService) {}

  async create(createProyectoEstudianteDto: CreateProyectoEstudianteDto) {
    return this.prisma.proyecto_estudiantes.create({
      data: {
        id_proyecto: createProyectoEstudianteDto.id_proyecto,
        id_estudiante: createProyectoEstudianteDto.id_estudiante,
        rol_en_proyecto: createProyectoEstudianteDto.rol_en_proyecto,
      },
    });
  }

  async findAll() {
    return this.prisma.proyecto_estudiantes.findMany({
      include: {
        proyectos: true,
        users: {
          select: { id_usuario: true, nombre: true, email: true, rol: true }
        }
      }
    });
  }

  async findByProyecto(id_proyecto: number) {
    return this.prisma.proyecto_estudiantes.findMany({
      where: { id_proyecto },
      include: {
        users: {
          select: { id_usuario: true, nombre: true, email: true, rol: true }
        }
      }
    });
  }

  async remove(id_proyecto: number, id_estudiante: number) {
    const record = await this.prisma.proyecto_estudiantes.findUnique({
      where: {
        id_proyecto_id_estudiante: {
          id_proyecto,
          id_estudiante,
        }
      }
    });

    if (!record) {
      throw new NotFoundException(`Relación no encontrada`);
    }

    return this.prisma.proyecto_estudiantes.delete({
      where: {
        id_proyecto_id_estudiante: {
          id_proyecto,
          id_estudiante,
        }
      }
    });
  }
}
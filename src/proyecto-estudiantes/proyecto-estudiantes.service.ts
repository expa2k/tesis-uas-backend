import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProyectoEstudianteDto } from './dto/create-proyecto-estudiante.dto';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

@Injectable()
export class ProyectoEstudiantesService {
  constructor(
    private prisma: PrismaService,
    private notificacionesService: NotificacionesService
  ) {}

  async create(createProyectoEstudianteDto: CreateProyectoEstudianteDto) {
    const proyectoEstudiante = await this.prisma.proyecto_estudiantes.create({
      data: {
        id_proyecto: createProyectoEstudianteDto.id_proyecto,
        id_estudiante: createProyectoEstudianteDto.id_estudiante,
        rol_en_proyecto: createProyectoEstudianteDto.rol_en_proyecto,
      },
      include: {
        proyectos: { select: { titulo: true } },
        users: { select: { id_usuario: true, nombre: true, email: true } }
      }
    });

    // Notificar al estudiante que ha sido añadido al proyecto
    await this.notificacionesService.create({
      id_usuario: createProyectoEstudianteDto.id_estudiante,
      tipo: 'proyecto',
      titulo: 'Has sido añadido a un proyecto',
      mensaje: `Has sido añadido al proyecto "${proyectoEstudiante.proyectos.titulo}".`,
      id_referencia: createProyectoEstudianteDto.id_proyecto,
      tabla_referencia: 'proyectos'
    });

    return proyectoEstudiante;
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
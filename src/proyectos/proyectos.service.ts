import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { PrismaService } from '../prisma/prisma/prisma.service';

@Injectable()
export class ProyectosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProyectoDto: CreateProyectoDto): Promise<any> {
    return this.prisma.proyectos.create({
      data: createProyectoDto,
      include: {
        director: { select: { id_usuario: true, nombre: true, email: true } },
        codirector: { select: { id_usuario: true, nombre: true, email: true } }
      }
    });
  }

  async findAll() {
    return this.prisma.proyectos.findMany({
      include: {
        director: { select: { id_usuario: true, nombre: true, email: true } },
        codirector: { select: { id_usuario: true, nombre: true, email: true } }
      }
    });
  }

  async findOne(id: number) {
    const proyecto = await this.prisma.proyectos.findUnique({
      where: { id_proyecto: id },
      include: {
        director: { select: { id_usuario: true, nombre: true, email: true } },
        codirector: { select: { id_usuario: true, nombre: true, email: true } },
        proyecto_estudiantes: {
          include: {
            users: { select: { id_usuario: true, nombre: true, email: true } }
          }
        }
      }
    });
    if (!proyecto) {
      throw new NotFoundException(`Proyecto con id ${id} no encontrado`);
    }
    return proyecto;
  }

  async update(id: number, updateProyectoDto: UpdateProyectoDto): Promise<any> {
    await this.findOne(id);
    return this.prisma.proyectos.update({
      where: { id_proyecto: id },
      data: {
        ...updateProyectoDto,
        ultima_actualizacion: new Date(),
        updated_at: new Date(),
      },
      include: {
        director: { select: { id_usuario: true, nombre: true, email: true } },
        codirector: { select: { id_usuario: true, nombre: true, email: true } }
      }
    });
  }

  async remove(id: number): Promise<any> {
    await this.findOne(id);
    return this.prisma.proyectos.delete({
      where: { id_proyecto: id },
    });
  }

  async findByDocente(idDocente: number) {
    const proyectos = await this.prisma.proyectos.findMany({
      where: {
        OR: [
          { id_director: idDocente },
          { id_codirector: idDocente }
        ]
      },
      include: {
        director: { select: { id_usuario: true, nombre: true, email: true } },
        codirector: { select: { id_usuario: true, nombre: true, email: true } },
        proyecto_estudiantes: {
          include: {
            users: { select: { id_usuario: true, nombre: true, email: true } }
          }
        }
      },
      orderBy: { ultima_actualizacion: 'desc' }
    });

    return proyectos.map(p => ({
      id_proyecto: p.id_proyecto,
      titulo: p.titulo,
      etapa: p.etapa,
      estado: p.estado,
      estado_tipo: p.estado_tipo,
      created_at: p.created_at,
      ultima_actualizacion: p.ultima_actualizacion,
      director: p.director,
      codirector: p.codirector,
      estudiantes: p.proyecto_estudiantes.map(pe => pe.users)
    }));
  }

  async findByAlumno(idEstudiante: number) {
    const proyectos = await this.prisma.proyectos.findMany({
      where: {
        proyecto_estudiantes: {
          some: { id_estudiante: idEstudiante }
        }
      },
      include: {
        director: { select: { id_usuario: true, nombre: true, email: true } },
        codirector: { select: { id_usuario: true, nombre: true, email: true } },
        proyecto_estudiantes: {
          include: {
            users: { select: { id_usuario: true, nombre: true, email: true } }
          }
        }
      },
      orderBy: { ultima_actualizacion: 'desc' }
    });

    return proyectos.map(p => ({
      id_proyecto: p.id_proyecto,
      titulo: p.titulo,
      etapa: p.etapa,
      estado: p.estado,
      estado_tipo: p.estado_tipo,
      created_at: p.created_at,
      ultima_actualizacion: p.ultima_actualizacion,
      director: p.director,
      codirector: p.codirector,
      estudiantes: p.proyecto_estudiantes.map(pe => pe.users)
    }));
  }
}
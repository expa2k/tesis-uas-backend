import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';
import { UpdatePostulacionDto } from './dto/update-postulacion.dto';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { postulacion_estado } from '@prisma/client';

@Injectable()
export class PostulacionesService {
  constructor(private prisma: PrismaService) {}

  async create(createPostulacionDto: CreatePostulacionDto, idUsuario: number) {
    return this.prisma.postulaciones.create({
      data: {
        id_propuesta: createPostulacionDto.id_propuesta,
        id_usuario: idUsuario,
        mensaje: createPostulacionDto.mensaje,
      },
      include: {
        propuestas: { select: { titulo: true, tipo: true } },
        users: { select: { id_usuario: true, nombre: true, email: true, rol: true } }
      }
    });
  }

  async findAll() {
    return this.prisma.postulaciones.findMany({
      include: {
        propuestas: { select: { titulo: true, tipo: true, id_propuesta: true } },
        users: { select: { id_usuario: true, nombre: true, email: true, rol: true } }
      }
    });
  }

  async findOne(id: number) {
    const postulacion = await this.prisma.postulaciones.findUnique({
      where: { id_postulacion: id },
      include: {
        propuestas: { select: { titulo: true, tipo: true, id_propuesta: true } },
        users: { select: { id_usuario: true, nombre: true, email: true, rol: true } }
      }
    });
    if (!postulacion) {
      throw new NotFoundException(`Postulación con id ${id} no encontrada`);
    }
    return postulacion;
  }

  async update(id: number, updatePostulacionDto: UpdatePostulacionDto) {
    const postulacion = await this.prisma.postulaciones.findUnique({ where: { id_postulacion: id } });
    if (!postulacion) {
      throw new NotFoundException(`Postulación con id ${id} no encontrada`);
    }
    return this.prisma.postulaciones.update({
      where: { id_postulacion: id },
      data: updatePostulacionDto,
      include: {
        propuestas: { select: { titulo: true, tipo: true } },
        users: { select: { id_usuario: true, nombre: true, email: true, rol: true } }
      }
    });
  }

  async remove(id: number) {
    const postulacion = await this.prisma.postulaciones.findUnique({ where: { id_postulacion: id } });
    if (!postulacion) {
      throw new NotFoundException(`Postulación con id ${id} no encontrada`);
    }
    return this.prisma.postulaciones.delete({
      where: { id_postulacion: id },
    });
  }

  async findByAlumno(idUsuario: number) {
    const postulaciones = await this.prisma.postulaciones.findMany({
      where: { id_usuario: idUsuario },
      include: {
        propuestas: {
          include: {
            users: { select: { id_usuario: true, nombre: true, email: true } }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return postulaciones.map(p => ({
      id_postulacion: p.id_postulacion,
      id_propuesta: p.id_propuesta,
      id_usuario: p.id_usuario,
      mensaje: p.mensaje,
      estado: p.estado,
      created_at: p.created_at,
      propuesta: {
        titulo: p.propuestas.titulo,
        tipo: p.propuestas.tipo,
        creador: p.propuestas.users
      }
    }));
  }

  async cambiarEstado(id: number, estado: postulacion_estado, idDocente: number) {
    const postulacion = await this.prisma.postulaciones.findUnique({
      where: { id_postulacion: id },
      include: {
        propuestas: { include: { users: true } }
      }
    });

    if (!postulacion) {
      throw new NotFoundException(`Postulación con id ${id} no encontrada`);
    }

    if (postulacion.propuestas.users.id_usuario !== idDocente) {
      throw new ForbiddenException('No tienes permiso para cambiar el estado de esta postulación');
    }

    const updated = await this.prisma.postulaciones.update({
      where: { id_postulacion: id },
      data: { estado, updated_at: new Date() },
      include: {
        propuestas: { select: { titulo: true, tipo: true } },
        users: { select: { id_usuario: true, nombre: true, email: true, rol: true } }
      }
    });

    await this.prisma.notificaciones.create({
      data: {
        id_usuario: postulacion.id_usuario,
        tipo: 'postulacion',
        titulo: estado === 'aceptada' ? 'Postulación aceptada' : 'Postulación rechazada',
        mensaje: `Tu postulación al proyecto "${postulacion.propuestas.titulo}" ha sido ${estado === 'aceptada' ? 'aceptada' : 'rechazada'}.`,
        id_referencia: id,
        tabla_referencia: 'postulaciones'
      }
    });

    return updated;
  }
}
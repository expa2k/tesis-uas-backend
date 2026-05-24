import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { notificacion_tipo } from '@prisma/client';

@Injectable()
export class NotificacionesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    id_usuario: number;
    tipo: notificacion_tipo;
    titulo: string;
    mensaje: string;
    id_referencia: number;
    tabla_referencia: string;
  }) {
    return this.prisma.notificaciones.create({
      data
    });
  }

  async findAll(idUsuario: number, leida?: boolean) {
    const where: any = { id_usuario: idUsuario };
    if (leida !== undefined) {
      where.leida = leida;
    }
    return this.prisma.notificaciones.findMany({
      where,
      orderBy: { created_at: 'desc' }
    });
  }

  async marcarLeida(id: number, idUsuario: number) {
    const notificacion = await this.prisma.notificaciones.findFirst({
      where: { id_notificacion: id, id_usuario: idUsuario }
    });
    if (!notificacion) {
      throw new NotFoundException('Notificación no encontrada');
    }
    return this.prisma.notificaciones.update({
      where: { id_notificacion: id },
      data: { leida: true }
    });
  }

  async marcarTodasLeidas(idUsuario: number) {
    return this.prisma.notificaciones.updateMany({
      where: { id_usuario: idUsuario, leida: false },
      data: { leida: true }
    });
  }

  async countNoLeidas(idUsuario: number) {
    return this.prisma.notificaciones.count({
      where: { id_usuario: idUsuario, leida: false }
    });
  }
}
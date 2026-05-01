import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';
import { UpdatePostulacionDto } from './dto/update-postulacion.dto';
import { PrismaService } from '../prisma/prisma/prisma.service';

@Injectable()
export class PostulacionesService {
  constructor(private prisma: PrismaService) {}

  async create(createPostulacionDto: CreatePostulacionDto) {
    return this.prisma.postulaciones.create({
      data: createPostulacionDto,
    });
  }

  async findAll() {
    return this.prisma.postulaciones.findMany({
      include: {
        propuestas: true,
        users: {
          select: { id: true, nombre: true, email: true, rol: true }
        }
      }
    });
  }

  async findOne(id: number) {
    const postulacion = await this.prisma.postulaciones.findUnique({
      where: { id },
      include: {
        propuestas: true,
        users: {
          select: { id: true, nombre: true, email: true, rol: true }
        }
      }
    });
    if (!postulacion) {
      throw new NotFoundException(`Postulación con id ${id} no encontrada`);
    }
    return postulacion;
  }

  async update(id: number, updatePostulacionDto: UpdatePostulacionDto) {
    const postulacion = await this.prisma.postulaciones.findUnique({ where: { id } });
    if (!postulacion) {
      throw new NotFoundException(`Postulación con id ${id} no encontrada`);
    }
    return this.prisma.postulaciones.update({
      where: { id },
      data: updatePostulacionDto,
    });
  }

  async remove(id: number) {
    const postulacion = await this.prisma.postulaciones.findUnique({ where: { id } });
    if (!postulacion) {
      throw new NotFoundException(`Postulación con id ${id} no encontrada`);
    }
    return this.prisma.postulaciones.delete({
      where: { id },
    });
  }
}

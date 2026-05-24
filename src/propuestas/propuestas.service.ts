import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropuestaDto } from './dto/create-propuesta.dto';
import { UpdatePropuestaDto } from './dto/update-propuesta.dto';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { propuesta_tipo } from '@prisma/client';

@Injectable()
export class PropuestasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPropuestaDto: CreatePropuestaDto, idCreador: number): Promise<any> {
    return this.prisma.propuestas.create({
      data: {
        titulo: createPropuestaDto.titulo,
        descripcion: createPropuestaDto.descripcion,
        tipo: createPropuestaDto.tipo,
        tecnologias: createPropuestaDto.tecnologias,
        id_creador: idCreador,
      },
      include: {
        users: {
          select: { id_usuario: true, nombre: true, email: true }
        }
      }
    });
  }

  async findAll() {
    const propuestas = await this.prisma.propuestas.findMany({
      include: {
        users: {
          select: { id_usuario: true, nombre: true, email: true }
        },
        postulaciones: {
          include: {
            users: {
              select: { id_usuario: true, nombre: true, email: true }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return propuestas.map(p => ({
      id_propuesta: p.id_propuesta,
      titulo: p.titulo,
      descripcion: p.descripcion,
      tipo: p.tipo,
      tecnologias: p.tecnologias,
      created_at: p.created_at,
      creador: p.users,
      postulaciones: p.postulaciones,
      id_creador: p.id_creador
    }));
  }

  async findOne(id: number) {
    const propuesta = await this.prisma.propuestas.findUnique({
      where: { id_propuesta: id },
      include: {
        users: {
          select: { id_usuario: true, nombre: true, email: true }
        }
      }
    });
    if (!propuesta) {
      throw new NotFoundException(`Propuesta con id ${id} no encontrada`);
    }
    return propuesta;
  }

  async update(id: number, updatePropuestaDto: UpdatePropuestaDto): Promise<any> {
    await this.findOne(id);
    return this.prisma.propuestas.update({
      where: { id_propuesta: id },
      data: {
        ...updatePropuestaDto,
        updated_at: new Date(),
      },
      include: {
        users: {
          select: { id_usuario: true, nombre: true, email: true }
        }
      }
    });
  }

  async remove(id: number): Promise<any> {
    await this.findOne(id);
    return this.prisma.propuestas.delete({
      where: { id_propuesta: id },
    });
  }
}
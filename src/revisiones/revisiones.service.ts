import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma/prisma.service';

@Injectable()
export class RevisionesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.revisiones.findMany({
      include: {
        proyectos: true,
        users: true
      }
    });
  }

  findByRevisor(revisorId: number) {
    return this.prisma.revisiones.findMany({
      where: { revisor_id: revisorId },
      include: {
        proyectos: {
          include: {
            proyecto_estudiantes: {
              include: { users: true }
            }
          }
        }
      }
    });
  }
}

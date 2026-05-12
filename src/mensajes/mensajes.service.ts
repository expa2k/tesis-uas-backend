import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma/prisma.service';

@Injectable()
export class MensajesService {
  constructor(private prisma: PrismaService) {}

  findByUser(userId: number) {
    return this.prisma.mensajes.findMany({
      where: {
        OR: [
          { destinatario_id: userId },
          { remitente_id: userId }
        ]
      },
      include: {
        remitente: true,
        destinatario: true
      },
      orderBy: { created_at: 'desc' }
    });
  }
}

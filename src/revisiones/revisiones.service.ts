import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { revision_estado } from '@prisma/client';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class RevisionesService {
  constructor(
    private prisma: PrismaService,
    private notificacionesService: NotificacionesService
  ) {}

  async create(data: { id_proyecto: number; tipo: string; documento_path: string }, idEstudiante: number) {
    const proyecto = await this.prisma.proyectos.findUnique({
      where: { id_proyecto: data.id_proyecto }
    });

    if (!proyecto) {
      throw new NotFoundException(`Proyecto con id ${data.id_proyecto} no encontrado`);
    }

    const revision = await this.prisma.revisiones.create({
      data: {
        id_proyecto: data.id_proyecto,
        id_estudiante: idEstudiante,
        tipo: data.tipo,
        documento_path: data.documento_path
      },
      include: {
        proyectos: { select: { titulo: true } },
        users: { select: { id_usuario: true, nombre: true, email: true } }
      }
    });

    if (proyecto.id_director) {
      await this.notificacionesService.create({
        id_usuario: proyecto.id_director,
        tipo: 'revision',
        titulo: 'Nueva revisión enviada',
        mensaje: `El estudiante ha enviado una nueva revisión para el proyecto "${proyecto.titulo}".`,
        id_referencia: revision.id_revision,
        tabla_referencia: 'revisiones'
      });
    }

    return revision;
  }

  async generarDocumentoCompleto(id_proyecto: number, idEstudiante: number, etapa: string) {
    const proyecto = await this.prisma.proyectos.findUnique({
      where: { id_proyecto },
    });

    if (!proyecto) {
      throw new NotFoundException(`Proyecto con id ${id_proyecto} no encontrado`);
    }

    const uploadsDir = join(process.cwd(), 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const lines = [
      `Documento completo - ${proyecto.titulo}`,
      `Etapa: ${etapa}`,
      `Generado por: ${idEstudiante}`,
      `Fecha: ${new Date().toLocaleString('es-ES')}`,
      '',
      'Este archivo ha sido generado automáticamente como documento completo de la etapa correspondiente.',
    ];

    let y = height - 60;
    page.drawText(lines.shift() ?? '', {
      x: 50,
      y,
      size: 18,
      font,
    });
    y -= 28;

    for (const line of lines) {
      page.drawText(line, {
        x: 50,
        y,
        size: 12,
        font,
      });
      y -= 18;
    }

    const fileName = `documento-completo-${id_proyecto}-${Date.now()}.pdf`;
    const filePath = join(uploadsDir, fileName);
    const pdfBytes = await pdfDoc.save();
    await writeFile(filePath, pdfBytes);

    const documento_path = `/uploads/${fileName}`;

    const revision = await this.prisma.revisiones.create({
      data: {
        id_proyecto,
        id_estudiante: idEstudiante,
        tipo: 'Documento completo',
        documento_path,
      },
      include: {
        proyectos: { select: { titulo: true } },
        users: { select: { id_usuario: true, nombre: true, email: true } },
      },
    });

    if (proyecto.id_director) {
      await this.notificacionesService.create({
        id_usuario: proyecto.id_director,
        tipo: 'revision',
        titulo: 'Documento completo generado',
        mensaje: `Se ha generado el documento completo para el proyecto "${proyecto.titulo}".`,
        id_referencia: revision.id_revision,
        tabla_referencia: 'revisiones',
      });
    }

    return { path: documento_path, revision };
  }

  async findAll() {
    return this.prisma.revisiones.findMany({
      include: {
        proyectos: { select: { titulo: true, id_proyecto: true } },
        users: { select: { id_usuario: true, nombre: true, email: true } }
      },
      orderBy: { fecha: 'desc' }
    });
  }

  async findByProyecto(idProyecto: number) {
    return this.prisma.revisiones.findMany({
      where: { id_proyecto: idProyecto },
      include: {
        proyectos: { select: { titulo: true, id_proyecto: true } },
        users: { select: { id_usuario: true, nombre: true, email: true } }
      },
      orderBy: { fecha: 'desc' }
    });
  }

  async cambiarEstado(id: number, estado: revision_estado, comentario: string, idDocente: number) {
    const revision = await this.prisma.revisiones.findUnique({
      where: { id_revision: id },
      include: {
        proyectos: true
      }
    });

    if (!revision) {
      throw new NotFoundException(`Revisión con id ${id} no encontrada`);
    }

    const updated = await this.prisma.revisiones.update({
      where: { id_revision: id },
      data: { estado, comentario },
      include: {
        proyectos: { select: { titulo: true } },
        users: { select: { id_usuario: true, nombre: true, email: true } }
      }
    });

    await this.notificacionesService.create({
      id_usuario: revision.id_estudiante,
      tipo: 'revision',
      titulo: estado === 'aceptada' ? 'Revisión aceptada' : 'Revisión requiere cambios',
      mensaje: `Tu revisión del proyecto "${revision.proyectos.titulo}" ha sido ${estado === 'aceptada' ? 'aceptada' : 'marcada como requiere cambios'}.`,
      id_referencia: id,
      tabla_referencia: 'revisiones'
    });

    return updated;
  }
}
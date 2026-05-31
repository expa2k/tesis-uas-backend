import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { revision_estado } from '@prisma/client';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

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
    console.log('🔍 Iniciando generación de documento:', { id_proyecto, idEstudiante, etapa });

    const proyecto = await this.prisma.proyectos.findUnique({
      where: { id_proyecto },
    });

    if (!proyecto) {
      console.error('❌ Proyecto no encontrado:', id_proyecto);
      throw new NotFoundException(`Proyecto con id ${id_proyecto} no encontrado`);
    }

    console.log('✅ Proyecto encontrado:', proyecto.titulo);

    // Definir las subetapas para cada etapa
    const etapasMap: Record<string, string[]> = {
      'Etapa 1: Documentación del Prototipo': [
        'Descripción',
        'Diagramas de C.U.',
        'Arquitectura',
        'Entidad-Relación',
        'Interfaces',
      ],
      'Etapa 2: Desarrollo del Prototipo': [
        'Avance 25%',
        'Avance 50%',
        'Avance 75%',
        'Avance 100%',
      ],
      'Etapa 3: Capítulo 1 Introducción': [
        'Objetivos',
        'Antecedentes',
        'Planteamiento del problema',
        'Preguntas de investigación',
        'Justificación',
        'Viabilidad',
        'Metodología',
      ],
      'Etapa 4: Capítulo 2 Marco Teórico': [
        'Revisión de literatura',
        'Desarrollo de conceptos',
      ],
    };

    const subetapas = etapasMap[etapa] || [];
    console.log('📋 Subetapas a incluir:', subetapas);

    try {
      // Primero, obtener TODAS las revisiones del proyecto para debuggear
      const todasRevisions = await this.prisma.revisiones.findMany({
        where: { id_proyecto },
      });
      console.log(`🔍 Total de revisiones en proyecto: ${todasRevisions.length}`);
      console.log('📋 Tipos de revisiones encontradas:', todasRevisions.map(r => ({ tipo: r.tipo, estado: r.estado })));

      // Obtener todas las revisiones aprobadas de esas subetapas
      const revisionesAprobadas = await this.prisma.revisiones.findMany({
        where: {
          id_proyecto,
          estado: 'aceptada',
          tipo: { in: subetapas },
        },
        orderBy: [{ tipo: 'asc' }, { fecha: 'desc' }],
      });

      console.log(`📄 Encontradas ${revisionesAprobadas.length} revisiones aprobadas`);
      if (revisionesAprobadas.length > 0) {
        console.log('📋 Revisiones aprobadas:', revisionesAprobadas.map(r => ({ tipo: r.tipo, path: r.documento_path })));
      }

      const pdfDoc = await PDFDocument.create();

      // Agregar página de portada
      const portadaPage = pdfDoc.addPage();
      const { width, height } = portadaPage.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      portadaPage.drawText(proyecto.titulo, {
        x: 50,
        y: height - 100,
        size: 24,
        font: boldFont,
      });

      portadaPage.drawText(`${etapa}`, {
        x: 50,
        y: height - 150,
        size: 16,
        font,
      });

      portadaPage.drawText(`Generado: ${new Date().toLocaleString('es-ES')}`, {
        x: 50,
        y: height - 200,
        size: 12,
        font,
      });

      // Procesar cada revisión aprobada
      for (const revision of revisionesAprobadas) {
        console.log(`📥 Procesando revisión: ${revision.tipo}`);
        const filePath = path.join(process.cwd(), revision.documento_path);

        if (!fs.existsSync(filePath)) {
          console.warn(`⚠️ Archivo no encontrado: ${filePath}`);
          
          // Agregar página con aviso si el archivo no existe
          const avisoPage = pdfDoc.addPage();
          avisoPage.drawText(`${revision.tipo}`, {
            x: 50,
            y: height - 60,
            size: 14,
            font: boldFont,
          });
          avisoPage.drawText('Archivo no disponible', {
            x: 50,
            y: height - 100,
            size: 12,
            font,
          });
          continue;
        }

        try {
          const fileExt = path.extname(filePath).toLowerCase();

          if (fileExt === '.pdf') {
            // Si es PDF, incorporarlo
            const existingPdfBytes = fs.readFileSync(filePath);
            const pdfToMerge = await PDFDocument.load(existingPdfBytes);
            const pages = await pdfDoc.copyPages(pdfToMerge, pdfToMerge.getPageIndices());

            for (const page of pages) {
              pdfDoc.addPage(page);
            }

            console.log(`✅ PDF incorporado: ${revision.tipo}`);
          } else {
            // Para otros formatos (docx, doc), agregar una referencia
            const tituloPage = pdfDoc.addPage();
            tituloPage.drawText(`${revision.tipo}`, {
              x: 50,
              y: height - 60,
              size: 14,
              font: boldFont,
            });
            tituloPage.drawText(
              `Archivo: ${path.basename(filePath)}`,
              {
                x: 50,
                y: height - 100,
                size: 12,
                font,
              }
            );
            tituloPage.drawText(
              `Nota: Este archivo está en formato ${fileExt.toUpperCase()} y no pudo ser incorporado directamente.`,
              {
                x: 50,
                y: height - 140,
                size: 10,
                font,
              }
            );

            console.log(`ℹ️ Archivo ${fileExt} referenciado: ${revision.tipo}`);
          }
        } catch (fileError) {
          console.error(`❌ Error procesando archivo: ${revision.tipo}`, fileError);
          
          // Agregar página de error
          const errorPage = pdfDoc.addPage();
          errorPage.drawText(`${revision.tipo}`, {
            x: 50,
            y: height - 60,
            size: 14,
            font: boldFont,
          });
          errorPage.drawText('Error al procesar el archivo', {
            x: 50,
            y: height - 100,
            size: 12,
            font,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const buffer = Buffer.from(pdfBytes);
      console.log('✅ PDF generado exitosamente. Tamaño:', buffer.length, 'bytes');
      return buffer;
    } catch (error) {
      console.error('❌ Error al generar PDF:', error);
      throw error;
    }
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
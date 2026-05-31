/// <reference types="multer" />
import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException, StreamableFile, Response } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RevisionesService } from './revisiones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { revision_estado } from '@prisma/client';

@Controller('revisiones')
@UseGuards(JwtAuthGuard)
export class RevisionesController {
  constructor(private readonly revisionesService: RevisionesService) {}

  @Post('upload')
  @UseGuards(RolesGuard)
  @Roles('Estudiante')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    })
  }))
  createWithUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body('id_proyecto', ParseIntPipe) id_proyecto: number,
    @Body('tipo') tipo: string,
    @Req() req: any
  ) {
    if (!file) throw new BadRequestException('Archivo no proporcionado');
    const documento_path = `/uploads/${file.filename}`;
    return this.revisionesService.create({ id_proyecto, tipo, documento_path }, req.user.id_usuario);
  }

  @Post('generar-documento-completo')
  @UseGuards(RolesGuard)
  @Roles('Estudiante')
  async generarDocumentoCompleto(
    @Body('id_proyecto', ParseIntPipe) id_proyecto: number,
    @Body('etapa') etapa: string,
    @Req() req: any,
    @Response() res: any
  ) {
    if (!id_proyecto || !etapa) {
      throw new BadRequestException('id_proyecto y etapa son requeridos');
    }

    try {
      const buffer = await this.revisionesService.generarDocumentoCompleto(id_proyecto, req.user.id_usuario, etapa);
      
      // Establecer headers correctamente
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="documento-completo-${id_proyecto}.pdf"`,
        'Content-Length': buffer.length,
      });

      // Enviar el buffer binario
      res.send(buffer);
    } catch (error) {
      console.error('Error generando documento:', error);
      throw error;
    }
  }

  @Get()
  findAll(@Req() req: any) {
    if (req.user.rol === 'Docente') {
      return this.revisionesService.findAll();
    }
    return this.revisionesService.findAll();
  }

  @Get('proyecto/:id_proyecto')
  findByProyecto(@Param('id_proyecto', ParseIntPipe) id_proyecto: number) {
    return this.revisionesService.findByProyecto(id_proyecto);
  }

  @Patch(':id/estado')
  @UseGuards(RolesGuard)
  @Roles('Docente')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: revision_estado,
    @Body('comentario') comentario: string,
    @Req() req: any
  ) {
    return this.revisionesService.cambiarEstado(id, estado, comentario, req.user.id_usuario);
  }
}
import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { RevisionesService } from './revisiones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { revision_estado } from '@prisma/client';

@Controller('revisiones')
@UseGuards(JwtAuthGuard)
export class RevisionesController {
  constructor(private readonly revisionesService: RevisionesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('Estudiante')
  create(@Body() data: { id_proyecto: number; tipo: string; documento_path: string }, @Req() req: any) {
    return this.revisionesService.create(data, req.user.id_usuario);
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
    @Req() req: any
  ) {
    return this.revisionesService.cambiarEstado(id, estado, req.user.id_usuario);
  }
}
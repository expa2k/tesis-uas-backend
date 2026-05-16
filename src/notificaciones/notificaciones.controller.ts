import { Controller, Get, Patch, Param, ParseIntPipe, UseGuards, Req, Query } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notificaciones')
@UseGuards(JwtAuthGuard)
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Get()
  findAll(@Req() req: any, @Query('leida') leida?: string) {
    const leidaFilter = leida === 'true' ? true : leida === 'false' ? false : undefined;
    return this.notificacionesService.findAll(req.user.id_usuario, leidaFilter);
  }

  @Patch(':id/leer')
  marcarLeida(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.notificacionesService.marcarLeida(id, req.user.id_usuario);
  }

  @Patch('leer-todas')
  marcarTodasLeidas(@Req() req: any) {
    return this.notificacionesService.marcarTodasLeidas(req.user.id_usuario);
  }
}
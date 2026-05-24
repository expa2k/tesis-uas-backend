import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { PostulacionesService } from './postulaciones.service';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';
import { UpdatePostulacionDto } from './dto/update-postulacion.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { postulacion_estado } from '@prisma/client';

@Controller('postulaciones')
@UseGuards(JwtAuthGuard)
export class PostulacionesController {
  constructor(private readonly postulacionesService: PostulacionesService) {}

  @Post()
  create(@Body() createPostulacionDto: CreatePostulacionDto, @Req() req: any) {
    return this.postulacionesService.create(createPostulacionDto, req.user.id_usuario);
  }

  @Get()
  findAll() {
    return this.postulacionesService.findAll();
  }

  @Get('mis-postulaciones')
  findMyPostulaciones(@Req() req: any) {
    return this.postulacionesService.findByAlumno(req.user.id_usuario);
  }

  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: postulacion_estado,
    @Req() req: any
  ) {
    return this.postulacionesService.cambiarEstado(id, estado, req.user.id_usuario);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postulacionesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostulacionDto: UpdatePostulacionDto) {
    return this.postulacionesService.update(id, updatePostulacionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postulacionesService.remove(id);
  }
}
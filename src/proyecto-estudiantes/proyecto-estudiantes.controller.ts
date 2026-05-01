import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProyectoEstudiantesService } from './proyecto-estudiantes.service';
import { CreateProyectoEstudianteDto } from './dto/create-proyecto-estudiante.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('proyecto-estudiantes')
export class ProyectoEstudiantesController {
  constructor(private readonly proyectoEstudiantesService: ProyectoEstudiantesService) {}

  @Post()
  create(@Body() createProyectoEstudianteDto: CreateProyectoEstudianteDto) {
    return this.proyectoEstudiantesService.create(createProyectoEstudianteDto);
  }

  @Get()
  findAll() {
    return this.proyectoEstudiantesService.findAll();
  }

  @Get('proyecto/:proyecto_id')
  findByProyecto(@Param('proyecto_id', ParseIntPipe) proyecto_id: number) {
    return this.proyectoEstudiantesService.findByProyecto(proyecto_id);
  }

  @Delete(':proyecto_id/:estudiante_id')
  remove(
    @Param('proyecto_id', ParseIntPipe) proyecto_id: number,
    @Param('estudiante_id', ParseIntPipe) estudiante_id: number
  ) {
    return this.proyectoEstudiantesService.remove(proyecto_id, estudiante_id);
  }
}

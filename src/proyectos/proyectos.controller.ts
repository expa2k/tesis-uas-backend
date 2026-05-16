import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('proyectos')
@UseGuards(JwtAuthGuard)
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  @Post()
  create(@Body() createProyectoDto: CreateProyectoDto) {
    return this.proyectosService.create(createProyectoDto);
  }

  @Get()
  findAll() {
    return this.proyectosService.findAll();
  }

  @Get('docente')
  @UseGuards(RolesGuard)
  @Roles('Docente')
  findByDocente(@Req() req: any) {
    return this.proyectosService.findByDocente(req.user.id_usuario);
  }

  @Get('alumno')
  @UseGuards(RolesGuard)
  @Roles('Estudiante')
  findByAlumno(@Req() req: any) {
    return this.proyectosService.findByAlumno(req.user.id_usuario);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.proyectosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProyectoDto: UpdateProyectoDto) {
    return this.proyectosService.update(id, updateProyectoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.proyectosService.remove(id);
  }
}
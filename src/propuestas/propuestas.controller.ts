import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req, Query } from '@nestjs/common';
import { PropuestasService } from './propuestas.service';
import { CreatePropuestaDto } from './dto/create-propuesta.dto';
import { UpdatePropuestaDto } from './dto/update-propuesta.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('propuestas')
@UseGuards(JwtAuthGuard)
export class PropuestasController {
  constructor(private readonly propuestasService: PropuestasService) {}

  @Post()
  create(@Body() createPropuestaDto: CreatePropuestaDto, @Req() req: any) {
    return this.propuestasService.create(createPropuestaDto, req.user.id_usuario);
  }

  @Get()
  findAll() {
    return this.propuestasService.findAll();
  }

  @Get('docente')
  @UseGuards(RolesGuard)
  @Roles('Docente')
  findByDocente(
    @Query('tipo') tipo?: string,
    @Query('estado_postulacion') estadoPostulacion?: string
  ) {
    return this.propuestasService.findByDocente({ tipo, estado_postulacion: estadoPostulacion });
  }

  @Get('alumno')
  @UseGuards(RolesGuard)
  @Roles('Estudiante')
  findByAlumno(@Req() req: any) {
    return this.propuestasService.findByAlumno(req.user.id_usuario);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.propuestasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePropuestaDto: UpdatePropuestaDto) {
    return this.propuestasService.update(id, updatePropuestaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.propuestasService.remove(id);
  }
}
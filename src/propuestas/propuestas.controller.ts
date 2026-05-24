import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req, Query } from '@nestjs/common';
import { PropuestasService } from './propuestas.service';
import { CreatePropuestaDto } from './dto/create-propuesta.dto';
import { UpdatePropuestaDto } from './dto/update-propuesta.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
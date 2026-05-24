import { Module } from '@nestjs/common';
import { ProyectoEstudiantesService } from './proyecto-estudiantes.service';
import { ProyectoEstudiantesController } from './proyecto-estudiantes.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';

@Module({
  imports: [PrismaModule, NotificacionesModule],
  controllers: [ProyectoEstudiantesController],
  providers: [ProyectoEstudiantesService],
})
export class ProyectoEstudiantesModule {}

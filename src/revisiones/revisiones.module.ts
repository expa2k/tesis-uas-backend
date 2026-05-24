import { Module } from '@nestjs/common';
import { RevisionesService } from './revisiones.service';
import { RevisionesController } from './revisiones.controller';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';

@Module({
  imports: [NotificacionesModule],
  controllers: [RevisionesController],
  providers: [RevisionesService],
  exports: [RevisionesService],
})
export class RevisionesModule {}

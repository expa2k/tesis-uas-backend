import { Module } from '@nestjs/common';
import { RevisionesService } from './revisiones.service';
import { RevisionesController } from './revisiones.controller';

@Module({
  controllers: [RevisionesController],
  providers: [RevisionesService],
  exports: [RevisionesService],
})
export class RevisionesModule {}

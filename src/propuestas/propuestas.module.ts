import { Module } from '@nestjs/common';
import { PropuestasService } from './propuestas.service';
import { PropuestasController } from './propuestas.controller';

@Module({
  controllers: [PropuestasController],
  providers: [PropuestasService],
})
export class PropuestasModule {}

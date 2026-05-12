import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { RevisionesService } from './revisiones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('revisiones')
@UseGuards(JwtAuthGuard)
export class RevisionesController {
  constructor(private readonly revisionesService: RevisionesService) {}

  @Get()
  findAll(@Req() req: any) {
    const user = req.user;
    if (user.rol === 'Docente') {
      return this.revisionesService.findByRevisor(user.id);
    }
    return this.revisionesService.findAll();
  }
}

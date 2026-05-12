import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { MensajesService } from './mensajes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('mensajes')
@UseGuards(JwtAuthGuard)
export class MensajesController {
  constructor(private readonly mensajesService: MensajesService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.mensajesService.findByUser(req.user.id);
  }
}

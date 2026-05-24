import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { PropuestasModule } from './propuestas/propuestas.module';
import { PostulacionesModule } from './postulaciones/postulaciones.module';
import { ProyectoEstudiantesModule } from './proyecto-estudiantes/proyecto-estudiantes.module';
import { RevisionesModule } from './revisiones/revisiones.module';
import { MensajesModule } from './mensajes/mensajes.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    ProyectosModule,
    PropuestasModule,
    PostulacionesModule,
    ProyectoEstudiantesModule,
    RevisionesModule,
    MensajesModule,
    NotificacionesModule,
  ],
})
export class AppModule {}

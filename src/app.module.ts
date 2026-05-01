import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { PropuestasModule } from './propuestas/propuestas.module';
import { PostulacionesModule } from './postulaciones/postulaciones.module';
import { ProyectoEstudiantesModule } from './proyecto-estudiantes/proyecto-estudiantes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    PrismaModule,
    ProyectosModule,
    PropuestasModule,
    PostulacionesModule,
    ProyectoEstudiantesModule,
  ],
})
export class AppModule {}

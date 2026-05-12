import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';

@Entity('revisiones')
export class Revision {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: string; // e.g., 'Protocolo', 'Capítulo 1', etc.

  @Column({ default: 'Pendiente' }) // Pendiente, Aprobado, Con Correcciones
  estado: string;

  @Column({ nullable: true })
  documentoUrl: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @ManyToOne(() => Proyecto)
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: Proyecto;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'revisor_id' })
  revisor: User; // El Docente que revisa

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ESTUDIANTE = 'Estudiante',
  DOCENTE = 'Docente',
  COORDINADOR = 'Coordinador',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.ESTUDIANTE })
  rol: UserRole;

  @Column({ length: 150, nullable: true })
  carrera: string;

  @Column({ length: 20, nullable: true })
  matricula: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

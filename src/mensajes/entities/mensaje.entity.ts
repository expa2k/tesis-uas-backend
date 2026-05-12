import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('mensajes')
export class Mensaje {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  asunto: string;

  @Column({ type: 'text' })
  contenido: string;

  @Column({ default: false })
  leido: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'remitente_id' })
  remitente: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'destinatario_id' })
  destinatario: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
